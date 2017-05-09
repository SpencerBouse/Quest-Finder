// Required Modules
var express    = require("express");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");
var app        = express();

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 3001;
var User     = require('./models/User');

// Connect to DB
// mongoose.connect(process.env.MONGO_URL);
mongoose.connect('mongodb://spencer:bouse@ds131151.mlab.com:31151/questfinder');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


app.post('/authenticate', function(req, res) {
    User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect Username/password"
                });
            }
        }
    });
});

app.post('/save', function(req, res) {
    User.findOne({token: req.body.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            user.first = req.body.first;
            user.last = req.body.last;
            user.username = req.body.username;
            user.password = req.body.password;
            user.description = req.body.description;
            user.imgsource = req.body.imgsource;
            user.save(function(err, user1) {
              if(err) {
                  res.json({
                      type: false,
                      data: "Error occured: " + err
                  });
                }else{
                res.json({
                    type: true,
                    data: user1
                });
              }
            });
        }
    });
});

app.post('/signin', function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                if(!req.body.imgsource){
                  userModel.imgsource ='https://sorted.org.nz/themes/sorted/assets/images/user-icon-grey.svg'
                }else{
                  userModel.imgsource = req.body.imgsource;
                }
                if(!req.body.description){
                  userModel.description ='No User Description'
                }else{
                  userModel.description = req.body.imgsource;
                }
                userModel.first = req.body.first;
                userModel.last = req.body.last;
                userModel.username = req.body.username;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, 'SPENCERAPP');
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});

app.get('/me', ensureAuthorized,function(req, res) {
    User.findOne({token: req.get('authorization')}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });
});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port " + port);
});
