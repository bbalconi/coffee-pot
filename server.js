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


 
var allowedOrigins = "http://localhost:* http://192.168.*.*:* http://coffee-pot-pi.herokuapp.com:*";
var ioServer = io(server, {
  origins: allowedOrigins
});
 
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: "moby" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./client/build'));

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
  let query = `SELECT * from users where id = ${id}`;
  pool.query(query, (err, user) => {
    if (err) throw err;
    else {
      done(null, user);
    }
  })
  })

  ioServer.on('connection', (client) => {
    console.log('client connected')
    client.on('coffeeConnect', (coffee) => {
      client.join(coffee);
    });

    client.on('/postcup', (data) => {
      let query = `SELECT * FROM history where userid = ${data.userid}`
      pool.query(query, (err, rows) => {
        if (rows.rows[0] != undefined) {
          let updateQuery = `UPDATE history SET cupcount = ${data.cupcount} where userid = ${data.userid} RETURNING cupcount`
          pool.query(updateQuery, (err,rows) => {
            if (err) throw err;
            ioServer.in(rows).emit('postedCup', rows.rows[0].cupcount)
        })
      } else {
          let newQuery = `INSERT INTO history (cupcount, status, userid) values (1, 0, ${data.userid})`;
          pool.query(newQuery, (err,rows) => {
              if (err) throw err;
              ioServer.in(rows).emit('postedCup', rows.rows[0].cupcount)
            })
        }
        if (err) throw err;
        });
    });
    client.on('disconnect', ()=>{console.log("client disconnected")});
  });

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
          let query = `SELECT sum(cupcount) FROM history where status = 0`;
          let cupcount = 0;
          pool.query(query, (error, rows) => {
            cupcount = parseInt(rows.rows[0].sum);
            if (error) throw error;
            if (rows.rows[0].sum == null) {
              cupcount = 0;
            }
            res.json({ found: true, success: true, id: user.id, cupcount: cupcount, email: user.email, firstName: user.firstname, lastName: user.lastname })
            })
        }
      })
    } else {
      res.json({ found: false, success: false, message: "Something went wrong!" })
    }
  })(req, res, next);
  var email = req.body.email;
  var password = req.body.password;
});

app.post('/socketUrl', (req, res)=>{
  if (process.env.PORT){
    res.json('https://coffee-pot-pi.herokuapp.com:' + process.env.PORT);
  } else {
    res.json('http://192.168.1.7:5000')
  }
});

app.post('/signup', (req, res, next) => {
 let query = `INSERT INTO users (firstname, lastname, email, password) values ('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${passwordHash.generate(req.body.password)}') RETURNING id, firstname, lastname, email`  
  pool.query(query, (err, user) => {
  if (err) throw err;
    res.json(user.rows);
  });    
});

// app.post('/getCount', (req, res, next) => {
//   let query = `SELECT sum(cupcount) FROM history where status = 0;`
//   pool.query(query, (err, rows) => {
//     if (err) throw err;
//     console.log(rows.rows);
//     res.json(rows.rows);
//   })
// })

// app.post('/postcup', (req, res, next) => {
//   let query = `SELECT * FROM history where userid = 33`
//   pool.query(query, (err, rows) => {
//     if (rows.rows.length > 0) {
//       let updateQuery = `UPDATE history SET cupcount = ${req.body.cupcount} where userid = ${req.body.userid}`
//       pool.query(updateQuery, (err,rows) => {
//         if (err) throw err;
//     })
//   } else {
//       let newQuery = `INSERT INTO history (cupcount, status, userid) values ('${req.body.cupcount}', 0, '${req.body.userid}')`;
//       pool.query(newQuery, (err,rows) => {
//           console.log(rows);
//           if (err) throw err;
//         })
//     }
//     if (err) throw err;
//     });
// });



app.get('/logout', function(req, res){
  if (req.user) {
    req.logout();
    res.json('user logged out')
    req.session.destroy();
    
  } else {
    res.json('no user logged in')
  }

});

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

var port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('listening on port ' + port);
});