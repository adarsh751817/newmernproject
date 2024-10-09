require('dotenv').config()
const express = require('express');
const app = express();
const hbs = require('hbs')
const path = require('path')
const Hospital = require("../src/db/connect")
const port = process.env.PORT || 5000;

const public_path = path.join(__dirname, '../public')
const templates_path = path.join(__dirname, '../templates/views')
const mypartials_path = path.join(__dirname, '../templates/partials')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(public_path))

app.set('view engine', 'hbs');
app.set('views', templates_path);
hbs.registerPartials(mypartials_path);


console.log(process.env.SECRET_KEY);

app.get('/', (req, res) => {
    res.render('register');
})

app.get('/home', (req, res) => {
    res.render('home');
})


// app.post('/home', async (req, res) => {
//     try {

//         const data = {
//             name: req.body.name,
//             password: req.body.password,
//             email: req.body.email,
//             confirmPass: req.body.confirmPass,
//             age: req.body.age,
//             contactNo: req.body.contactNo
//         }


//         await Hospital.insertMany([data]);
//         res.render('home')
//     } catch (err) {
//         console.log(err);
//     }
// })


app.post('/home', async (req, res) => {
    try {
        const pass = req.body.password;
        const cpass = req.body.confirmPass;

        if (pass == cpass) {
            const registerEmployeee = new Hospital({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                confirmPass: req.body.confirmPass,
                age: req.body.age,
                contactNo: req.body.contactNo
            })

            const token = await registerEmployeee.generateToken();
            // console.log(token);

            const register = await registerEmployeee.save();
            res.render('home');
        }

        else {
            res.send('password are not matching!!');
        }
    } catch (err) {
        console.log(err);
    }
})



app.get('/login', (req, res) => {
    res.render('login');
})


app.post('/login', async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        // const myemail = await Hospital.findOne({ email: email })
        const myemail = await Hospital.findOne({ password: password })

        const token = await myemail.generateToken();
        
        // console.log(`the token is ${token}`)

        if (myemail.email == email) {
            res.render('home');
        }
        else {
            res.send('there is error please check your e-mail and password!');
        }


    } catch (error) {
        res.status(401).send('please check your e-mail and password!')
    }

})

app.get('/appointment', (req, res) => {
    res.render('appointment');
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.listen(port, () => {
    console.log(`the server port is: ${port}`);
})