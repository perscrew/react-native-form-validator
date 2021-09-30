import ValidationComponent, { ClassValidationProps, FormState } from 'react-native-form-validator';
import { Fragment } from 'react';

class ClassForm extends ValidationComponent<ClassValidationProps, FormState> {
  constructor(props: ClassValidationProps) {
    super(props);

    this.state = {
      civility: '',
      email: '',
      firstName: '',
      lastName: '',
      touchedFields: { civility: false, firstName: false, lastName: false, email: false }
    };
  }

  onBlurHandler(event: React.FormEvent<HTMLElement>, field: string): void {
    this.setState({ touchedFields: { ...this.state.touchedFields, [field]: true } });
  }

  formSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { civility, email, firstName, lastName } = this.state;

    console.log('Form Values : ', civility, email, firstName, lastName);

    this.setState({
      civility: '',
      email: '',
      firstName: '',
      lastName: '',
      touchedFields: { civility: false, firstName: false, lastName: false, email: false }
    });
  }

  render(): JSX.Element {
    return (
      <Fragment>
        <h2>Class based Form</h2>
        <form onSubmit={this.formSubmitHandler.bind(this)}>
          <div className="form-control">
            <label htmlFor="gender">Civility</label>
            <input
              id="civility"
              type="text"
              onChange={(e) => this.validate({ civility: e.target.value })}
              onBlur={(e) => this.onBlurHandler(e, 'civility')}
              value={this.state.civility}
              placeholder="Seize a civility (Mrs or Ms or Miss)"
            />
            <p className="error-text">
              {this.state.touchedFields.civility &&
                this.isFieldInError('civility') &&
                this.getErrorsInField('civility').join('\n')}
            </p>
          </div>
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              onChange={(e) => this.validate({ email: e.target.value })}
              onBlur={(e) => this.onBlurHandler(e, 'email')}
              value={this.state.email}
              placeholder="Seize an email"
            />
            <p className="error-text">
              {this.state.touchedFields.email &&
                this.isFieldInError('email') &&
                this.getErrorsInField('email').join('\n')}
            </p>
          </div>
          <div className="form-control">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              type="text"
              onChange={(e) => this.validate({ ...this.state, firstName: e.target.value })}
              onBlur={(e) => this.onBlurHandler(e, 'firstName')}
              value={this.state.firstName}
              placeholder="Seize a first name"
            />
            <p className="error-text">
              {this.state.touchedFields.firstName &&
                this.isFieldInError('firstName') &&
                this.getErrorsInField('firstName').join('\n')}
            </p>
          </div>
          <div className="form-control">
            <label htmlFor="astName">Last Name</label>
            <input
              id="lastName"
              type="text"
              onChange={(e) => this.validate({ ...this.state, lastName: e.target.value })}
              onBlur={(e) => this.onBlurHandler(e, 'lastName')}
              value={this.state.lastName}
              placeholder="Seize a last name"
            />
            <p className="error-text">
              {this.state.touchedFields.lastName &&
                this.isFieldInError('lastName') &&
                this.getErrorsInField('lastName').join('\n')}
            </p>
          </div>
          <button disabled={!this.isFormValid}>Submit</button>
        </form>
      </Fragment>
    );
  }
}

export default ClassForm;
