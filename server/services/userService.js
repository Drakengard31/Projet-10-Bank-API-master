const User = require('../database/models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.createUser = async serviceData => {
  try {
    // Vérifie si l'email ou le username existe déjà
    const existingUser = await User.findOne({
      $or: [
        { email: serviceData.email },
        { username: serviceData.username }
      ]
    })

    if (existingUser) {
      if (existingUser.email === serviceData.email) {
        throw new Error('Email already exists')
      } else {
        throw new Error('Username already exists')
      }
    }

    const hashPassword = await bcrypt.hash(serviceData.password, 12)

    const newUser = new User({
      email: serviceData.email,
      password: hashPassword,
      firstName: serviceData.firstName,
      lastName: serviceData.lastName,
      username: serviceData.username
    })

    let result = await newUser.save()

    return result.toObject()
  } catch (error) {
    console.error('Error in userService.js', error)
    throw new Error(error)
  }
}

module.exports.getUserProfile = async serviceData => {
  try {
    const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim()
    const decodedJwtToken = jwt.decode(jwtToken)
    const user = await User.findOne({ _id: decodedJwtToken.id })

    if (!user) {
      throw new Error('User not found!')
    }

    return user.toObject()
  } catch (error) {
    console.error('Error in userService.js', error)
    throw new Error(error)
  }
}

module.exports.loginUser = async serviceData => {
  try {
    const user = await User.findOne({ email: serviceData.email })

    if (!user) {
      throw new Error('User not found!')
    }

    const isValid = await bcrypt.compare(serviceData.password, user.password)

    if (!isValid) {
      throw new Error('Password is invalid')
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY || 'default-secret-key',
        { expiresIn: '1d' }
    )

    return { token }
  } catch (error) {
    console.error('Error in userService.js', error)
    throw new Error(error)
  }
}

module.exports.updateUsername = async serviceData => {
  try {
    const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim()
    const decodedJwtToken = jwt.decode(jwtToken)

    // Vérifie si le nouveau username existe déjà
    const existingUser = await User.findOne({
      username: serviceData.body.username,
      _id: {$ne: decodedJwtToken.id} // Exclut l'utilisateur actuel
    })

    if (existingUser) {
      throw new Error('Username already taken')
    }

    const user = await User.findOneAndUpdate(
        {_id: decodedJwtToken.id},
        {username: serviceData.body.username},
        {new: true}
    )

    if (!user) {
      throw new Error('User not found!')
    }

    return {
      username: user.username,
      message: 'Username updated successfully'
    }
  } catch (error) {
    console.error('Error in updateUsername - userService.js', error)
    throw new Error(error)
  }
}