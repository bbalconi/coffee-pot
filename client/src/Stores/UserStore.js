import {
  extendObservable
} from 'mobx';
var axios = require('axios');

export default class UserStore {
  constructor() {
    extendObservable(this, {
      user: null,
      message: '',
      notify: 'denied',
      get retrieveUser() {
        return this.user
      }

      
    });

    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(function(result) {
          Notification.permission = result;
      });
    }
  };

  submitSignup(signupObj) {
    return new Promise((resolve, reject) => {
      axios.post('/signup', {
        firstName: signupObj.firstName,
        lastName: signupObj.lastName,
        email: signupObj.email,
        password: signupObj.password,
        image: signupObj.image
      }).then((res) => {
        this.user = res.data[0];
        resolve();
      });
    })
  }

  submitLogin(a, b) {
    return new Promise((resolve, reject) => {
      axios.post('/login', {
        username: a,
        password: b,
      }).then((res, err) => {
        if (err) throw err;
        if (res.data.success) {
          console.log(res.data)
          this.user = res.data
          resolve(res.data);
        } else {
          reject(res.data)
        }
      }).catch((error) => {
        reject(error);
      })
    });
  };
 
  logout() {
    axios.get('/logout').then((res)=> {
      console.log(res);
      if (res !== undefined) { 
        this.user = null;  
        sessionStorage.removeItem('user');
      }  else {
        console.log('undefined');
      }
    }, function(err){
      console.log(err);
    });
  }  
     

      notifyMe(message) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
          //alert("This browser does not support system notifications");
        }
      
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
          // If it's okay let's create a notification
          var notification = new Notification(message);
        }
      
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              var notification = new Notification(message);
            }
          });
        } 
      }
 
}