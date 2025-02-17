const userServices = require('../services/user');
const crypto = require('crypto')
const config = require('config');


exports.generateToken = async(req, res) => {
  try {
    const getBearerToken = await userServices.getToken(req.body);
    res.status(200).send(getBearerToken);
  } catch(err) {
    res.status(400).send({
      message: err
    })
  }
}

exports.getMeetingWebHooks = async (req, res) => {
  try {
    // Extract query parameters from the URL
    const { provider, endpoint_signing_key } = req.query;

    if(req.body.event === 'endpoint.url_validation') {
      const hashForValidate = crypto.createHmac('sha256', endpoint_signing_key).update(req.body.payload.plainToken).digest('hex');
      console.log("plainToken:", req.body.payload.plainToken);
      console.log("encryptedToken:", hashForValidate);

      return res.status(200).send({
        "plainToken": req.body.payload.plainToken,
        "encryptedToken": hashForValidate
      })
    }
    
    // Validate if the required parameters exist
    if (!provider || !endpoint_signing_key) {
      return res.status(400).send({ message: "Missing provider & endpoint_signing_key !!!" });
    }

    // // Assuming userServices.getMeetingConfiguration can work with query parameters
    // const data = await userServices.getMeetingConfiguration({ provider, endpoint_signing_key });
    
    // res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message || err });
  }
};
