import defaultMessages from './messages/defaultMessages';
import { Errors, ValidationProps, ValidatorService } from './models/interfaces';
import defaultRules from './rules/defaultRules';
import { ValidatorServiceImpl } from './services/validator-service';
import { ErrorUtils } from './utils/error-utils';

const useValidation = function (props: ValidationProps) {
  let isFormValid = false;
  let errors: Errors[] = [];

  const { state = {} } = props;

  const fieldRules = props.fieldsRules;
  const deviceLocale = props.deviceLocale ?? 'en';
  const baseRules = props.rules ?? defaultRules;
  const messages = props.messages ?? defaultMessages;
  const labels = props.labels ?? {};

  const validatorService: ValidatorService = new ValidatorServiceImpl(state, deviceLocale, baseRules, messages, labels);

  // function component is re-rendered if props or any use state vars is updated, so we trigger validation on each updates
  const result =  validatorService.validate(fieldRules);

  errors = result.errors;
  isFormValid = result.isValid;

  const isFieldInError = (fieldName: string): boolean => ErrorUtils.isFieldInError(errors, fieldName);

  const getFailedRules = () => ErrorUtils.getFailedRules(errors);

  const getErrorsForField = (fieldName: string): Errors | undefined => ErrorUtils.getErrorsForField(errors, fieldName);

  const getErrorsInField = (fieldName: string): string[] => ErrorUtils.getErrorsInField(errors, fieldName);

  const getErrorMessages = (separator = '\n'): string => ErrorUtils.getErrorMessages(errors, separator);

  const getFailedRulesInField = (fieldName: string): string[] => ErrorUtils.getFailedRulesInField(errors, fieldName);

  return {
    isFormValid,
    isFieldInError,
    getFailedRules,
    getFailedRulesInField,
    getErrorMessages,
    getErrorsForField,
    getErrorsInField
  };
};

export default useValidation;
