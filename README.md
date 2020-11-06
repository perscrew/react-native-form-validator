# React native form validator
[![Build Status](https://travis-ci.org/perscrew/react-native-form-validator.svg?branch=master)](https://travis-ci.org/perscrew/react-native-form-validator)

React native form validator is a simple library to validate your form fields with React Native.
The library is voluntarily easy to use. You juste have to extends the "ValidationComponent" class on your desired React native form component.

## 1. Installation
* Run npm install 'react-native-form-validator' to fetch the library :
```sh
npm install 'react-native-form-validator' --save
```

## 2. Use it in your app

Extend "ValidationComponent" class on a your form component :
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
|equalPassword|Check if a state variable is equal to antoher value (useful for password confirm).|
|hasNumber|Check if a state variable contains a number.|
|hasUpperCase|Check if a state variable contains a upper case letter.|
|hasLowerCase|Check if a state variable contains a lower case letter.|
|hasSpecialCharacter|Check if a state variable contains a special character.|

You can also override this file via the component React props :
```js
const rules = {any: /^(.*)$/};

<FormTest rules={rules} />
```


Once you have extended the class a set of usefull methods become avaiblable :

|Method|Output|Benefits|
|-------|--------|--------|
|this.validate(state_rules)|Boolean|This method ensures form validation within the object passed in argument.The object should be a representation of the React component state. The first graph level matches with the React state variables.The second level matches with the existing validation rules.|
|this.isFormValid()|Boolean|This method indicates if the form is valid and if there is no errors.|
|this.isFieldInError(fieldName)|Boolean|This method indicates if a specific field is in error. The field name will matches with your React state|
|this.getErrorMessages(separator)|String|This method returns the different error messages bound to your React state. The argument is optional, by default the separator is a \n. Under the hood a join method is used.|
|this.getErrorsInField(fieldName)|Array|This method returns the error messages bound to the specified field. The field name will match with your React state. it returns an empty array if no error was bound to the filed.|

The library also contains a [defaultMessages.js](./defaultMessages.js) file which includes the errors label for a language locale.
You can override this file via the component React props :
```js
const messages = {
  en: {numbers: "error on numbers !"},
  fr: {numbers: "erreur sur les nombres !"}
};

<FormTest messages={messages} />
```
You can add custom labels to the state variables, it will be useful if want to change it's label in the error messages or translate it
 to the language locale :
```js
const labels = {
  name: 'Name',
  email: 'E-mail',
  number: 'Phone number'
};

<FormTest labels={labels} />
```

You can also specify the default custom language locale in the props :

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

## 3. Complete example

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
