const User = require('../database/models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkUniqueUsername = async (username, excludeId = null) => {
  const query = { userName: username };
  if (excludeId) query._id = { $ne: excludeId };
  return !(await User.findOne(query));
};

module.exports.createUser = async (serviceData) => {
  try {
    const existingUser = await User.findOne({
      $or: [
        { email: serviceData.email },
        { userName: serviceData.userName }
      ]
    });

    if (existingUser) {
      throw new Error(existingUser.email === serviceData.email
          ? 'Email already exists'
          : 'Username already taken');
    }

    const hashPassword = await bcrypt.hash(serviceData.password, 12);
    const newUser = new User({
      email: serviceData.email,
      password: hashPassword,
      firstName: serviceData.firstName,
      lastName: serviceData.lastName,
      userName: serviceData.userName
    });

    return await newUser.save();
  } catch (error) {
    console.error('Error in userService.createUser:', error);
    throw error;
  }
};

module.exports.getUserProfile = async (serviceData) => {
  try {
    const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim();
    const decodedJwtToken = jwt.decode(jwtToken);
    const user = await User.findById(decodedJwtToken.id).lean();

    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    console.error('Error in userService.getUserProfile:', error);
    throw error;
  }
};

module.exports.loginUser = async (serviceData) => {
  try {
    const user = await User.findOne({ email: serviceData.email });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(serviceData.password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY || 'default-secret-key',
        { expiresIn: '1d' }
    );

    return { token, user: user.toObject() };
  } catch (error) {
    console.error('Error in userService.loginUser:', error);
    throw error;
  }
};

module.exports.updateUsername = async (serviceData) => {
  try {
    const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim();
    const decodedJwtToken = jwt.decode(jwtToken);

    if (!await checkUniqueUsername(serviceData.body.userName, decodedJwtToken.id)) {
      throw new Error('Username already taken');
    }

    const updatedUser = await User.findByIdAndUpdate(
        decodedJwtToken.id,
        { userName: serviceData.body.userName },
        { new: true, runValidators: true }
    );

    if (!updatedUser) throw new Error('User not found');
    return updatedUser.toObject();
  } catch (error) {
    console.error('Error in userService.updateUsername:', error);
    throw error;
  }
};