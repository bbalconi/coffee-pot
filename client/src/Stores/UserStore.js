import {
  extendObservable
} from 'mobx';
var axios = require('axios');

export default class UserStore {
  constructor() {
    extendObservable(this, {
      user: null,
      get retrieveUser() {
        return this.user
      }
    })
  };

  submitSignup(signupObj) {
    return new Promise((resolve, reject) => {
      axios.post('/signup', {
        firstName: signupObj.firstName,
        lastName: signupObj.lastName,
        email: signupObj.email,
        password: signupObj.password,
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
          this.user = res.data
          console.log(this.user)
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
      // getCount(){
      //   axios.post('/getCount').then((res) => {
      //     console.log(res)
      //     this.user = res.data
      //     })
      //   }
 
}