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
            user.characterName = req.body.characterName;
            user.role = req.body.role
            user.race = req.body.race
            user.skype = req.body.skype
            user.discord = req.body.discord
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
                userModel.first = req.body.first;
                userModel.last = req.body.last;
                userModel.username = req.body.username;
                userModel.password = req.body.password;
                userModel.characterName ='No Charcter Name'
                userModel.status = false
                userModel.description ='No User Description'
                userModel.player = 'player'
                userModel.groups = []
                userModel.imgsource ='https://sorted.org.nz/themes/sorted/assets/images/user-icon-grey.svg'
                userModel.role =''
                userModel.race =''
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

app.post('/setall', function(req, res) {
  User.find({},function(err, users){
    if(err){
      res.json({
        type: false,
        data: 'Error occured: ' + err
      })
    } else {
      users.forEach(function(user){
        user.status = true
        user.save(function(err, user1) {
          if(err) {
              res.json({
                  type: false,
                  data: "Error occured: " + err
              });
            }
        });
      })
    }
  })
})

app.post('/startSearch', function(req,res){
  User.findOne({'_id': req.body._id}, function(err, user){
    if(err){
      res.json({
        type: false,
        data: 'Err:' + err
      })
    } else {
      user.player = req.body.player
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
  })
})

app.get('/getPlayer/:id', function(req,res){
  let id = req.params.id;
  User.findOne({'status': true, 'player':'player', '_id':{$ne:id}}, function(err, user){
    if(err){
      res.json({
        type: false,
        data: 'Err:' + err
      })
    }else if (!user) {
      res.json({
          type: false,
          data: 'NO USER'
      });
    }
    else {
      user.status = false
      user.save(function(err, user1) {
        newuser = {'username':user1.characterName,'player':user1.player,'role':user1.role,'race':user1.race,'imgsource':user1.imgsource,'description':user1.description,'skype':user1.skype,'discord':user1.discord}
        if(err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
          }else{
          res.json({
              type: true,
              data: newuser
          });
        }
      })
    }
  })
})

app.post('/getDm', function(req,res){
  User.findOne({'status': true, 'player':'dungeonMaster'}, function(err, user){
    if(err){
      res.json({
        type: false,
        data: 'Err:' + err
      })
    } else {
      user.status = false
      user.save(function(err, user1) {
        newuser = {'username':user1.characterName,'player':user1.player,'role':user1.role,'race':user1.race,'imgsource':user1.imgsource,'description':user1.description,'skype':user1.skype,'discord':user1.discord}
        if(err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
          }else{
          res.json({
              type: true,
              data: newuser
          });
        }
      })
    }
  })
})

app.post('/saveGroup/:id', function(req,res){
  let id = req.params.id
  User.findOne({'_id': id}, function(err,user){
    if(err){
      res.json({
        type: false,
        data: 'Err:' + err
      })
    }else{
      user.groups.push(req.body)
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
      })
    }
  })
})

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
