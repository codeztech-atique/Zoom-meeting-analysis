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

exports.deleteUser = async(req, res) => {
  const userIds = await userServices.findUserIdsByEmail(req.params.id);
  if (!userIds.length) {
    return res.status(404).json({ message: `No user found with email ${req.params.id}` });
  }

  try {
    // delete all matching userIds (usually just one)
    await Promise.all(userIds.map(uid => userServices.deleteUserById(uid)));
    res.json({
      message: `Deleted ${userIds.length} user(s) with email ${req.params.id}`
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(400).json({ error: err });
  }
}