
import * as React from 'react';
import { shallow, configure } from 'enzyme';
import renderer from 'react-test-renderer';
import FormTest from '../examples/FormTest';
import { TextInput } from 'react-native';

import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('ValidationComponent:', () => {

  test('initialize', () => {
    const component = renderer.create(<FormTest />);
    expect(component.getInstance().errors).toEqual([]);
  });

   it('default fields validation should be ok', () => {
    const component = renderer.create(<FormTest />);
    const formTest = component.getInstance();

    formTest._onPressButton();

    expect(formTest.errors).toEqual([]);
    expect(formTest.isFormValid()).toBe(true);
    expect(formTest.getErrorsInField('name')).toEqual([]);
    expect(formTest.getErrorsInField('number')).toEqual([]);
    expect(formTest.getErrorMessages()).toBe("");
  });

  it('method validate should return false', () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).first(); // name input
    //Seize a value lower than 2 chars
    textInput.simulate('changeText', "na"); // minlength = 3

    const formTest = wrapper.instance();
    expect(formTest.validate({ name: { minlength: 3 } })).toBe(false);
  });

  it('empty field with required rule should not be ok', () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).first(); // name input
    //Seize a value lower than 2 chars
    textInput.simulate('changeText', ""); // minlength = 3

    const formTest = wrapper.instance();
    expect(formTest.validate({ name: { required: true } })).toBe(false);
  });

  it('fields validation name should not be ok', () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).first(); // name input

    //Seize a value lower than 2 chars
    textInput.simulate('changeText', "na"); // minlength = 3

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "name" length must be greater than 2.');
    expect(formTest.isFieldInError('name')).toBe(true);

    // Seize an empty value
    textInput.simulate('changeText', ""); // minlength = 3
    formTest._onPressButton();
    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "name" length must be greater than 2.\nThe field "name" is mandatory.');
    expect(formTest.getErrorsInField('name')).toEqual([
      'The field "name" length must be greater than 2.',
      'The field "name" is mandatory.'
    ])
    expect(formTest.isFieldInError('name')).toBe(true);

    // Seize a value greater than maxlength (7)
    textInput.simulate('changeText', "12345678"); // maxlength = 7
    formTest._onPressButton();
    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "name" length must be lower than 7.');
    expect(formTest.isFieldInError('name')).toBe(true);
  });

   it('fields validation email should not be ok', () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(1); // email input
    textInput.simulate('changeText', "em");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "email" must be a valid email address.');
    expect(formTest.isFieldInError('email')).toBe(true);
  });

  

  it('fields validation date should not be ok', () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(3); // date input
    textInput.simulate('changeText', "fdsfds");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "date" must be a valid date (YYYY-MM-DD).');
    expect(formTest.isFieldInError('date')).toBe(true);
  });


   it('fields validation number should not be ok', () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(2); // number input
    textInput.simulate('changeText', "not_number");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "number" must be a valid number.');
    expect(formTest.isFieldInError('number')).toBe(true);
  });

   it('fields validation number should not be very OK', () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(2); // number input
    textInput.simulate('changeText', "not_number");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "number" must be a valid number.');
    expect(formTest.getErrorsInField('number')).toEqual(['The field "number" must be a valid number.'])
    expect(formTest.isFieldInError('number')).toBe(true);
  });
  

  it('deviceLocale props should be fr', () => {
    const wrapper = shallow(<FormTest deviceLocale="fr" />);
    const formTest = wrapper.instance();
    expect(formTest.deviceLocale).toBe("fr");
  });

   it('error messages should be in fr locale', () => {
    const wrapper = shallow(<FormTest deviceLocale="fr" />);
    const textInput = wrapper.find(TextInput).at(1); // email input
    textInput.simulate('changeText', "em");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('Le champ "email" doit être une adresse email valide.');
    expect(formTest.isFieldInError('email')).toBe(true);
    expect(formTest.deviceLocale).toBe("fr");
  });

  it('rules props should be updated', () => {
    const rules = { any: /^(.*)$/ };
    const wrapper = shallow(<FormTest rules={rules} />);
    const formTest = wrapper.instance();
    expect(formTest.rules).toEqual(rules);
  });

  it('messages props should be updated', () => {
    const messages = {
      en: { numbers: "error on numbers !" },
      fr: { numbers: "erreur sur les nombres !" }
    };
    const wrapper = shallow(<FormTest messages={messages} />);
    const formTest = wrapper.instance();
    expect(formTest.messages).toEqual(messages);
  });

  it("fields password doesn't have number - not ok", () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(4); // number input
    textInput.simulate('changeText', "Azerty*");
    const textInput2 = wrapper.find(TextInput).at(5); // number input
    textInput2.simulate('changeText', "Azerty*");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "password" must contain a number.');
    expect(formTest.isFieldInError('password')).toBe(true);
  });

  it("field password doesn't have special character - not ok", () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(4); // number input
    textInput.simulate('changeText', "Azerty1");
    const textInput2 = wrapper.find(TextInput).at(5); // number input
    textInput2.simulate('changeText', "Azerty1");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "password" must contain a special character.');
    expect(formTest.isFieldInError('password')).toBe(true);
  });

  it("field password doesn't have lower case - not ok", () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(4); // number input
    textInput.simulate('changeText', "A1*");
    const textInput2 = wrapper.find(TextInput).at(5); // number input
    textInput2.simulate('changeText', "A1*");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "password" must contain a lower case.');
    expect(formTest.isFieldInError('password')).toBe(true);
  });

  it("field password doesn't have upper case - not ok", () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(4); // number input
    textInput.simulate('changeText', "a1*");
    const textInput2 = wrapper.find(TextInput).at(5); // number input
    textInput2.simulate('changeText', "a1*");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('The field "password" must contain a upper case.');
    expect(formTest.isFieldInError('password')).toBe(true);
  });

   it("field password is not equal to confirm password - not ok", () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(4); // number input
    textInput.simulate('changeText', "Aa1*");
    const textInput2 = wrapper.find(TextInput).at(5); // number input
    textInput2.simulate('changeText', "a1*");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(false);
    expect(formTest.getErrorMessages()).toBe('Passwords are different.');
    expect(formTest.isFieldInError('confirmPassword')).toBe(true);
  });

   it("password fields  are ok", () => {
    const wrapper = shallow(<FormTest />);
    const textInput = wrapper.find(TextInput).at(4); // number input
    textInput.simulate('changeText', "Aa1*");
    const textInput2 = wrapper.find(TextInput).at(5); // number input
    textInput2.simulate('changeText', "Aa1*");

    const formTest = wrapper.instance();
    formTest._onPressButton();

    expect(formTest.isFormValid()).toBe(true);
    expect(formTest.getErrorMessages()).toBe("");
    expect(formTest.isFieldInError('password')).toBe(false);
    expect(formTest.isFieldInError('confirmPassword')).toBe(false);
  }); 

});
