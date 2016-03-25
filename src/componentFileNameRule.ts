import * as Lint from 'tslint/lib/lint';
import {FileNameRule, COMPONENT_TYPE} from './fileNameBase';
import {SelectorValidator} from './util/selectorValidator';

const FAILURE_STRING = 'The component should have a better filename';

export class Rule extends FileNameRule {
  constructor(ruleName: string, value: any, disabledIntervals: Lint.IDisabledInterval[]) {
    super(
        ruleName,
        value,
        disabledIntervals,
        //SelectorValidator.prefix(value[1]),
        //function(){},
        FAILURE_STRING,
        COMPONENT_TYPE.DIRECTIVE);
  }
}
