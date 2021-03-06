var express = require('express');
var http = require('http');
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
var path  = require('path');
const { Pool } = require('pg');
const AWS = require('aws-sdk');

require('dotenv').config();

const pool = new Pool({
  user: process.env.ELEPHANT_DB_USER,
  host: 'baasu.db.elephantsql.com',
  database: process.env.ELEPHANT_DB_USER,
  password: process.env.ELEPHANT_DB_PASSWORD,
  port: 5432
});
 
var allowedOrigins = "http://localhost:* http://192.168.*.*:* https://coffee-pot-pi.herokuapp.com:*";
var ioServer = io(server, {
  origins: allowedOrigins
});
 
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: "moby" }));
app.use(passport.initialize());
app.use(passport.session());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));
} else {
  app.use(express.static('public'));
}

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
    console.log('client connected! id: ', client.id)

    function getCurrentCoffee() {
      let query = `SELECT users.firstname, users.image, history.cupcount, users.id, history.status FROM users INNER JOIN history ON users.id = history.userid WHERE history.status = 0`;
      pool.query(query, (err, rows) => {
        data = rows.rows;
        ioServer.emit('postedCup', data);
        let totalQuery = `select sum(cupcount) from history where status = 0;`;
        pool.query(totalQuery, (err, rows) => {
          let sum = rows.rows[0].sum
          ioServer.emit('cupToPi', sum);
        })
      })
    }

    client.on('piDisconnected', ()=>{
      console.log(':)')
    });



    client.on('coffeeConnect', (coffee) => {
      client.join(coffee);
    });

    client.on('/postcup', (data) => {
      console.log(data)
      console.log('////postcupppppp/////')
      let checkUserCt = `SELECT * FROM history WHERE userid = ${data.userid} AND status = 0`;
      pool.query(checkUserCt, (err, rows)=>{
        // if user in current brew state
        if (rows.rowCount > 0) {
          let updateQuery = `UPDATE history SET cupcount = ${data.cupcount} where userid = ${data.userid} RETURNING cupcount`
          pool.query(updateQuery, (err,rows) => { 
            getCurrentCoffee();
          })
        } else { // user not in current brew state yet
          let insertQuery = `INSERT INTO history (cupcount, status, userid) values (${data.cupcount}, 0, ${data.userid})`
          pool.query(insertQuery, (err, rows) => {
            if (err) throw err;
            getCurrentCoffee();
          }) 
        }
      })
    })

    client.on('/startBrew', (data) => {
      let startQuery = `UPDATE history SET status = 1 WHERE status = 0`
      pool.query(startQuery, (err, rows) => {
        getCurrentCoffee();
      })
      let timeQuery = `INSERT INTO lastbrew (ts, last) values (CURRENT_TIMESTAMP, 0)`
      pool.query(timeQuery, (err, rows) => {
        if (err) throw err;
        console.log(rows);
    })
    })

    client.on('/endBrew', (data) => {
      let startQuery = `UPDATE history SET status = 2 WHERE status = 1`;
      pool.query(startQuery, (err, rows) => {
        if (err) throw err;
          ioServer.emit('cupToPi', 0);
      })
      let endQuery = `SELECT ts FROM lastbrew  ORDER BY ts DESC LIMIT 1`;
      pool.query(endQuery, (err, rows) => {
        if (err) throw err;
        console.log(rows.rows[0])
        let data = rows.rows[0]
        ioServer.emit('endBrew', data)
      })
    })

    client.on('disconnect', ()=>{console.log("client disconnected")});
  });

  app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      res.json({ found: false, success: false, err: true, message: err });
    } else if (user) {
      req.logIn(user, (err) => {
        if (err) {
          next(err);
          res.json({ found: true, success: false, message: err })
        } else {
          let sum = 0
          let sumQuery = `select sum(cupcount) from history where status = 0;`
          pool.query(sumQuery, (err, rows) => {
            sum = rows.rows[0].sum
            let query = `SELECT * FROM history where userid = ${user.id} and status = 0`;
            let timeQuery = `SELECT ts FROM lastbrew  ORDER BY ts DESC LIMIT 1`;
            pool.query(timeQuery, (err, rows) => {
              lastbrew = rows.rows[0]

            pool.query(query, (error, rows) => {
              if (error) throw error;
              if (rows.rowCount > 0) {
                userCupcount = parseInt(rows.rows[0].cupcount);
              } else {
                userCupcount = 0
              }
              let theseUsers = {
                cupcount: null
              }
              let userQuery = `SELECT * FROM users INNER JOIN history ON users.id = history.userid where history.status = 0`;
              pool.query(userQuery, (error, users) => {
                if (error) throw error;
                theseUsers = users.rows;
                res.json({
                  lastbrew: lastbrew, 
                  users: theseUsers,
                  found: true, 
                  success: true, 
                  id: user.id, 
                  totalCount: sum, 
                  image: user.image,
                  userCupcount: userCupcount, 
                  email: user.email, 
                  firstName: user.firstname, 
                  lastName: user.lastname })
                })
              })
            })
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
    res.json('https://coffee-pot-pi.herokuapp.com:');
  } else {
    res.json('http://localhost:5000')
  }
});

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
app.get('/sign-s3', (req, res) => {
  //const s3 = new aws.S3();
const S3_BUCKET = process.env.S3_BUCKET;

  var s3 = new AWS.S3({
    'accessKeyId'     : process.env.ACCESS_KEY_ID,
    'secretAccessKey' : process.env.SECRET_ACCESS_KEY,
    'region'          : 'us-west-1'
  });

  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/gif') {
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  } else {

    res.end();
  }
});

function sendEmail(name, email) {
  'use strict';
  const nodemailer = require('nodemailer');
  
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
              user: process.env.GMAIL_ACCOUNT, // generated ethereal user
              pass: process.env.GMAIL_PASSWORD  // generated ethereal password
          }
      });
  
      // setup email data with unicode symbols
      let entry = (name !== '') ? 'Hey ' + name.charAt(0).toUpperCase() + name.slice(1) + ', ' : "Hey, " 
      let mailOptions = {
          from: '"Coffee Pot Pi" <noreply.coffee.pot.pi@gmail.com>', // sender address
        to: email, // list of receivers
        subject: `☕ You're on your way to fresh coffee`, // Subject line
        text: `${entry} thanks for signing up with Coffee Pot Pi! You must follow this link to activate your account:  http://coffee-pot-pi.herokuapp.com/confirm/${email}/ZYX`, // plain text body
        html: `
          <a href="http://coffee-pot-pi.herokuapp.com"><img src="http://coffee-pot-pi.herokuapp.com/images/logo-primary-crop.png" alt="Coffee Pot Pi"></a><br/><br/>
          ${entry} thanks for signing up with Coffee Pot Pi! You must follow this link to activate your account:<br/><br/>
          http://coffee-pot-pi.herokuapp.com/confirm/${email}/ZYX<br/><br/>
          Have fun, and don't hesitate to contact us with your feedback.<br/><br/>
          The Coffee Pot Pi Team<br/>
          http://coffee-pot-pi.herokuapp.com
          ` // html body
      };
  
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          //console.log('Message sent: %s', info.messageId);
      });
  });
}

app.post('/signup', (req, res, next) => {
  let query = `INSERT INTO users (firstname, lastname, email, password, image) values ('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${passwordHash.generate(req.body.password)}', '${req.body.image}') RETURNING id, firstname, lastname, email, id, image`  
  pool.query(query, (err, user) => {    
  if (err) { throw err; } else {
    sendEmail(req.body.firstName, req.body.email);
  }
    res.json(user.rows);
  });    
});

app.get('/history', (req, res, next) => {
  let query = `SELECT users.id, users.firstname, users.lastname, history.cupcount, history.added_at, users.image FROM history  INNER JOIN users ON users.id = history.userid WHERE status = 2 AND DATE_PART('day', NOW() - added_at) < 1 ORDER BY added_at DESC`  
  pool.query(query, (err, users) => {
    if (err) throw err;
    res.json(users.rows);
  });    
});

app.get('/confirm/:email/:code', (req, res, next) => {
    res.json({msg: '√ Your email has been confirmed.'});
});

app.post('/history', (req, res, next) => {
  let query = `SELECT users.id, users.firstname, users.lastname, history.cupcount, history.added_at, users.image FROM history  INNER JOIN users ON users.id = history.userid WHERE status = 2 AND users.id = ${req.body.userid} ORDER BY added_at DESC`  
  pool.query(query, (err, users) => {
    if (err) throw err;
    res.json(users.rows);
  });    
});

app.get('/lastBrew', (req,res, next) => {
  let timeQuery = `SELECT ts FROM lastbrew  ORDER BY ts DESC LIMIT 1`;
  pool.query(timeQuery, (err, rows) =>{
    if (err) throw err;
    let data = rows.rows[0]
    console.log(rows)    
    res.json(data)
  })
});

app.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

var port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('listening on port ' + port);
});    