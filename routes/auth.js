const router = require('express').Router();
const { Users } = require('../models/user');
const joi = require('joi');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.send({message: error.details[0].message});

        const user = await Users.findOne({name: req.body.name});
        if (!user) return res.status(409).send({message: 'User not found.'});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send({message: 'Invalid password.'});

        const token = user.generateAuthToken();
        res.status(200).send({data: token, message: 'User logged in successfully.'});
    } catch (error) {
        res.send({message: error});
    }
});

const validate = data => {
    const schema = joi.object({
        name: joi.string().required().label("Name"),
        password: joi.string().required().label("Password")
    });
    return schema.validate(data);
}

module.exports = router;