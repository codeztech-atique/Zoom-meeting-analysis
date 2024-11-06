const crypto = require('crypto');

// Zoom Credentials
const SDK_KEY = process.env.CLIENT_ID;
const SDK_SECRET = process.env.CLIENT_SECRET;

    // Helper function for Base64URL encoding
function base64UrlEncode(data) {
    return Buffer.from(data)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  
exports.getToken = (body) => {
    const appKey = SDK_KEY;  // Replace with actual client ID
    const sdkKey = SDK_SECRET;    // Replace with actual SDK key
    
    // Set iat as the current Unix timestamp
    const iat = Math.floor(Date.now() / 1000);
    
    // Set exp and tokenExp to 1 day (86400 seconds) after iat
    const exp = iat + 86400;
    const tokenExp = iat + 86400;
    
    // Define additional fields as needed
    const mn = body.meetingNumber;  // Replace with actual meeting number if needed
    const role = body.role;  // Replace with role if required
  
    // Define the JWT header
    const header = {
      alg: "HS256",
      typ: "JWT"
    };
  
    // Define the JWT payload with exact fields
    const payload = {
      appKey,
      sdkKey,
      iat,
      exp,
      tokenExp,
      mn,
      role
    };
  
    // Encode header and payload to Base64URL format
    const base64Header = base64UrlEncode(JSON.stringify(header));
    const base64Payload = base64UrlEncode(JSON.stringify(payload));
  
    // Create the signature using HMACSHA256 and client secret
    const signature = crypto
      .createHmac('sha256', sdkKey)
      .update(`${base64Header}.${base64Payload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  
    // Combine header, payload, and signature into the JWT format
    const jwtToken = `${base64Header}.${base64Payload}.${signature}`;

    // Return the JWT-style token
    
    return {
        signature: jwtToken,
        sdkKey: appKey
    }
}