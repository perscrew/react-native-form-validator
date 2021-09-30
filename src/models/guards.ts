import { RuleFunction, RulesValues, RuleValue } from './interfaces';

export function isValidatorFn(rule: RulesValues): rule is RuleFunction {
  return typeof rule === 'function';
}

export function isValidatorRegExp(rule: RulesValues): rule is RegExp {
  return rule instanceof RegExp;
}

export function isRuleValueForFunction(ruleValue: RuleValue): ruleValue is string | number {
  return typeof ruleValue === 'string' || !isNaN(+ruleValue);
}
