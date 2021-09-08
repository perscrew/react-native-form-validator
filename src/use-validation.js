import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import defaultMessages from './messages/defaultMessages';
import defaultRules from './rules/defaultRules';

const useValidation = (props) => {
  const { state = {} } = props;
  // array to store error on each fields
  // ex:
  // [{ fieldName: "name", messages: ["The field name is required."] }]
  // Retrieve props
  const deviceLocale = props.deviceLocale || 'en'; // ex: en, fr
  const baseRules = props.rules || defaultRules; // rules for Validation
  const messages = props.messages || defaultMessages;
  const labels = props.labels || {};
  const errors = useRef([]);
  const [internalErrors, setInternalErrors] = useState([]);

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
  const validate = (fields) => {
    // Reset errors
    _resetErrors();
    // Iterate over inner state
    for (const key of Object.keys(state)) {
      // Check if child name is equals to fields array set up in parameters
      const rules = fields[key];
      if (rules) {
        // Check rule for current field
        _checkRules(key, rules, state[key]);
      }
    }
    return isFormValid();
  };

  // Method to check rules on a spefific field
  const _checkRules = (fieldName, rules, value) => {
    if (!value && !rules.required) {
      return; // if value is empty AND its not required by the rules, no need to check any other rules
    }
    for (const key of Object.keys(rules)) {
      const isRuleFn = typeof baseRules[key] == 'function';
      const isRegExp = baseRules[key] instanceof RegExp;
      if ((isRuleFn && !baseRules[key](rules[key], value)) || (isRegExp && !baseRules[key].test(value))) {
        _addError(fieldName, key, rules[key], isRuleFn);
      }
    }
  };

  // Add error
  // ex:
  // [{ fieldName: "name", messages: ["The field name is required."] }]
  const _addError = (fieldName, rule, value, isFn) => {
    const name = labels[fieldName];
    value = rule == 'minlength' ? value - 1 : value;
    const errMsg = messages[deviceLocale][rule].replace('{0}', name || fieldName).replace('{1}', value);
    let [error] = errors.current.filter((err) => err.fieldName === fieldName);
    // error already exists
    if (error) {
      // Update existing element
      const index = errors.current.indexOf(error);
      error.messages.push(errMsg);
      error.failedRules.push(rule);
      errors.current[index] = error;
    } else {
      // Add new item
      errors.current.push({
        fieldName,
        failedRules: [rule],
        messages: [errMsg]
      });
      setInternalErrors(errors.current);
    }
  };

  // Reset error fields
  const _resetErrors = () => {
    errors.current = [];
    setInternalErrors([]);
  };

  // Method to check if the field is in error
  const isFieldInError = (fieldName) => {
    return internalErrors.filter((err) => err.fieldName === fieldName).length > 0;
  };

  const isFormValid = () => {
    return errors.current?.length == 0;
  };

  // Return an object where the keys are the field names and the value is an array with the rules that failed validation
  const getFailedRules = () => {
    let failedRulesPerField = {};
    for (let index = 0; index < internalErrors.length; index++) {
      let error = internalErrors[index];
      failedRulesPerField[error.fieldName] = error.failedRules;
    }
    return failedRulesPerField;
  };

  // Return the rules that failed validation for the given field
  const getFailedRulesInField = (fieldName) => {
    const foundError = internalErrors.find((err) => err.fieldName === fieldName);
    if (!foundError) {
      return [];
    }
    return foundError.failedRules;
  };

  // Concatenate each error messages
  const getErrorMessages = (separator = '\n') => {
    return internalErrors.map((err) => err.messages.join(separator)).join(separator);
  };

  // Method to return errors on a specific field
  const getErrorsInField = (fieldName) => {
    const foundError = internalErrors.find((err) => err.fieldName === fieldName);
    if (!foundError) {
      return [];
    }
    return foundError.messages;
  };

  return {
    validate,
    isFormValid,
    isFieldInError,
    getFailedRules,
    getFailedRulesInField,
    getErrorMessages,
    getErrorsInField
  };
};

useValidation.propTypes = {
  deviceLocale: PropTypes.string, // Used for language locale
  rules: PropTypes.object, // rules for validations
  messages: PropTypes.object, // messages for validation errors
  labels: PropTypes.object // labels for validation messages
};

useValidation.defaultProps = {
  deviceLocale: 'en',
  rules: defaultRules,
  messages: defaultMessages,
  labels: {}
};

export default useValidation;
