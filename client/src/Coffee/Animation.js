import React, { Component } from 'react';
import CoffeeAnimation from './svg/coffee-cup.svg';
import './Animation.css';

export default class Animation extends Component {
  constructor() {
    super();
    this.animate = this.animate.bind(this);
    this.state = {
      percent: 0
    }
  }

  componentDidMount() {
    this.animate();
  }
  animate() {
    var divheight = document.getElementById('underlay').clientHeight;
    function updateHeight(i) {
      var height = i; 
     console.log(height);                    
      document.getElementById("coffeecup").style.height = divheight * (height/100)+ "px"; 
    } 
     
    var interval = 100; // how often to update in ms (100 times)
    for (let i = 100; i >= 0; i--) {
        setTimeout( ()=> {
            // Do Something 
          updateHeight(i);
          this.setState({percent: Math.abs(100 - i)})
        }, Math.abs(100 - i) * interval)
    }
    
  }
  render() {
   
    return (
      <div >
        <div>
        <div id="underlay" class="sm bg-underlay">
          <div class="svg-icon bg">
            <div class="svg-container">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px"  preserveAspectRatio="xMinYMin meet"   viewBox="0 0 21.664 21.665">
                <g className="coffeecup">
                  <path d="M2.756,20.725h2.95c0.041,0.257,0.254,0.458,0.523,0.458h6.707c0.27,0,0.482-0.2,0.523-0.458h2.95 c0.499,0,0.903-0.404,0.903-0.903H1.854C1.854,20.321,2.258,20.725,2.756,20.725z" />
                  <path d="M20.865,11.444c-0.752-0.609-1.811-0.619-2.508-0.542c0.02-0.486,0.031-0.983,0.031-1.5H0c0,4.97,0.752,8.556,5.511,9.894 h7.366c1.885-0.529,3.135-1.418,3.964-2.6c1.806-0.035,4.711-0.746,4.82-3.24C21.708,12.364,21.254,11.758,20.865,11.444z M17.598,15.27c0.346-0.889,0.551-1.889,0.664-2.988c0.488-0.08,1.329-0.131,1.754,0.215c0.078,0.064,0.321,0.262,0.293,0.901 C20.252,14.69,18.648,15.124,17.598,15.27z" />
                  <path d="M7.491,8.704c0,0,3.5-0.257,1.896-3.208c-1.288-2.369-0.994-3.759,0.654-5.015c0,0-5.398,1.375-2.25,5.63 C8.946,7.965,7.491,8.704,7.491,8.704z" />
                  <path d="M9.85,8.468c0,0,2.804-0.591,1.278-2.846c-0.554-0.978,0.21-1.327,0.21-1.327s-1.805,0.057-1.043,1.608 C10.905,7.15,10.724,7.858,9.85,8.468z" />
                </g>
              </svg>

            </div>
          </div>
        </div>
          <div class="sm">
            <div id="coffeecup" class="svg-icon">
              <div class="svg-container">

                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" preserveAspectRatio="xMinYMin meet" viewBox="0 0 21.664 21.665">
                  <g className="coffeecup">
                    <path d="M2.756,20.725h2.95c0.041,0.257,0.254,0.458,0.523,0.458h6.707c0.27,0,0.482-0.2,0.523-0.458h2.95 c0.499,0,0.903-0.404,0.903-0.903H1.854C1.854,20.321,2.258,20.725,2.756,20.725z" />
                    <path d="M20.865,11.444c-0.752-0.609-1.811-0.619-2.508-0.542c0.02-0.486,0.031-0.983,0.031-1.5H0c0,4.97,0.752,8.556,5.511,9.894 h7.366c1.885-0.529,3.135-1.418,3.964-2.6c1.806-0.035,4.711-0.746,4.82-3.24C21.708,12.364,21.254,11.758,20.865,11.444z M17.598,15.27c0.346-0.889,0.551-1.889,0.664-2.988c0.488-0.08,1.329-0.131,1.754,0.215c0.078,0.064,0.321,0.262,0.293,0.901 C20.252,14.69,18.648,15.124,17.598,15.27z" />
                    <path d="M7.491,8.704c0,0,3.5-0.257,1.896-3.208c-1.288-2.369-0.994-3.759,0.654-5.015c0,0-5.398,1.375-2.25,5.63 C8.946,7.965,7.491,8.704,7.491,8.704z" />
                    <path d="M9.85,8.468c0,0,2.804-0.591,1.278-2.846c-0.554-0.978,0.21-1.327,0.21-1.327s-1.805,0.057-1.043,1.608 C10.905,7.15,10.724,7.858,9.85,8.468z" />
                  </g>
                </svg>
            </div>
          </div>

        </div>
        </div>
        <div style={{textAlign:'center'}}>
          <h3>Brewing: {this.state.percent}% complete</h3>
        </div>
      </div>
    );
  }
}