const express = require('express');
const upload = require('../middlewares/upload')
const {getAllUsers, getUserById, updateUser, deleteUser, registerUser, login, getMe, getUserByEmail} = require('../controllers/userController')
const protect = require('../middlewares/authMiddleware')
const router = express.Router();
const passport = require('passport')
const multer = require('multer')
const storage = multer.memoryStorage()
const uploadS3 = multer({ storage: storage })


router.get('/', getAllUsers)

router.get('/me', protect, getMe)

router.get('/:userid', getUserById)

router.post('/register', uploadS3.single('image'), registerUser)

router.post('/login', login)

router.get('/error', (req, res)=>{
    res.status(404).send({message: 'Error'})
})

// router.get('/auth/login/success', (req, res)=>{
//     // console.log(req)
//     if(req.user){
//         console
//         res.status(200).json({
//             success: true,
//             message: "Successful",
//             data: req.user 
//         })
//     }
// })

router.get("/auth/logout", (req, res, next) => {
  req.logout(function(err){
    if(err){
      return next(err)
    } else res.redirect("http://localhost:3000");
  })
  
});

router.get('/auth/login/success', getUserByEmail)

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/error'}
    ))

router.get("/auth/github", passport.authenticate("github", { scope: ["profile", "email"] }));

router.get(
      "/auth/github/callback",
      passport.authenticate("github", {
        successRedirect: 'http://localhost:3000',
        failureRedirect: "/error",
      })
    );


  router.get('/auth/facebook',
    passport.authenticate('facebook', {scope: ['email']}));
  
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/error' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('http://localhost:3000');
    });



router.put('/:userid', upload.single('avatar'), updateUser)

router.delete('/:userid', deleteUser)

module.exports = router