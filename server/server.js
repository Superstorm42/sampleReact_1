const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const { User } = require('./models/user');



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth');

app.use(bodyparser.json());

app.post('/api/user', (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })
    user.save((err, doc) => {
        if (err)
            res.status(400).send(err);
        else
            res.status(200).send(doc);
    })
});

app.post('/api/user/login', (req, res) => {
    User.findOne({
        'email': req.body.email
    }, (err, user) => {
        if (!user)
            res.json({ 'message': 'No user found. Please try again.' })
        else {

            user.comparePass(req.body.password, (err, Ismatch) => {
                if (err)
                    throw err;
                if (!Ismatch)
                    res.json({ 'message': 'Wrong password' });
                else if (Ismatch)
                    res.json({ 'message': 'Log In successfull.' });
            })
        }
    })
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`started on port ${port}`);
});