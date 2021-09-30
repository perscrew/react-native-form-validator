import defaultMessages from '../messages/defaultMessages';
import defaultRules from '../rules/defaultRules';

export type CustomRules = typeof defaultRules & { [key: string]: RulesValues };
export type CustomMessages = typeof defaultMessages;

export interface ValidationProps {
  fieldsRules: FieldsToValidate;
  state: FormState;
  deviceLocale?: string;
  rules?: CustomRules;
  messages?: CustomMessages;
  labels?: ErrorLabels;
}

export interface ClassValidationProps extends Omit<ValidationProps, 'state' | 'fieldsRules'> {
  validation: FieldsToValidate;
}

export type FormState = { [key: string]: any };
export type ErrorLabels = FormState;

export interface ValidationResult {
  isValid: boolean;
  errors: Errors[];
}

export interface Errors {
  fieldName: string;
  failedRules: string[];
  messages: string[];
}

export interface ValidatorService {
  validate(fields: FieldsToValidate): ValidationResult;
}

export type RulesKeys = keyof typeof defaultRules;
export type RulesValues = typeof defaultRules[RulesKeys];

export type FieldsToValidate = { [field: string]: RuleObject & { [key: string]: RuleValue } };
export type RuleObject = { [key in RulesKeys]?: RuleValue };
export type RuleValue = number | string | boolean;
export type RuleMessage = Record<RulesKeys, string>;

export type RuleFunction = (rule: string | number, value: string) => boolean;
