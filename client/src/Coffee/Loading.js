import React, { Component } from 'react';
import Animation from './Animation';

export default class Loading extends Component {
  render() {
    return (
      <div style={{ position: 'relative', width:'50%', margin: '0 auto'}}>
        <Animation />
      </div>   
    );
  }
}