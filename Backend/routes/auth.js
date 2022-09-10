const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = "MynameisDon";
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')


// createb a user using POST "/api/auth/createuser"
router.post('/createuser', [
    body('email').isEmail(),
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
   let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    // res.send("hello")
    let user = await User.findOne({ email: req.body.email });
    try {
        if (user) {
            return res.status(400).json({ success, error: "Sorry user with this email alrrady exist" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send(success, "Some error occured");
    }
})

// Authenticate a user using POST "/api/auth/login"
router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    // res.send("hello")
    const {email, password} = req.body;
    try {
        let user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ success, error: "Sorry user with this email alrrady exist" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        
        if(!passwordCompare){
            return res.status(400).json({ success, error: "Sorry user with this email alrrady exist" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send(success,"Some error occured");
    }
})

// Get user detail a user using POST "/api/auth/getuser"
router.post('/getuser', fetchuser, async (req, res) => {
   
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})


module.exports = router;