const userServices = require('../services/user')
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
    const { provider, endpoint_signing_key } = req.body;
    
    // Validate if the required parameters exist
    if (!provider || !endpoint_signing_key) {
      return res.status(400).send({ message: "Missing provider & endpoint_signing_key !!!" });
    }

    // Assuming userServices.getMeetingConfiguration can work with query parameters
    const data = await userServices.getMeetingConfiguration({ provider, endpoint_signing_key });
    
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message || err });
  }
};
