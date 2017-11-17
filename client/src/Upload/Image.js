import React, { Component } from 'react';
import { Grid, TextField, Button } from 'material-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
const axios = require("axios");

var Image = observer(class Image extends Component {
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
    return new Promise((resolve, reject) => {
      axios.get(`/sign-s3?file-name=${file.name}&file-type=${file.type}&file-size=${file.size}`)
      .then((res) => {
        console.log(res.data);
        this.props.userStore.imageurl = res.data.url
        this.uploadFile(file, res.data.signedRequest, res.data.url);
        resolve();
      });
    }) 
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
       <Grid item>
       <img style={{width: '100px', height: 'auto'}} id="preview" src="/images/default.png"/>      
        <input type="hidden" id="avatar-url" name="avatar-url" value="/images/default.png"/>
      
         
      </Grid>
      <Grid item>
          <TextField
              onChange={this.handleChange} 
              type="file" 
              id="file-input" 
              name="file-input"
              label="Please select a file"
              lineDirection="center"
            />
        </Grid>
</div>
    );
  }
})

export default withRouter(inject('userStore')(Image));