const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load validations
const validateProfile = require('../../validations/profile');

//load profile model
const Profile = require('../../models/Profile');


//@route /api/profile/test
//@desc test route
//@access Public
router.get('/test', (req,res) => {
    res.json({test:'Success!'});
})

//@route GET /api/profile
//@desc get current user profile
//@access Private
router.get('/', passport.authenticate('jwt', {session:false}) , (req,res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id})
    .populate('user', ['name','avatar'])
    .then(profile => {
        if(!profile) {
            errors.profile = `No profile found for the user`;
            return res.status(404).json(errors);
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json(err));
})

//@route POST /api/profile
//@desc get create or edit user profile
//@access Private
router.post('/', passport.authenticate('jwt', {session:false}) , (req,res) => {

    const {errors, isValid} = validateProfile(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    //get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //skills - Split into array
    if(typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    //Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
    .then(profile => {
        if(profile) {
            //update the profile
            Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new : true})
                .then(profile => {
                    res.json(profile);
                });
        } else {
            //create profile
            //Check if the handle exists
            Profile.findOne({handle: profileFields.handle})
            .then(profile => {
                if(profile) {
                    errors.handle = `That handle already exists`;
                    res.status(400).json(errors);
                }

                //save profile
                new Profile(profileFields).save().then(profile => res.json(profile));
            })
        }
    })


})



module.exports = router;