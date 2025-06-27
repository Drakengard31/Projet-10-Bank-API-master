const userService = require('../services/userService');

const formatResponse = (status, message, body = null) => ({
  status,
  message,
  ...(body && { body })
});

module.exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(formatResponse(201, 'User created successfully', user));
  } catch (error) {
    res.status(400).json(formatResponse(400, error.message));
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { token, user } = await userService.loginUser(req.body);
    res.status(200).json(formatResponse(200, 'Login successful', { token, user }));
  } catch (error) {
    res.status(401).json(formatResponse(401, error.message));
  }
};

module.exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req);
    res.status(200).json(formatResponse(200, 'Profile retrieved successfully', user));
  } catch (error) {
    res.status(400).json(formatResponse(400, error.message));
  }
};

module.exports.updateUsername = async (req, res) => {
  try {
    if (!req.body.userName) {
      throw new Error('Username is required');
    }

    const user = await userService.updateUsername({
      headers: req.headers,
      body: req.body
    });

    res.status(200).json(formatResponse(200, 'Username updated successfully', user));
  } catch (error) {
    res.status(400).json(formatResponse(400, error.message));
  }
};