/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CriteriaWithPagination, EuiInMemoryTable } from '@elastic/eui';
import { ruleSeverity, ruleSource, ruleTypes } from '../../../../../../pages/Rules/lib/helpers';
import React from 'react';
import { RuleItem } from './types/interfaces';
import { getRulesColumns } from './utils/constants';

export interface DetectionRulesTableProps {
  ruleItems: RuleItem[];
  pageIndex?: number;
  onRuleActivationToggle: (changedItem: RuleItem, isActive: boolean) => void;
  onTableChange?: (nextValues: CriteriaWithPagination<RuleItem>) => void;
}

export const DetectionRulesTable: React.FC<DetectionRulesTableProps> = ({
  pageIndex,
  ruleItems,
  onRuleActivationToggle,
  onTableChange,
}) => {
  //Filter table by rule type
  const search = {
    box: {
      schema: true,
    },
    filters: [
      {
        type: 'field_value_selection',
        field: 'logType',
        name: 'Log Type',
        multiSelect: true,
        options: ruleTypes.map((type: string) => ({
          value: type,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'severity',
        name: 'Rule Severity',
        multiSelect: false,
        options: ruleSeverity.map((level: string) => ({
          value: level,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'library',
        name: 'Library',
        multiSelect: false,
        options: ruleSource.map((source: string) => ({
          value: source,
        })),
      },
    ],
  };
  return (
    <div style={{ padding: 10 }}>
      <EuiInMemoryTable
        columns={getRulesColumns(onRuleActivationToggle)}
        items={ruleItems}
        itemId={(item: RuleItem) => `${item.name}`}
        search={search}
        pagination={
          pageIndex !== undefined
            ? {
                pageIndex,
              }
            : true
        }
        onTableChange={onTableChange}
      />
    </div>
  );
};
