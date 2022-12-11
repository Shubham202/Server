const mongoose = require('mongoose');
const router = require('express').Router();
const { Users, validate } = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });
        
        let user = await Users.findOne({ name: req.body.name });
        
        if (user) return res.status(409).send({message: 'User already registered.'});
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        
        const author = req.body.name;
        const newUser = await new Users({
            name: author,
            password: hashPassword
        });
        newUser.save();
        res.status(201).send({message: 'User created successfully.'});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;