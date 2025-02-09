const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/User') 
const passport = require('../lib/passportConfig')

exports.auth_signup_get = (req, res) => {
    res.render('auth/signup')
}

exports.auth_signin_get = (req, res) => {
    res.render('auth/signin')
}

exports.auth_signup_post = async (req, res) => {
    try {
        console.log(req.body)
        const user = new User(req.body)
        const hash = bcrypt.hashSync(req.body.password, 10)
        console.log(hash)

        user.password = hash

        await user.save()
        res.status(201).json({"message": "User created successfully!"})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({"message": error.message})
    }
}


exports.auth_signin_post = async (req, res) => {
    let { emailAddress, password } = req.body;

    try {

        let user = await User.findOne({ emailAddress });
        console.log(user);
    
        if (!user){
            return res.status(400).json({"message": "User not found!"});
        }
    
        const isMatch = await bcrypt.compareSync(password, user.password);
        console.log(password);
        console.log(user.password);

        if (!isMatch){
            return res.status(406).json({"message": "Password not matched!"});
        }
    
        const payload = {
            user: {
                id: user._id
            }
        }
    
        jwt.sign(
            payload,
            "SUPERSECRET",
            { expiresIn: 36000000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token }).status(200)
            }
        )
    
    } catch (error) {
        console.log(error);
        res.status(400).json({"message": "You are not logged in!"})
    }
}



exports.auth_logout_get = (req, res, next) => {
    req.logout(function(error){
        if (error) {
            return next()
        }
        res.redirect('/auth/signin')
    })
}