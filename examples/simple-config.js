'use strict';

var { 
    authExpress,
    authRoutes,
    authConfig
} = require("../build/authentication"); //Authentication module

var bcrypt = require("bcrypt");

function loadUserToDB()
{
    let email = Math.floor(new Date().getTime() / 1000).toString() + "@example.com",
        password = "123456",
    
        Identity = require("../src/database/mongo/models/identity").default,
        Account = require("../src/database/mongo/models/account").default,
        Password = require("../src/database/mongo/models/password").default;

    Identity.create({
        "activated" : true
    }, (err, ident) => {
        if (err)
            return console.log("Test user create failed");

        Account.create({
            "identity_id" : ident._id,
            "account" : email,
            "type" : 1
        });
    
        bcrypt.hash(password, 10, function(err, hash) {
            Password.create({
                "identity_id" : ident._id,
                "password" : hash
            }, (err, result) => {
                console.log("User created with " + email + " email and " + password + " password (" + result._id + ")");
            });
        });
    });
}

//loadUserToDB();

authConfig({
    loginWith : 'email',

    database : {
        type : "mongo",

        host : 'mongodb://auth_1:auth_1@localhost:27017/auth_1'
    }
});


const bodyParser = require("body-parser");
const express = require('express')
const app = express();
   
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

authExpress(app);
authRoutes(app);


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))