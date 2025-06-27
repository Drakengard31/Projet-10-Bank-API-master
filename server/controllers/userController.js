const userService = require('../services/userService')

module.exports.createUser = async (req, res) => {
  let response = {}

  try {
    const responseFromService = await userService.createUser(req.body)
    response.status = 200
    response.message = 'User successfully created'
    response.body = responseFromService
  } catch (error) {
    console.error('Something went wrong in userController.js', error)
    response.status = 400
    response.message = error.message
  }

  return res.status(response.status).send(response)
}

module.exports.loginUser = async (req, res) => {
  let response = {}

  try {
    const responseFromService = await userService.loginUser(req.body)
    response.status = 200
    response.message = 'User successfully logged in'
    response.body = responseFromService
  } catch (error) {
    console.error('Error in loginUser (userController.js)')
    response.status = 400
    response.message = error.message
  }

  return res.status(response.status).send(response)
}

module.exports.getUserProfile = async (req, res) => {
  let response = {}

  try {
    const responseFromService = await userService.getUserProfile(req)
    response.status = 200
    response.message = 'Successfully got user profile data'
    response.body = responseFromService
  } catch (error) {
    console.log('Error in userController.js')
    response.status = 400
    response.message = error.message
  }

  return res.status(response.status).send(response)
}

module.exports.updateUsername = async (req, res) => {
  let response = {}

  try {
    // Vérifie que seul le username est présent dans le body
    if (!req.body.username || Object.keys(req.body).length !== 1) {
      throw new Error('Seul le champ username peut être modifié')
    }

    const responseFromService = await userService.updateUsername(req)
    response.status = 200
    response.message = 'Username updated successfully'
    response.body = responseFromService
  } catch (error) {
    console.error('Error in updateUsername (userController.js)', error)
    response.status = 400
    response.message = error.message
  }

  return res.status(response.status).send(response)
}