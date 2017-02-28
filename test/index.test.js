'use strict';

import React, {Component} from 'react';
import {
  Text,
  View
} from 'react-native';
import {shallow, mount} from 'enzyme';
import Moment from 'moment';
import {expect} from 'chai';
import sinon from 'sinon';

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

var FormTest = require('./formTest');

describe('ValidationComponent:', () => {

  it('initialize', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();

    expect(wrapper.state('errors')).to.equal([]);
  });

  it('default fields validation should be ok', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();

    formTest._onPressButton();

    expect(wrapper.state('errors')).to.equal([]);
    expect(formTest.isFormValid()).to.equal(true);
    expect(formTest.getErrorMessages()).to.equal("");
  });

  it('fields validation name should not be ok', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();
    wrapper.setState({name:"tt"});

    formTest._onPressButton();

    expect(formTest.isFormValid()).to.equal(false);
    expect(formTest.getErrorMessages()).to.not.equal("");
  });

  it('fields validation email should not be ok', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();
    wrapper.setState({email:"tt"});

    formTest._onPressButton();

    expect(formTest.isFormValid()).to.equal(false);
    expect(formTest.getErrorMessages()).to.not.equal("");
  });

  it('fields validation date should not be ok', () => {
    const wrapper = mount(<FormTest />);
    const formTest = wrapper.instance();
    wrapper.setState({date:"11/10/17"});

    formTest._onPressButton();

    expect(formTest.isFormValid()).to.equal(false);
    expect(formTest.getErrorMessages()).to.not.equal("");
  });
});
