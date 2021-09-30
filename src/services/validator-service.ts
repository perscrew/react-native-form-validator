import { isRuleValueForFunction, isValidatorFn, isValidatorRegExp } from '../models/guards';
import {
  CustomMessages, CustomRules, ErrorLabels,
  Errors,
  FieldsToValidate,
  FormState,
  RuleFunction,
  RuleMessage,
  RuleObject,
  RulesKeys,
  RuleValue,
  ValidationResult,
  ValidatorService
} from '../models/interfaces';

/**
 * Class which contains the form validation logic.
 */
export class ValidatorServiceImpl implements ValidatorService {
  private errors: Errors[];
  private messages: RuleMessage;

  constructor(
    private state: FormState,
    private locale: string,
    private ruleList: CustomRules,
    private messageList: CustomMessages,
    private labels: ErrorLabels
  ) {
    this.errors = [];
    this.messages = this.messageList[this.locale];
  }

  /**
   * Method used to validate a concrete form state with a specific validation.
   * @param fields - fields with custom validation
   * @returns - form validation result object
   */
  validate(fields: FieldsToValidate): ValidationResult {
    this.resetErrors();
    if (!fields) return { isValid: true, errors: this.errors };

    for (const fieldName of Object.keys(this.state)) {
      const rules = fields[fieldName];
      rules && this.checkRules(fieldName, rules, this.state[fieldName]);
    }
    return { isValid: this.isFormValid(), errors: this.errors };
  }

  /**
   * Use tod check rules associated to a form field.
   * @param fieldName - form field name
   * @param rules - rules associated to field
   * @param value - current form value
   */
  private checkRules(fieldName: string, rules: RuleObject, value: string): void {
    // if value is empty and is not required by the rules, no need to check any other rules
    if (!value && !rules.required) {
      return;
    }

    const ruleKeys = Object.keys(rules) as RulesKeys[];
    for (const ruleKey of ruleKeys) {
      const validator = this.ruleList[ruleKey];
      const ruleValue = rules[ruleKey];

      let isValid = true;

      if (ruleValue) {
        if (isValidatorFn(validator) && isRuleValueForFunction(ruleValue)) {
          const validatorFn = validator as RuleFunction;
          isValid = validatorFn(ruleValue, value);
        } else if (isValidatorRegExp(validator)) {
          isValid = validator.test(value);
        }

        !isValid && this.addError(fieldName, ruleKey, ruleValue);
      }
    }
  }

  /**
   * Used to update errors.
   * @param fieldName - form field name
   * @param rule - rules associated to field
   * @param value - current form value
   */
  private addError(fieldName: string, rule: RulesKeys, value: RuleValue): void {
    const name = this.labels[fieldName];

    value = rule == 'minlength' ? +value - 1 : +value;

    const errMsg = this.messages[rule].replace('{0}', name ?? fieldName).replace('{1}', value.toString());

    let [error] = this.errors.filter((err) => err.fieldName === fieldName);

    if (error) {
      const index = this.errors.indexOf(error);
      error.messages.push(errMsg);
      error.failedRules.push(rule);
      this.errors[index] = error;
    } else {
      this.errors.push({
        fieldName,
        failedRules: [rule],
        messages: [errMsg]
      });
    }
  }

  /**
   * Used to reset errors
   */
  private resetErrors(): void {
    this.errors = [];
  }

  /**
   * Check if form is valid
   * @returns - form validity
   */
  private isFormValid(): boolean {
    return !this.errors.length;
  }
}
