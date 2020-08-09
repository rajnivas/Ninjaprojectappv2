require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const requestIp = require('request-ip');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const usercon = mongoose.connect("mongodb+srv://admin-raj:test123@cluster0-6xmfi.gcp.mongodb.net/userdb", { useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = {
  username: String,
  password: String,
  email: String,
  fullname: String,
  gender: String,
  phone: String
};

const accountSchema = {
  username1: String,
  savings: String,
  credit: String,
  housing: String,
  helinsurance: String,
  lifinsurance: String,
  motinsurance: String
};

const User = new mongoose.model("user",userSchema);

const Account = new mongoose.model("account",accountSchema);

app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/forgot",function(req,res){
  res.render("forgot");
})

app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  console.log(req.body)
  bcrypt.hash(req.body.reg_password, saltRounds, function(err, hash) {
  if(!err) {
      const newUser = new User ({
        username: req.body.reg_username,
        password: hash,
        email:    req.body.reg_email,
        fullname: req.body.reg_fullname,
        gender:   req.body.reg_gender,
        phone:    req.body.reg_phone
      });
      newUser.save(function(err){
        if(err){
          console.log(err);
        } else {
	  console.log("Succesfully registered");
          res.render("successregister");
        }
      })
    } else {
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.lg_username
  const password = req.body.lg_password
  User.findOne({username: username}, function(err,foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
         if(result == true){
           console.log(result)
            Account.findOne({username1: username}, function(err,foundAccount){
              if(err){
                console.log(err);
              }  else if(foundAccount){
                  console.log("Succesfully logged on");
                  console.log(foundAccount.username1);

                   res.render("userhome",{
                   userHomeFullname: foundUser.fullname,
                   userHomeSavings: foundAccount.savings,
                   userHomeCredit: foundAccount.credit,
                   userHomeHousing: foundAccount.housing,
                   userHomeHelinsurance: foundAccount.helinsurance,
                   userHomeLifinsurance: foundAccount.lifinsurance,
                   userHomeMotinsurance: foundAccount.motinsurance
                 });
               }

           });
         } else {
           console.log("Password not matching");
           res.render("login");
         }
         });
      }
    }
  });
});

app.use(requestIp.mw())

app.use(function(req, res) {
    // by default, the ip address will be set on the `clientIp` attribute
    var ip = req.clientIp;
    console.log("clientIp : " + ip );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
