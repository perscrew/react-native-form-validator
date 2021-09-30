import { Component } from 'react';
import defaultMessages from './messages/defaultMessages';
import { ClassValidationProps, Errors, FormState, ValidatorService } from './models';
import defaultRules from './rules/defaultRules';
import { ValidatorServiceImpl } from './services/validator-service';
import { ErrorUtils } from './utils/error-utils';

export default class ValidationComponent<P extends ClassValidationProps, S extends FormState> extends Component<P, S> {
  validatorService: ValidatorService;

  errors: Errors[];
  isFormValid: boolean;

  constructor(props: P) {
    super(props);

    this.errors = [];
  }

  validate(newState: Readonly<S>): void {
    this.validatorService = new ValidatorServiceImpl(
      {...this.state, ...newState},
      this.props.deviceLocale ?? 'en', // ex: en, fr
      this.props.rules ?? defaultRules,
      this.props.messages ?? defaultMessages,
      this.props.labels ?? {}
    );
    const result = this.validatorService.validate(this.props.validation);

    this.errors = result.errors;
    this.isFormValid = result.isValid;

    this.setState(newState);
  }

  isFieldInError(fieldName: string): boolean {
    return ErrorUtils.isFieldInError(this.errors, fieldName);
  }

  getFailedRules() {
    return ErrorUtils.getFailedRules(this.errors);
  }

  getFailedRulesInField(fieldName: string): string[] {
    return ErrorUtils.getFailedRulesInField(this.errors, fieldName);
  }

  getErrorMessages(separator = '\n'): string {
    return ErrorUtils.getErrorMessages(this.errors, separator);
  }

  getErrorsForField(fieldName: string): Errors | undefined {
    return ErrorUtils.getErrorsForField(this.errors, fieldName);
  }

  getErrorsInField(fieldName: string): string[] {
    return ErrorUtils.getErrorsInField(this.errors, fieldName);
  }
}
