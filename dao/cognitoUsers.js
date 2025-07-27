
const AmazonCognitoId = require('amazon-cognito-identity-js');
const constants = require('../constants/userCustomAttributes');

exports.daoUserAttributes = (body) => {
    // Create / Update User Custom Attributes
    var customAttributeList = [];
    
    
    if(body.email) {
        var userEmail = new AmazonCognitoId.CognitoUserAttribute(constants.userEmail(body.email));
        customAttributeList.push(userEmail);
    }

    
    return customAttributeList;
}