const mongoose = require('mongoose');

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken")
// const bcrypt = require('bcrypt');


mongoose.connect('mongodb://localhost:27017/Thehospital')
    .then(() => {
        console.log('connected');
    }).catch((err) => {
        console.log(err);
    })


const myHospital = new mongoose.Schema({

    name: {
        type: String,
        reqired: true
    },

    email:
    {
        type: String,
        reqired: true,
        unique: true
    },
    password:
    {
        type: String,
        reqired: true,
        unique: true
    },
    confirmPass:
    {
        type: String,
        reqired: true,
        unique: true
    },

    contactNo:
    {
        type: Number,
        reqired: true,
        unique: true
    },
    age:
    {
        type: Number,
        reqired: true,
    },

    tokens: [{
        token: {
            type: String,
            reqired: true,
        }
    }]
})

myHospital.methods.generateToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        // console.log(token)
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
          return token;
    } catch (error) {
        // res.send(error);
        console.log(error);

    }
}


myHospital.pre("save", async function (next) {
    if (this.isModified("password")) {
        // console.log(`the current password is: ${this.password}`)

        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPass = await bcrypt.hash(this.password, 10);

        // console.log(`the current password is: ${this.password}`)
        // this.confirmPass = undefined;
    }

    next();
})

const Hospital = new mongoose.model('Myhospital', myHospital);
module.exports = Hospital;
