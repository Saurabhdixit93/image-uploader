const express =         require('express');
const router =          express.Router();
const passport =        require('passport');
const UserController =  require('../controllers/UserController');
const methodOverride =  require('method-override');
router.use(methodOverride('_method'));

router.get('/register', UserController.getRegisterPage);
router.get('/login',    UserController.getLoginPage);
router.post('/register',UserController.register);
router.post('/login' ,  passport.authenticate('local', {
    successFlash:true,
    failureRedirect:'/user/login'
}), UserController.login);
router.get('/logout' ,      UserController.logout);
router.get('/verify/:token',UserController.verifyEmail);

router.delete('/delete-account' ,passport.checkAuthentication,UserController.deleteAccount);

module.exports = router;
