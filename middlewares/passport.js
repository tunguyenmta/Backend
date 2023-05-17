const passport = require('passport')
const express = require('express')
const app = express()
const User = require('../models/userModel')


const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/user/auth/google/callback'
},
    async function(accesstoken, refreshtoken, profile, done){
        userProfile = profile
        let user = await User.findOne({email: userProfile._json.email})
        if(!user){
            await User.create({email: userProfile._json.email, name: userProfile._json.given_name, userImage: userProfile._json.picture, password: "1" })
            return done(null, user)
        } else{
        return done(null, user)
    }
    }
))

const GithubStrategy = require("passport-github2").Strategy;
passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/user/auth/github/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        userProfile = profile
        let user = await User.findOne({email: userProfile._json.url})
        if(!user){
            await User.create({email: userProfile._json.url, name: userProfile._json.login, userImage: userProfile._json.avatar_url, password: "1" })
            return done(null, user)
        } else{
        return done(null, user)
    }
      }
    )
  );
const FacebookStrategy = require('passport-facebook').Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/user/auth/facebook/callback",
    profileFields: ["id", "displayName", "name", "email", "picture"]
  },
  async function(accessToken, refreshToken, profile, done) {
    
    // console.log(profile._json.picture.data);
    userProfile = profile
    let user = await User.findOne({email: userProfile._json.email})
    if(!user){
        await User.create({email: userProfile._json.email, name: userProfile._json.last_name, userImage: userProfile._json.picture.data.url, password: "1" })
        return done(null, user)
    } else{
    return done(null, user)
}
  }
));

passport.serializeUser((user, cb)=>{
    cb(null, user)
})

passport.deserializeUser((user, cb)=>{
    cb(null, user)
})

// module.exports = passport

