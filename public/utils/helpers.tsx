/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiLink, EuiSpacer, EuiText } from '@elastic/eui';
import moment from 'moment';
import { PeriodSchedule } from '../../models/interfaces';
import React from 'react';
import { DEFAULT_EMPTY_DATA } from './constants';
import {
  RuleItem,
  RuleItemInfo,
} from '../pages/CreateDetector/components/DefineDetector/components/DetectionRules/types/interfaces';

export const parseStringsToOptions = (strings: string[]) => {
  return strings.map((str) => ({ id: str, label: str }));
};

export const renderTime = (time: number) => {
  const momentTime = moment(time);
  if (time && momentTime.isValid()) return momentTime.format('MM/DD/YY h:mm a');
  return DEFAULT_EMPTY_DATA;
};

export function createTextDetailsGroup(data: { label: string; content: string; url?: string }[]) {
  const createFormRow = (label: string, content: string, url?: string) => (
    <EuiFormRow label={label}>
      {url ? (
        <EuiLink>{content || DEFAULT_EMPTY_DATA}</EuiLink>
      ) : (
        <EuiText>{content || DEFAULT_EMPTY_DATA}</EuiText>
      )}
    </EuiFormRow>
  );
  return data.length <= 1 ? (
    !data.length ? null : (
      createFormRow(data[0].label, data[0].content, data[0].url)
    )
  ) : (
    <>
      <EuiFlexGroup style={{ padding: 20 }}>
        {data.map(({ label, content, url }) => {
          return (
            <EuiFlexItem key={label} grow={false} style={{ minWidth: `${100 / data.length}%` }}>
              {createFormRow(label, content, url)}
            </EuiFlexItem>
          );
        })}
      </EuiFlexGroup>
      <EuiSpacer size={'xl'} />
    </>
  );
}

export function parseSchedule({ period: { interval, unit } }: PeriodSchedule) {
  return `Every ${interval} ${unit.toLowerCase()}`;
}

export function ruleItemInfosToItems(
  detectorType: string,
  ruleItemsInfo: RuleItemInfo[]
): RuleItem[] {
  if (ruleItemsInfo) {
    return ruleItemsInfo.map((itemInfo) => ({
      id: itemInfo._id,
      active: itemInfo.enabled,
      description: itemInfo._source.description,
      library: itemInfo.prePackaged ? 'Default' : 'Custom',
      logType: detectorType.toLowerCase(),
      name: itemInfo._source.title,
      severity: itemInfo._source.level,
    }));
  }

  return [];
}

export function getUpdatedEnabledRuleIds(
  existingEnabledIds: Set<string>,
  ruleId: string,
  isActive: boolean
) {
  let newEnabledIds;
  // 1. not enabled previously
  const wasActive = existingEnabledIds.has(ruleId);
  if (wasActive && !isActive) {
    const clonedIds = new Set(existingEnabledIds);
    clonedIds.delete(ruleId);
    newEnabledIds = [...clonedIds];
  }
  // 2. enabled previously and now disabled
  else if (!wasActive && isActive) {
    const clonedIds = new Set(existingEnabledIds);
    clonedIds.add(ruleId);
    newEnabledIds = [...clonedIds];
  }

  return newEnabledIds;
}
