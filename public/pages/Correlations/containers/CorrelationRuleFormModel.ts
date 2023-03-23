/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CorrelationRule } from '../../../../types';

export const correlationRuleStateDefaultValue: CorrelationRule = {
  name: '',
  fields: [
    {
      logType: '',
      conditions: [
        {
          name: '',
          value: '',
          condition: 'AND',
        },
      ],
    },
    {
      logType: '',
      conditions: [
        {
          name: '',
          value: '',
          condition: 'AND',
        },
      ],
    },
  ],
};
