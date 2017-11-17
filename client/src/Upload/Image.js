import React, { Component } from 'react';
const axios = require("axios");

export default class Image extends Component {
  constructor() {
    super();
    this.initUpload = this.initUpload.bind(this);
    this.getSignedRequest = this.getSignedRequest.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.initUpload();
  }

  // Function to carry out the actual PUT request to S3 using the signed request from the app.
  uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(url)
          document.getElementById('preview').src = url;
          document.getElementById('avatar-url').value = url;
        }
        else {
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  getSignedRequest(file){
    const xhr = new XMLHttpRequest();
    console.log("______________________________!")
    console.log(file)
    return new Promise((resolve, reject) => {
      axios.get(`/sign-s3?file-name=${file.name}&file-type=${file.type}&file-size=${file.size}`)
      .then((res) => {
        console.log(res.data);
        this.uploadFile(file, res.data.signedRequest, res.data.url);
        resolve();
      });
    }) 

    // xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    // xhr.onreadystatechange = () => {
    //   if(xhr.readyState === 4){
    //     if(xhr.status === 200){
    //       const response = JSON.parse(xhr.responseText);
    //       //this.uploadFile(file, response.signedRequest, response.url);
    //     }
    //     else{
    //       alert('Could not get signed URL.');
    //     }
    //   }
    // };
    // xhr.send();
  }
  initUpload() {
    const files = document.getElementById('file-input').files;
    console.log(files);
    const file = files[0];
    if(file == null){
      return alert('No file selected.');
    }
    this.getSignedRequest(file);
  }
  render() {
    return (
      <div>
        <input onChange={this.handleChange} type="file" id="file-input"/>
          <p id="status">Please select a file</p>
          <img  id="preview" src="/images/default.png"/>

          <form method="POST" action="/save-details">
          <input type="hidden" id="avatar-url" name="avatar-url" value="/images/default.png"/>
          <input type="text" name="username" placeholder="Username"/> <br/>
          <input type="text" name="full-name" placeholder="Full name"/> <br/> <br/>
          <input type="submit" value="Update profile" />
          </form>
      </div>
    );
  }
}