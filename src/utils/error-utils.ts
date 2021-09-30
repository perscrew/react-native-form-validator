import { Errors } from '../models';

export class ErrorUtils {
  static isFieldInError(errors: Errors[], fieldName: string): boolean {
    return errors.filter((err) => err.fieldName === fieldName).length > 0;
  }

  static getFailedRules(errors: Errors[]) {
    return errors.reduce((acc, error) => (acc[error.fieldName] = error.failedRules), {});
  }

  static getFailedRulesInField(errors: Errors[], fieldName: string): string[] {
    return ErrorUtils.getErrorsForField(errors, fieldName)?.failedRules ?? [];
  }

  static getErrorsForField(errors: Errors[], fieldName: string): Errors | undefined {
    return errors.find((err) => err.fieldName === fieldName);
  }

  static getErrorsInField(errors: Errors[], fieldName: string): string[] {
    return ErrorUtils.getErrorsForField(errors, fieldName)?.messages ?? [];
  }

  static getErrorMessages(errors: Errors[], separator = '\n'): string {
    return errors.map((err) => err.messages.join(separator)).join(separator);
  }
}
