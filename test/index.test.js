'use strict';

import React, {Component} from 'react';
import { Text, View } from 'react-native';
import {shallow, mount} from 'enzyme';
import Moment from 'moment';
import {expect} from 'chai';
import sinon from 'sinon';
import FormTest from './formTest';

/*---------------- mock DOM ----------------*/
import {jsdom} from 'jsdom';
var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

global.ErrorUtils = {
  setGlobalHandler: () => {}
};



describe('ValidationComponent:', () => {

  it('initialize', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();

    expect(formTest.errors).to.deep.equal([]);
  });

  it('default fields validation should be ok', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();

    formTest._onPressButton();

    expect(formTest.errors).to.deep.equal([]);
    expect(formTest.isFormValid()).to.equal(true);
    expect(formTest.getErrorMessages()).to.equal("");
  });

  it('fields validation name should not be ok', () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find('TextInput').first();
    textInput.simulate('changeText', "tt");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    console.log("error messages : " + formTest.getErrorMessages());

    expect(formTest.isFormValid()).to.equal(false);
    expect(formTest.getErrorMessages()).to.not.equal("");
  });

  it('fields validation email should not be ok', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();
    formTest.setState({email:"tt"});

    formTest._onPressButton();

    expect(formTest.isFormValid()).to.equal(false);
    expect(formTest.getErrorMessages()).to.not.equal("");
  });

  it('fields validation date should not be ok', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();
    formTest.setState({date:"11/10/17"});

    formTest._onPressButton();

    expect(formTest.isFormValid()).to.equal(false);
    expect(formTest.getErrorMessages()).to.not.equal("");
  });
});
