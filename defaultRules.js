'use strict';

import moment from 'moment';

// Custom default rules to validate form fields
const defaultRules = {
  numbers: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  required: /\S+/,
  date(format="YYYY-MM-DD", value) {
    const d = moment(value, format);
    if(d == null || !d.isValid()) return false;
    return true;
  },
  minlength(length, value) {
    if (length === void(0)) {
      throw 'ERROR: It is not a valid length, checkout your minlength settings.';
    } else if(value.length > length) {
      return true;
    }
    return false;
  },
  maxlength(length, value) {
    if (length === void(0)) {
      throw 'ERROR: It is not a valid length, checkout your maxlength settings.';
    } else if (value.length > length) {
      return false;
    }
    return true;
  }
};

export default defaultRules;
