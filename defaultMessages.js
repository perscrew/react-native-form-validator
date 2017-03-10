'use strict';

const defaultMessages = {
    // English language - Used by default
    en: {
      numbers: 'The field "{0}" must be a valid number.',
      email: 'The field "{0}" must be a valid email address.',
      required: 'The field "{0}" is mandatory.',
      date: 'The field "{0}" must be a valid date ({1}).',
      minlength: 'The field "{0}" length must be greater than {1}.',
      maxlength: 'The field "{0}" length must be lower than {1}.'
    },
    // French language
    fr: {
      numbers: 'Le champ "{0}" doit être un nombre valide.',
      email: 'Le champ "{0}" doit être une adresse email valide.',
      required: 'Le champ "{0}" est obligatoire.',
      date: 'Le champ "{0}" doit correspondre à une date valide ({1}).',
      minlength: 'Le nombre de caractère du champ "{0}" doit être supérieur à {1}.',
      maxlength: 'Le nombre de caractère du champ "{0}" doit être inférieur à {1}.'
    }
    // TODO Add other languages here...
};

export default defaultMessages;
