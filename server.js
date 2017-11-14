var express = require('express');
var app = require("express")();
var server = require('http').Server(app);
var io = require('socket.io');
let bodyParser = require("body-parser");
var fetch = require('node-fetch');
var expressSession = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var passwordHash = require("password-hash");
var cookieParser = require('cookie-parser');
var http = require('http');
var path  = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.ELEPHANT_DB_USER,
  host: 'baasu.db.elephantsql.com',
  database: process.env.ELEPHANT_DB_USER,
  password: process.env.ELEPHANT_DB_PASSWORD,
  port: 5432
});


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));
} else {
  app.use(express.static('public'));
}
 
var allowedOrigins = "http://localhost:* http://127.0.0.1:* http://potluck-react.herokuapp.com:*";
var ioServer = io(server, {
  origins: allowedOrigins
});
 
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: "moby" }));
app.use(passport.initialize());
app.use(passport.session());


// needs to be called username 
passport.use(new LocalStrategy({email: 'username', password: 'password'},
function(email, password, done){
  // hit the db and do some matching
  let query = 'SELECT * from users where email = \'' + email + '\'';
  pool.query(query, function(err, user, fields) {
    if (err) {
      return done(err, null); // null for no user
    } else {
      if (user.rows[0] && passwordHash.verify(password, user.rows[0].password)){
        return done(null, user.rows[0]);
      } else {
        // additional test and error handling here
        return done("Password and username don't match", null)
      }
    }
  });
  }
)); 

passport.serializeUser(function (user, done) {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  console.log(id)
  console.log('^^^deserialize^^^')
  let query = `SELECT * from users where id = ${id}`;
  pool.query(query, (err, user) => {
    console.log(query)
    console.log('------------')
    console.log(user)
    if (err) throw err;
    else {
      done(null, user);
    }
  })
  })

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      res.json({ found: false, success: false, err: true, message: err });
    } else if (user) {
      req.logIn(user, (err) => {
        if (err) {
          console.log(err);
          next(err);
          res.json({ found: true, success: false, message: err })
        } else {
          res.json({ found: true, success: true, firstName: user.firstname, lastName: user.lastname })
        }
      })
    } else {
      res.json({ found: false, success: false, message: "Something went wrong!" })
    }
  })(req, res, next);
  var email = req.body.email;
  var password = req.body.password;
});


app.post('/signup', (req, res, next) => {
 let query = `INSERT INTO users (firstname, lastname, email, password) values ('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${passwordHash.generate(req.body.password)}') RETURNING id, firstname, lastname, email`  
  pool.query(query, (err, user) => {
  if (err) throw err;
    console.log(user.rows)
    res.json(user.rows);
  });    
});

app.post('/postcup', (req, res, next) => {
  let query = `INSERT INTO history (cupcount, status, userid) values ('${req.body.cupcount}', '${req.body.status}', '${req.body.userid}')`;
  pool.query(query, (err) => {
    if (err) throw err; 
    });
});

app.post('/logout', (req, res) => {
  console.log(req.body)
  console.log('logoutter')
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.get("/", function(req, res, next) {
  res.send("connected!");
});

var port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('listening on port ' + port);
});