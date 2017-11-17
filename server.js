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
const aws = require('aws-sdk');
require('dotenv').config();

aws.config.region = 'us-west-1';
const S3_BUCKET = process.env.S3_BUCKET;
var accessKeyId = process.env.AWS_KEY;
var secretAccessKey = process.env.AWS_ACCESS;

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
app.get('/sign-s3', (req, res) => {
  
  var s3 = new aws.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "us-west-1" 
  });
  // s3.config = new aws.Config();
  
 
var params = {
    Bucket: process.env.S3_BUCKET,
    Key: 'mykey.txt',
    Body: "HelloWorld"
};
s3.putObject(params, function (err, res) {
    if (err) {
        console.log("Error uploading data: ", err);
    } else {
      console.log(res);
      resolve();
        console.log("Successfully uploaded data to myBucket/myKey");
    }
});




  // const s3 = new aws.S3({
  //   accessKeyId: accessKeyId,
  //   secretAccessKey: secretAccessKey
  // }); 

  // const fileName = req.query['file-name'];
  // const fileType = req.query['file-type'];
  // const s3Params = {
  //   Bucket: S3_BUCKET,
  //   Key: fileName,
  //   Expires: 60,
  //   ContentType: fileType,
  //   ACL: 'public-read' 
  // };

  // s3.getSignedUrl('putObject', s3Params, (err, data) => {
  //   if(err){
  //     console.log(err);
  //     return res.end();
  //   }
  //   console.log(S3_BUCKET + fileName)
  //   const returnData = {
  //     signedRequest: data,
  //     url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
  //   };
  //   console.log(returnData);
  //   res.write(JSON.stringify(returnData));
  //   res.end();
  // });
});



/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in
 * a way that suits your application.
 */
app.post('/save-details', (req, res) => {
  // TODO: Read POSTed form data and do something useful
});

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
    console.log('client connected')
    client.on('coffeeConnect', (coffee) => {
      client.join(coffee);
    });

    client.on('/postcup', (data) => {
      let updateQuery = `UPDATE history SET cupcount = ${data.cupcount} where userid = ${data.userid} RETURNING cupcount`
      pool.query(updateQuery, (err,rows) => { 
        let query = `SELECT * FROM users INNER JOIN history ON users.id = history.userid`
        pool.query(query, (err, rows) => {
          data = rows.rows;
          ioServer.in(rows).emit('postedCup', data);
        })
      })
    })

    client.on('/startBrew', (data) => {
      let startQuery = `UPDATE history SET cupcount = 0 WHERE id > 0`
      pool.query(startQuery, (err, rows) => {
        let secondQuery = `SELECT * FROM users INNER JOIN history ON users.id = history.userid`
        pool.query(secondQuery, (err, rows) => {
          console.log(rows.rows)
          data = rows.rows;
          ioServer.in(rows).emit('postedCup', data);
        })
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
            let query = `SELECT * FROM history where userid = ${user.id}`;
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
              let userQuery = `SELECT * FROM users INNER JOIN history ON users.id = history.userid`;
              pool.query(userQuery, (error, users) => {
                console.log(userQuery)
                console.log(users.rows)
                if (error) throw error;
                theseUsers = users.rows;
                res.json({ 
                  users: theseUsers,
                  found: true, 
                  success: true, 
                  id: user.id, 
                  totalCount: sum, 
                  userCupcount: userCupcount, 
                  email: user.email, 
                  firstName: user.firstname, 
                  lastName: user.lastname })
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

app.post('/signup', (req, res, next) => {
 let query = `INSERT INTO users (firstname, lastname, email, password) values ('${req.body.firstName}', '${req.body.lastName}', '${req.body.email}', '${passwordHash.generate(req.body.password)}') RETURNING id, firstname, lastname, email`  
  pool.query(query, (err, user) => {
  if (err) throw err;
    res.json(user.rows);
  });    
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