import { ValidatorServiceImpl } from '../../src/services/validator-service';
import defaultMessages from '../../src/messages/defaultMessages';
import defaultRules from '../../src/rules/defaultRules';

describe('ValidatorServiceImpl', () => {
  describe('validate()', () => {
    test('should returns a valid form with no errors', () => {
      const validator = new ValidatorServiceImpl(
        { firstName: '', lastName: '' },
        'en',
        defaultRules,
        defaultMessages,
        {}
      );

      const resetErrorsMock = jest.spyOn<any, any>(validator, 'resetErrors').mockImplementation();
      const checkRulesMock = jest.spyOn<any, any>(validator, 'checkRules').mockImplementation();
      const isFormValidMock = jest.spyOn<any, any>(validator, 'isFormValid').mockImplementation(() => true);

      const result = validator.validate({ firstName: { required: true } });

      expect(resetErrorsMock).toHaveBeenCalled();
      expect(checkRulesMock).toHaveBeenCalledWith('firstName', { required: true }, '');
      expect(isFormValidMock).toHaveBeenCalled();

      expect(result).toEqual({ isValid: true, errors: [] });
    });

    test('should returns an invalid form with errors', () => {
      const validator = new ValidatorServiceImpl({ email: 'test' }, 'en', defaultRules, defaultMessages, {});
      validator['errors'] = [{ fieldName: 'email', failedRules: ['email'], messages: ['email invalid'] }];

      const resetErrorsMock = jest.spyOn<any, any>(validator, 'resetErrors').mockImplementation();
      const checkRulesMock = jest.spyOn<any, any>(validator, 'checkRules').mockImplementation();
      const isFormValidMock = jest.spyOn<any, any>(validator, 'isFormValid').mockImplementation(() => false);

      const result = validator.validate({ email: { email: true } });

      expect(resetErrorsMock).toHaveBeenCalled();
      expect(checkRulesMock).toHaveBeenCalledWith('email', { email: true }, 'test');
      expect(isFormValidMock).toHaveBeenCalled();

      expect(result).toEqual({
        isValid: false,
        errors: [{ fieldName: 'email', failedRules: ['email'], messages: ['email invalid'] }]
      });
    });
  });
});
