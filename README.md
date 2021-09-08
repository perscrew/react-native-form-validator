# React native form validator
[![Node.js CI](https://github.com/perscrew/react-native-form-validator/actions/workflows/ci.yml/badge.svg)](https://github.com/perscrew/react-native-form-validator/actions/workflows/ci.yml)
[![Npm package version](https://badgen.net/npm/v/react-native-form-validator)](https://www.npmjs.com/package/react-native-form-validator)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)

React native form validator is a simple library to validate your form fields with React Native.
The library is easy to use. You just have to extend the "ValidationComponent" class on your desired React native form component.

## 1. Installation
* Run npm install 'react-native-form-validator' to fetch the library :
```sh
npm install 'react-native-form-validator' --save
```

## 2. Use it in your app
### For class component:


Extend "ValidationComponent" class on a form component :
```js
import React from 'react';
import ValidationComponent from 'react-native-form-validator';

export default class MyForm extends ValidationComponent {
  ...
}
```
The ValidationComponent extends the React.Component class.

To ensure form validation you have to call the "this.validate" method in a custom function.
```js
constructor(props) {
  super(props);
  this.state = {name : "My name", email: "titi@gmail.com", number:"56", date: "2017-03-01"};
}

_onSubmit() {
  // Call ValidationComponent validate method
  this.validate({
    name: {minlength:3, maxlength:7, required: true},
    email: {email: true},
    number: {numbers: true},
    date: {date: 'YYYY-MM-DD'}
  });
}
```
The method arguments should be a representation of the React component state. The first graph level matches with the React state variables.
The second level matches with the existing validation rules.

You will find bellow the default rules available in the library [defaultRules.js](./defaultRules.js) :

|Rule|Benefits|
|-------|--------|
|numbers|Check if a state variable is a number.|
|email|Check if a state variable is an email.|
|required|Check if a state variable is not empty.|
|date|Check if a state variable respects the date pattern. Ex: date: 'YYYY-MM-DD'|
|minlength|Check if a state variable is greater than minlength.|
|maxlength|Check if a state variable is lower than maxlength.|
|equalPassword|Check if a state variable is equal to another value (useful for password confirm).|
|hasNumber|Check if a state variable contains a number.|
|hasUpperCase|Check if a state variable contains a upper case letter.|
|hasLowerCase|Check if a state variable contains a lower case letter.|
|hasSpecialCharacter|Check if a state variable contains a special character.|

You can also override this file via the component React props :
```js
const rules = {any: /^(.*)$/};

<FormTest rules={rules} />
```


Once you have extended the class a set of useful methods become avaiblable :

|Method|Output|Benefits|
|-------|--------|--------|
|this.validate(state_rules)|Boolean|This method ensures form validation within the object passed in argument.The object should be a representation of the React component state. The first graph level matches with the React state variables.The second level matches with the existing validation rules.|
|this.isFormValid()|Boolean|This method indicates if the form is valid and if there are no errors.|
|this.isFieldInError(fieldName)|Boolean|This method indicates if a specific field has an error. The field name will match with your React state|
|this.getErrorMessages(separator)|String|This method returns the different error messages bound to your React state. The argument is optional, by default the separator is a \n. Under the hood a join method is used.|
|this.getErrorsInField(fieldName)|Array|This method returns the error messages bound to the specified field. The field name will match with your React state. It returns an empty array if no error was bound to the field.|

The library also contains a [defaultMessages.js](./defaultMessages.js) file which includes the errors label for a language locale.
You can override this file via the component React props :
```js
const messages = {
  en: {numbers: "error on numbers !"},
  fr: {numbers: "erreur sur les nombres !"}
};

<FormTest messages={messages} />
```
You can add custom labels to the state variables, which will be useful if you want to change it's label in the error messages or translate it
 to the local language :
```js
const labels = {
  name: 'Name',
  email: 'E-mail',
  number: 'Phone number'
};

<FormTest labels={labels} />
```

You can also specify the default custom local language in the props :

```js
<FormTest deviceLocale="fr" />
```
### Dynamic validation onChangeText 
You can also use dynamic validation by calling validate function on onChangeText event :

```js
<Input ref="lastName" placeholder={ApiUtils.translate('profile.lastname') + ' *'} 
                onChangeText={(lastName) => {
                  this.setState({ lastName }, () => {
                    this.validate({
                      lastName: { required: true },
                    })
                  })
                }} value={this.state.lastName} style={[styles.input]} />
{this.isFieldInError('lastName') && this.getErrorsInField('lastName').map(errorMessage => <Text style={styles.error}>{errorMessage}</Text>)}
```

### For functional component:

You will use useValidation hook inside your component like this :

```js
import { useValidation } from 'react-native-form-validator';
import customValidationMessages from './customValidationMessages';

const MyFunction = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const { validate, getErrorsInField } = useValidation({
    state: { email, name },
    messages: customValidationMessages,
  });
  
  const _validateForm = () => {
    validate({
      email: { email: true },
      name: { required: true }
    })
  }
}
```
You need to pass the state manually to the useValidation hook in state object like above.
You can also pass custom messages, labels, rules, deviceLocale and it returns object with all the methods that available in the class component.


## 3. Complete example

### Class component:

You can find a complete example in the [formTest.js](./test/formTest.js) file :

```js
'use strict';

import React, {Component}  from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import ValidationComponent from '../index';

export default class FormTest extends ValidationComponent {

  constructor(props) {
    super(props);
    this.state = {name : "My name", email: "tibtib@gmail.com", number:"56", date: "2017-03-01", newPassword : "", confirmPassword : ""};
  }

  _onPressButton() {
    // Call ValidationComponent validate method
    this.validate({
      name: {minlength:3, maxlength:7, required: true},
      email: {email: true},
      number: {numbers: true},
      date: {date: 'YYYY-MM-DD'},
      confirmPassword : {equalPassword : this.state.newPassword}
    });
  }

  render() {
      return (
        <View>
          <TextInput ref="name" onChangeText={(name) => this.setState({name})} value={this.state.name} />
          <TextInput ref="email" onChangeText={(email) => this.setState({email})} value={this.state.email} />
          <TextInput ref="number" onChangeText={(number) => this.setState({number})} value={this.state.number} />
          <TextInput ref="date" onChangeText={(date) => this.setState({date})} value={this.state.date} />
          {this.isFieldInError('date') && this.getErrorsInField('date').map(errorMessage => <Text>{errorMessage}</Text>) }

          <TextInput ref="newPassword" onChangeText={(newPassword) => this.setState({newPassword})} value={this.state.newPassword}  secureTextEntry={true}/>
          <TextInput ref="confirmPassword" onChangeText={(confirmPassword) => this.setState({confirmPassword})} value={this.state.confirmPassword} secureTextEntry={true} />
          {this.isFieldInError('confirmPassword') && this.getErrorsInField('confirmPassword').map(errorMessage => <Text>{errorMessage}</Text>) }

          <TouchableHighlight onPress={this._onPressButton}>
            <Text>Submit</Text>
          </TouchableHighlight>

          <Text>
            {this.getErrorMessages()}
          </Text>
        </View>
      );
  }

}
```

### Function Component:

```js
'use strict';

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight } from 'react-native';
import { useValidation } from 'react-native-form-validator';

const FormTest = () => {
  const [name, setName] = useState('My name');
  const [email, setEmail] = useState('tibtib@gmail.com');
  const [number, setNumber] = useState('56');
  const [date, setDate] = useState('2017-03-01');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: { name, email, number, date, newPassword, confirmPassword },
    });

  const _onPressButton = () => {
    validate({
      name: { minlength: 3, maxlength: 7, required: true },
      email: { email: true },
      number: { numbers: true },
      date: { date: 'YYYY-MM-DD' },
      confirmPassword: { equalPassword: newPassword },
    });
  };

  return (
    <View>
      <TextInput onChangeText={setName} value={name} />
      <TextInput onChangeText={setEmail} value={email} />
      <TextInput onChangeText={setNumber} value={number} />
      <TextInput onChangeText={setDate} value={date} />
      {isFieldInError('date') &&
        getErrorsInField('date').map(errorMessage => (
          <Text>{errorMessage}</Text>
        ))}

      <TextInput
        onChangeText={setNewPassword}
        value={newPassword}
        secureTextEntry={true}
      />
      <TextInput
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
      />
      {isFieldInError('confirmPassword') &&
        getErrorsInField('confirmPassword').map(errorMessage => (
          <Text>{errorMessage}</Text>
        ))}

      <TouchableHighlight onPress={_onPressButton}>
        <Text>Submit</Text>
      </TouchableHighlight>

      <Text>{getErrorMessages()}</Text>
    </View>
  );
};

export default FormTest;
```
