import React from 'react';
import { shallow } from 'enzyme';
import Navbar from './Navbar';

test('Navbar should render', ()=>{
  const component = shallow(<Navbar/>)
  console.log(component);
})