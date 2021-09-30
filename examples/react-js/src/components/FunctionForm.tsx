import React, { Fragment, FunctionComponent, useState } from 'react';
import { defaultMessages, defaultRules, FieldsToValidate, useValidation } from 'react-native-form-validator';

interface FunctionFormProps {
  validation: FieldsToValidate;
}

const FunctionForm: FunctionComponent<FunctionFormProps> = (props) => {
  const [touchedFields, setTouchedFields] = useState({
    civility: false,
    email: false,
    firstName: false,
    lastName: false
  });
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [civility, setCivility] = useState('');

  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: props.validation,
    state: { firstName, lastName, email, civility },
    rules: { ...defaultRules, customCivilityRule: /^(Mrs|Ms|Miss)$/ },
    messages: {
      ...defaultMessages,
      en: { ...defaultMessages['en'], customCivilityRule: 'Civility is incorrect (Mrs/Ms/Miss)' }
    }
  });

  const onBlurHandler = (event: React.FormEvent<HTMLElement>, field: string) =>
    setTouchedFields((prevFields) => ({ ...prevFields, [field]: true }));

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form values : ', civility, email, firstName, lastName);
    setFirstName('');
    setLastName('');
    setEmail('');
    setCivility('');
    setTouchedFields({ firstName: false, lastName: false, email: false, civility: false });
  };

  return (
    <Fragment>
      <h2>Functional Form</h2>
      <form onSubmit={formSubmitHandler}>
        <div className="form-control">
          <label htmlFor="gender">Civility</label>
          <input
            id="civility"
            type="text"
            onChange={(e) => setCivility(e.target.value)}
            onBlur={(e) => onBlurHandler(e, 'civility')}
            value={civility}
            placeholder="Seize a civility (Mrs or Ms or Miss)"
          />
          <p className="error-text">
            {touchedFields.civility && isFieldInError('civility') && getErrorsInField('civility').join('\n')}
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => onBlurHandler(e, 'email')}
            value={email}
            placeholder="Seize an email"
          />
          <p className="error-text">
            {touchedFields.email && isFieldInError('email') && getErrorsInField('email').join('\n')}
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={(e) => onBlurHandler(e, 'firstName')}
            value={firstName}
            placeholder="Seize a first name"
          />
          <p className="error-text">
            {touchedFields.firstName && isFieldInError('firstName') && getErrorsInField('firstName').join('\n')}
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="astName">Last Name</label>
          <input
            id="lastName"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            onBlur={(e) => onBlurHandler(e, 'lastName')}
            value={lastName}
            placeholder="Seize a last name"
          />
          <p className="error-text">
            {touchedFields.lastName && isFieldInError('lastName') && getErrorsInField('lastName').join('\n')}
          </p>
        </div>
        <div className="actions">
          <button disabled={!isFormValid}>Submit</button>
        </div>
      </form>
    </Fragment>
  );
};

export default FunctionForm;
