const router = require('express').Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Input validators
const validateRegisterInput = require('../../validations/register');
const validateLogin = require('../../validations/login');

//load models
const User = require('../../models/Users');
//@route GET api/users/register
//@desc Register user
//@access Public
router.post('/register', (req, res) => {

    const { errors, isValid} = validateRegisterInput(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email}).then(user => {
        if(user) {
            res.status(400).json({'email': `Email already exist!`});
        } else {
            const avatar = gravatar.url(req.body.email, {
                s:'200', //size
                r:'pg', //Rating
                d:'mm' //Default
            })

            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                avatar
            })

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {res.json(user)})
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route /api/users/login
// @desc User login
// @access Public

router.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const {errors, isValid } = validateLogin(req.body);

    if(!isValid) {
        res.status(400).json(errors);
    }

    //find user with email address
    User.findOne({email}).then(user => {
        if(user) {
            //match the password
            bcrypt.compare(password, user.password).then((isMatch) => {
                if(isMatch) {
                    //assign jwt
                    const payload = { id: user.id, name: user.name, avatar:user.avatar}; // create jwt payload
                    //sign token
                    jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        {expiresIn: 3600},
                        (err,token) => {
                            res.json({
                                success:true,
                                token: 'Bearer ' + token
                            });
                        }
                    )

                } else {
                    errors.password = `Password Incorrect`;
                    res.status(400).json(errors);
                }
            })
        } else {
            errors.email = `No user registered with this email address`;
            res.status(400).json(errors);
        }
    })
});

// @route /api/users/current
// @desc gives current user
// @access Private
router.get('/current', passport.authenticate('jwt',{session:false}), (req,res) => {
    res.json({ auth: 'success'});
})

module.exports = router;