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