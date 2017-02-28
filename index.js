'use strict';

import React, { Component } from 'react';
import defaultRules from './defaultRules';
import defaultMessages from './defaultMessages';

class ValidationComponent extends Component {

  constructor(props) {
      super(props);
      // array to store error on each fields
      this.errors = [];
  }

  /*
  * Method validate to verify if each children respect the validator rules
  * Fields example (Array) :
  * fields = {
  *  input1: {
  *    required:true,
  *     numbers:true,
  *     maxLength:5
  *  }
  *}
  */
  validate(fields) {
    // Reset errors
    this._resetErrors();
    // Iterate over react native components
    React.Children.forEach(this.props.children, child => {
      // Check if child name is equals to fields array set up in parameters
      const {name, rules} = this._getFieldByName(fields, child.props.name);
      if (child.props.ref === name) {
        // Check rule for current field
        this._checkRules(name, rules, child.props.value);
      }
    });
    return this.isFormValid();
  }

  // Get a field mapping according react form name
  _getFieldByName(fields, fieldName) {
    for (const key of Object.keys(fields)) {
      if (fields[key] === fieldName)
        return { name:key, rules:fields[key] };
    }
    return null;
  }

  // Method to check rules on a spefific field
  _checkRules(fieldName, rules, value) {
    for (const key of Object.keys(rules)) {
      const isRuleFn = (typeof defaultRules[key] == "function"),
        isRegExp = (defaultRules[key] instanceof RegExp);
      if (rules[key] && (isRuleFn && defaultRules[key](rules[key], value))
          || (isRegExp && defaultRules[key].test(value)) {
        this._addError(fieldName, rules[key], value, isRuleFn);
      }
    }
  }

  // Add error
  _addError(fieldName, rule, value, isFn) {
    const errorMessage = {
      rule,
      message: defaultMessages[rule].replace("{0}", fieldName).replace("{1}", value)
    };
    // error already exists
    if (this.errors[fieldName]) {
      this.errors[fieldName].messages.push(errorMessage);
    } else {
      this.errors[fieldName] = {messages: [errorMessage]};
    }
  }

  // Reset error fields
  _resetErrors() {
    this.errors = [];
  }

  // Method to check if the field is in error
  isFieldInError(name) {
    return this.errors[name];
  }

  isFormValid() {
    for (const key of Object.keys(this.errors)) {
      if (this.errors[key])
        return false;
    }
    return true;
  }

  // Concatenate each error messages
  getErrorMessages() {
    return this.errors.map((error) => error ? error.messages.map(msg => msg + "\n") : "");
  }
}
