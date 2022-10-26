/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CriteriaWithPagination, EuiInMemoryTable } from '@elastic/eui';
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
  return (
    <EuiInMemoryTable
      columns={getRulesColumns(onRuleActivationToggle)}
      items={ruleItems}
      itemId={(item: RuleItem) => `${item.name}`}
      pagination={
        pageIndex !== undefined
          ? {
              pageIndex,
            }
          : true
      }
      onTableChange={onTableChange}
    />
  );
};
