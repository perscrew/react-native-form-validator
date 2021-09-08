import * as React from 'react';
import { shallow, configure } from 'enzyme';
import FunctionalFormTest from '../examples/FunctionalFormTest';
import { TextInput, Text, TouchableHighlight } from 'react-native';

import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('FunctionalComponent', () => {
  test('should display 7 text inputs', () => {
    const wrapper = shallow(<FunctionalFormTest />);
    const textInputs = wrapper.find(TextInput);
    expect(textInputs.length).toBe(7);
  });

  test('should display name error if name is lower than 3', () => {
    const wrapper = shallow(<FunctionalFormTest />);
    const textInput = wrapper.find(TextInput).at(0); // name input
    textInput.simulate('changeText', 'em');

    wrapper.find(TouchableHighlight).simulate('press');
    wrapper.update();

    const errorMsg = wrapper.find(Text).at(0);
    expect(errorMsg.contains(<Text>The field &quot;name&quot; length must be greater than 2.</Text>)).toBe(true);
  });

  test('should display name error if name is greater than 8', () => {
    const wrapper = shallow(<FunctionalFormTest />);
    const textInput = wrapper.find(TextInput).at(0); // name input
    textInput.simulate('changeText', 'mybeautifultest');

    wrapper.find(TouchableHighlight).simulate('press');
    wrapper.update();

    const errorMsg = wrapper.find(Text).at(0);
    expect(errorMsg.contains(<Text>The field &quot;name&quot; length must be lower than 7.</Text>)).toBe(true);
  });

  test('should display pseudo error if pseudo is not inquired', () => {
    const wrapper = shallow(<FunctionalFormTest />);

    wrapper.find(TouchableHighlight).simulate('press');
    wrapper.update();

    const errorMsg = wrapper.find(Text).at(1);
    expect(errorMsg.contains(<Text>The field &quot;name&quot; is mandatory.</Text>)).toBe(true);
  });

  test('should display email error if email is not a valid email', () => {
    const wrapper = shallow(<FunctionalFormTest />);
    const textInput = wrapper.find(TextInput).at(2); // email input
    textInput.simulate('changeText', 'wrongemai');

    wrapper.find(TouchableHighlight).simulate('press');
    wrapper.update();

    const errorMsg = wrapper.find(Text).at(3);
    expect(errorMsg.contains(<Text>The field &quot;email&quot; must be a valid email address.</Text>)).toBe(true);
  });

  test('should display email error if email is not a valid email', () => {
    const wrapper = shallow(<FunctionalFormTest />);
    const textInput = wrapper.find(TextInput).at(2); // email input
    textInput.simulate('changeText', 'wrongemai');

    wrapper.find(TouchableHighlight).simulate('press');
    wrapper.update();

    const errorMsg = wrapper.find(Text).at(3);
    expect(errorMsg.contains(<Text>The field &quot;email&quot; must be a valid email address.</Text>)).toBe(true);
  });

  test('should display number error if number is not a valid number', () => {
    const wrapper = shallow(<FunctionalFormTest />);
    const textInput = wrapper.find(TextInput).at(3); // number input
    textInput.simulate('changeText', 'abc');

    wrapper.find(TouchableHighlight).simulate('press');
    wrapper.update();

    const errorMsg = wrapper.find(Text).at(3);
    expect(errorMsg.contains(<Text>The field &quot;number&quot; must be a valid number.</Text>)).toBe(true);
  });

  test('should display date error if date is not a valid date pattern', () => {
    const wrapper = shallow(<FunctionalFormTest />);
    const textInput = wrapper.find(TextInput).at(4); // date input
    textInput.simulate('changeText', 'fdsfdf');

    wrapper.find(TouchableHighlight).simulate('press');
    wrapper.update();

    const errorMsg = wrapper.find(Text).at(3);
    expect(errorMsg.contains(<Text>The field &quot;date&quot; must be a valid date (YYYY-MM-DD).</Text>)).toBe(true);
  });

  test('should display confirm password error if passwords are not identical', () => {
    const wrapper = shallow(<FunctionalFormTest />);
    const password = wrapper.find(TextInput).at(5); // password input
    const confirmPassword = wrapper.find(TextInput).at(6); // confirm password input
    password.simulate('changeText', 'test');
    confirmPassword.simulate('changeText', 'test2');

    wrapper.find(TouchableHighlight).simulate('press');
    wrapper.update();

    const errorMsg = wrapper.find(Text);
    expect(errorMsg.contains(<Text>Passwords are different.</Text>)).toBe(true);
  });
});
