/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CorrelationRule } from '../../../../types';

export interface CorrelationRuleFormModel extends CorrelationRule {}

export const correlationRuleStateDefaultValue: CorrelationRuleFormModel = {
  name: '',
  from: {
    logType: '',
    conditions: [
      {
        name: '',
        value: '',
        condition: 'AND',
      },
    ],
  },
  to: {
    logType: '',
    conditions: [
      {
        name: '',
        value: '',
        condition: 'AND',
      },
    ],
  },
};
