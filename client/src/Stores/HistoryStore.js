import {
  extendObservable
} from 'mobx';
var axios = require('axios');

export default class HistoryStore {
  constructor() {
    extendObservable(this, {
      users: null,
      message: '',
      
      retrieveUsers() {
        return this.users
      }
    })
    this.getHistory();
  };

  getHistory() {
    return new Promise((resolve, reject) => {
      axios.get('/history').then((res) => {
        console.log(res.data);
        this.users = res.data;
        console.log(this.users);
        resolve();
      });
    })
  }
}