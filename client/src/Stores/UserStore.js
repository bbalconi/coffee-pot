import { extendObservable } from 'mobx';
import openSocket from 'socket.io-client';
var axios = require('axios');

export default class UserStore {
  constructor(){
    extendObservable(this, {
      user: null,
      get retrieveUser() {
        return this.user
      }
    })
    axios.post('/socketUrl').then((res) => {
      console.log(res)
      var socketUrl = res.data;
      this.socket = openSocket(socketUrl)
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
        }
      )
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
            resolve(res.data);
            } else {
              reject(res.data)
            }
          }).catch((e)=>{
            reject(e);
          })

        });
      };

      logOut() {
        return new Promise((resolve, reject) => {
          axios.post('/logout').then((res) => {
            this.user = null
            resolve();
          })
        }
        )
      }   


  updateCount(){
    console.log(this)
    console.log(this.socket)
    this.user.cupcount = this.user.cupcount + 1;
    this.socket.emit('/postcup', {
      cupcount: this.user.cupcount,
      userid: this.user.id
    })
    }

}