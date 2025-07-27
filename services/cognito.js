//Load aws module and crypto for hashing.
require('dotenv').config();
const { 
    AdminUpdateUserAttributesCommand, 
    RespondToAuthChallengeCommand, 
    AdminInitiateAuthCommand, 
    AdminAddUserToGroupCommand, 
    AdminSetUserPasswordCommand, 
    CognitoIdentityProviderClient, 
    AdminConfirmSignUpCommand, 
    SignUpCommand, 
    InitiateAuthCommand,
    ConfirmSignUpCommand // Added for modern verifyCode function
} = require("@aws-sdk/client-cognito-identity-provider");
const crypto = require('crypto');
const userAttributes = require('../dao/cognitoUsers');

// Set fetch, because some aws cognito libs were created for browsers.
// This is good practice to keep if any dependency needs it.
global.fetch = require('node-fetch');

// AWS SDK v3 configurations
const cognitoISP = new CognitoIdentityProviderClient({
  region: process.env.USERPOOL_REGION
});

/**
 * =======================================================================
 * IMPORTANT: SECRET HASH CALCULATION
 * =======================================================================
 * This function is required because your Cognito App Client has a secret.
 * It creates an HMAC SHA-256 hash using the client secret as the key.
 * The data being hashed is the concatenation of the username and the client ID.
 */
const getSecretHash = (username) => {
  const hmac = crypto.createHmac('sha256', process.env.APP_CLIENT_SECRET);
  hmac.update(username + process.env.APP_CLIENT_ID);
  return hmac.digest('base64');
};


// Verify the registration code using AWS SDK v3.
const verifyCode = async (username, code) => {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.APP_CLIENT_ID,
    ConfirmationCode: code,
    Username: username,
    SecretHash: getSecretHash(username), // SECRET_HASH ADDED
  });

  try {
    const result = await cognitoISP.send(command);
    return result;
  } catch (error) {
    throw error;
  }
};



// Confirm User manually (Admin command, no SecretHash needed)
const confirmUser = async(body) => {
  const params = new AdminConfirmSignUpCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: body.email,
   });

  try {
    const userConfirmed = await cognitoISP.send(params);
    return userConfirmed;
  } catch (err) {
    throw err;
  }
};

// Manually verify the user's email (Admin command, no SecretHash needed)
const verifyEmail = async (body) => {
  const updateUserAttributesParams = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: body.email,
    UserAttributes: [
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
  };

  try {
    const updateUserAttributesCommand = new AdminUpdateUserAttributesCommand(updateUserAttributesParams);
    await cognitoISP.send(updateUserAttributesCommand);
  } catch (err) {
      console.log('Error in user verify email:', err);
      throw new Error(`Error in user verify email: ${err}`);
  }
};

// Register a new user.
const signUp = async (body) => {
    try {
      const customAttributeList = userAttributes.daoUserAttributes(body);
      const signUpCommand = new SignUpCommand({
        ClientId: process.env.APP_CLIENT_ID,
        Password: body.password,
        Username: body.email,
        SecretHash: getSecretHash(body.email), // SECRET_HASH ADDED
        UserAttributes: customAttributeList,
        ValidationData: [
          { Name: 'email', Value: body.email },
        ],
      });

      await cognitoISP.send(signUpCommand);

      // These are admin commands and don't need the hash
      await confirmUser(body);
     
      // Log the user in after successful sign-up
      const userUserLogin = await login(body.email, body.password);
      return userUserLogin;
    } catch (err) {
      throw err;
    }
};

// Authenticate in Cognito.
const login = async (email, password) => {
  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.APP_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: getSecretHash(email), // SECRET_HASH ADDED
    },
  });

  try {
    const result = await cognitoISP.send(initiateAuthCommand);
    const { AccessToken, IdToken, RefreshToken } = result.AuthenticationResult;
    return { accessToken: AccessToken, idToken: IdToken, refreshToken: RefreshToken };
  } catch (err) {
    throw err;
  }
};

// This function uses ADMIN_NO_SRP_AUTH, which relies on IAM credentials, not a secret hash.
// However, the challenge response might need it.
const authenticateAndGetAccessToken = async (username, password) => {
    const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.APP_CLIENT_ID,
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    try {
        const response = await cognitoISP.send(adminInitiateAuthCommand);

        if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
          const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
            ClientId: process.env.APP_CLIENT_ID,
            ChallengeName: "NEW_PASSWORD_REQUIRED",
            ChallengeResponses: {
              USERNAME: username,
              NEW_PASSWORD: password,
              SECRET_HASH: getSecretHash(username) // SECRET_HASH ADDED
            },
            Session: response.Session
          });

          const authResponse = await cognitoISP.send(respondToAuthChallengeCommand);
          return authResponse.AuthenticationResult.AccessToken;
        } else {
          return response.AuthenticationResult.AccessToken;
        }
    } catch (err) {
        throw err;
    }
};

// This function uses admin commands, which are fine. The logic inside authenticateAndGetAccessToken is now fixed.
const confirmPasswordChange = async (username, password) => {
    await authenticateAndGetAccessToken(username, password);
    const adminSetUserPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: username,
        Password: password,
        Permanent: true
    });
    await cognitoISP.send(adminSetUserPasswordCommand);
};


// confirmPass and changePwd use admin commands or call other functions that are now fixed.
const confirmPass = async (username, newpassword) => {
    const changePasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
      Password: newpassword,
    });
    
    await cognitoISP.send(changePasswordCommand);
    await confirmPasswordChange(username, newpassword);
    return { message: 'Password confirmed successfully.' };
};

const changePwd = async (username, password, newPassword) => {
    const changePasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
      Password: password,
    });

    await cognitoISP.send(changePasswordCommand);
    await confirmPasswordChange(username, newPassword);
    return { message: 'Password changed successfully.' };
};

// Updated to use modern async/await and handle errors consistently.
const updateUser = async (req, res) => {
    const { body } = req;
    body.token = req.headers['access_token'];

    try {
        const customAttributeList = userAttributes.daoUserAttributes(body);
    
        if (customAttributeList.length > 0) {
            const params = {
                UserAttributes: customAttributeList,
                UserPoolId: process.env.USER_POOL_ID,
                Username: body.userDetails.email,
            };
            const command = new AdminUpdateUserAttributesCommand(params);
            await cognitoISP.send(command);
            return "User details successfully updated.";
        } else {
            throw new Error('Error! User has not provided any details to update.');
        }
    } catch(err) {
        throw err;
    }
};

module.exports = {
  verifyCode,
  signUp,
  logIn: login, // Exporting 'login' as 'logIn' for consistency with original code
  changePwd,
  confirmPass,
  updateUser,
  confirmUser,
  verifyEmail
};
