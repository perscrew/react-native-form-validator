'use strict';

import React, { Component } from 'react';


import defaultRules from './defaultRules';
import defaultMessages from './defaultMessages';

export default class ValidationComponent extends Component {

  constructor(props) {
      super(props);
      // array to store error on each fields
      // ex:
      // [{ fieldName: "name", messages: ["The field name is required."] }]
      this.errors = [];
      this.deviceLocale = props.deviceLocale || 'en'; // ex: en, fr
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
    console.log("call validate");
    // Reset errors
    this._resetErrors();

    // Iterate over inner state
    for (const key of Object.keys(this.state)) {
      console.log("key loop : " + key);
      // Check if child name is equals to fields array set up in parameters
      const rules = fields[key];


        // Check rule for current field
        console.log("check rules for : " + key);
        this._checkRules(key, rules, this.state[key]);

    };
    return this.isFormValid();
  }

  // Get a field mapping according react form name
  _getFieldByName(fields, fieldName) {
    for (const key of Object.keys(fields)) {
      console.log("key field by name :"+key);
      if (fields[key] == fieldName) {
        return {
          name:key,
          rules: fields[key]
        };
      }
    }
    return null;
  }

  // Method to check rules on a spefific field
  _checkRules(fieldName, rules, value) {
    for (const key of Object.keys(rules)) {
      const isRuleFn = (typeof defaultRules[key] == "function");
      const isRegExp = (defaultRules[key] instanceof RegExp);
      if (rules[key] && (isRuleFn && defaultRules[key](rules[key], value)) || (isRegExp && defaultRules[key].test(value))) {
        this._addError(fieldName, key, value, isRuleFn);
      }
    }
  }

  // Add error
  // ex:
  // [{ fieldName: "name", messages: ["The field name is required."] }]
  _addError(fieldName, rule, value, isFn) {
    console.log("locale " + this.deviceLocale + " rule " + rule);
    const errMsg = defaultMessages[this.deviceLocale][rule].replace("{0}", fieldName).replace("{1}", value);
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

  // Used to retrieve the key in the defaultMessages.js file
  _getLocaleKeyForRule() {
    return this.deviceLocale.split("-")[0]; // return en for en-US
  }

  // Method to check if the field is in error
  isFieldInError(fieldName) {
    return (this.errors.filter(err => err.fieldName === fieldName).length > 0);
  }

  isFormValid() {
    return this.errors.length == 0;
  }

  // Concatenate each error messages
  getErrorMessages() {
    return this.errors.map((err) => err.messages.map(msg => msg + "\n")).join();
  }
}
