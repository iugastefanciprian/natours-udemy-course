const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bookingRouter = require('../routes/bookingRoutes');

const router = express.Router();

router.use('/:userId/bookings', bookingRouter);

router.get('/logout', authController.logout);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateProfile',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateProfile
);
router.delete('/deleteProfile', userController.deleteProfile);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route(`/:id`)
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
