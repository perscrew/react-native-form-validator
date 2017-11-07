'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';


import defaultRules from './defaultRules';
import defaultMessages from './defaultMessages';

export default class ValidationComponent extends Component {

  constructor(props) {
      super(props);
      // array to store error on each fields
      // ex:
      // [{ fieldName: "name", messages: ["The field name is required."] }]
      this.errors = [];
      // Retrieve props
      this.deviceLocale = props.deviceLocale || 'en'; // ex: en, fr
      this.rules = props.rules || defaultRules; // rules for Validation
      this.messages = props.messages || defaultMessages;
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
    // Iterate over inner state
    for (const key of Object.keys(this.state)) {
      // Check if child name is equals to fields array set up in parameters
      const rules = fields[key];
      if (rules) {
        // Check rule for current field
        this._checkRules(key, rules, this.state[key]);
      }
    };
    return this.isFormValid();
  }

  // Method to check rules on a spefific field
  _checkRules(fieldName, rules, value) {
    for (const key of Object.keys(rules)) {
      const isRuleFn = (typeof this.rules[key] == "function");
      const isRegExp = (this.rules[key] instanceof RegExp);
      if ((isRuleFn && !this.rules[key](rules[key], value)) || (isRegExp && !this.rules[key].test(value))) {
        this._addError(fieldName, key, rules[key], isRuleFn);
      }
    }
  }

  // Add error
  // ex:
  // [{ fieldName: "name", messages: ["The field name is required."] }]
  _addError(fieldName, rule, value, isFn) {
    const errMsg = this.messages[this.deviceLocale][rule].replace("{0}", fieldName).replace("{1}", value);
    let [error] = this.errors.filter(err => err.fieldName === fieldName);
    // error already exists
    if (error) {
      // Update existing element
      const index = this.errors.indexOf(error);
      error.messages.push(errMsg);
      this.errors[index] = error;
    } else {
      // Add new item
      this.errors.push({
        fieldName,
        messages: [errMsg]
      });
    }
  }

  // Reset error fields
  _resetErrors() {
    this.errors = [];
  }

  // Method to check if the field is in error
  isFieldInError(fieldName) {
    return (this.errors.filter(err => err.fieldName === fieldName).length > 0);
  }

  isFormValid() {
    return this.errors.length == 0;
  }

  // Concatenate each error messages
  getErrorMessages(separator="\n") {
    return this.errors.map((err) => err.messages.join(separator)).join(separator);
  }

  // Method to return errors on a specific field
  getErrorsInField(fieldName) {
    const foundError = this.errors.find(err => err.fieldName === fieldName)
    if (!foundError) {
      return []
    }
    return foundError.messages
  }
}

// PropTypes for component
ValidationComponent.propTypes = {
  deviceLocale: PropTypes.string, // Used for language locale
  rules: PropTypes.object, // rules for validations
  messages : PropTypes.object // messages for validation errors
}
