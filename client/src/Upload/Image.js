import React, { Component } from 'react';
import { Grid, TextField } from 'material-ui';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
const axios = require("axios");

var Image = observer(class Image extends Component {
  constructor() {
    super();
    this.state = {
      message: ''
    }
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
          document.getElementById('preview').src = url;
          document.getElementById('avatar-url').value = url;
          this.setState({
            message: ""
          })
        }
        else {
          // alert('Could not upload file.');
          this.setState({
            message: "Could not upload file. File type should be jpg, png or gif."
          })
        }
      }
    };
    xhr.send(file);
  }

  getSignedRequest(file){
    return new Promise((resolve, reject) => {
      axios.get(`/sign-s3?file-name=${file.name}&file-type=${file.type}&file-size=${file.size}`)
      .then((res) => {
        this.props.userStore.imageurl = res.data.url
        this.uploadFile(file, res.data.signedRequest, res.data.url);
        resolve();
      });
    }) 
  }
  initUpload() {
    const files = document.getElementById('file-input').files;
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
        <img alt="avatar" style={{width: '100px', height: 'auto'}} id="preview" src="/images/default.png"/>      
        <input type="hidden" id="avatar-url" name="avatar-url" value="/images/default.png"/>
          
        </Grid>
        <Grid item>
            <TextField
                onChange={this.handleChange} 
                type="file" 
                id="file-input" 
                name="file-input"
              />
          </Grid>
          {this.state.message}
        </div>
    );
  }
})

export default withRouter(inject('userStore')(Image));