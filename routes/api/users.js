const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//load the model
const User = require('../../models/User');

// @route GET api/users/test
// @desc Tests users route
// @access Public

router.get('/test', (req,res) => res.json({
    msg: "Users works"
}));

// @route GET api/users/register
// @desc Register User
// @access Public

router.post('/register', (req, res) => {
    User.findOne({email : req.body.email })
        .then(user => {
            if(user) {
                return res.status(400).json({email: 'Email already exists'});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'pg', // rating
                    d: 'mm' //default
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password , salt, (err,hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => { res.json(user)})
                            .catch(err => console.log(err));
                    })
                })
            }
        })
});


// @route GET api/users/login
// @desc Login User // returning the tocken or JWT
// @access Public

router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    //find the user by email
    User.findOne({ email})
        .then( user => {
            //check for user
            if(!user) return res.status(404).json({email: 'user not found'});

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // user match
                        const payload = { id: user.id, name: user.name, avatar: user.avatar };
                        //sign tocken
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 } , (err,token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        });

                    } else {
                        res.status(400).json({msg: 'Password Incorrect'});
                    }
                })
        })
})

module.exports = router;