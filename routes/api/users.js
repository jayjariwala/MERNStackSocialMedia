const router = require('express').Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');


//load models
const User = require('../../models/Users');

//@route GET api/users/register
//@desc Register user
//@access Public
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email}).then(user => {
        if(user) {
            res.status(400).json(`Email already exist!`);
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

module.exports = router;