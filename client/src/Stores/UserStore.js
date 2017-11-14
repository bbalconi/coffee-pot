import { extendObservable } from 'mobx';
var axios = require('axios');

export default class UserStore {
  constructor(){
    extendObservable(this, {
      user: null,
      get retrieveUser() {
        return this.user
      }
    });
  }

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
            console.log(res);
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
    return new Promise((resolve, reject) => {
      this.user.cupcount = this.user.cupcount + 1;
      console.log(this.user)
    axios.post('/postcup', {
      cupcount: this.user.cupcount,
      userid: this.user.id
    }).then((res) => {
      if (res) {
        this.setState({
          data: res
        })
      } else {
        reject('Response undefined')
      }
      resolve(res);
    })
  })  
}

}