const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const tokenValidation = require('../middleware/tokenValidation')

router.post('/signup', userController.createUser)
router.post('/login', userController.loginUser)

// Route pour récupérer le profil
router.get(
    '/profile',
    tokenValidation.validateToken,
    userController.getUserProfile
)

// Route spécifique pour la mise à jour du username
router.put(
    '/profile/username',
    tokenValidation.validateToken,
    userController.updateUsername
)

module.exports = router