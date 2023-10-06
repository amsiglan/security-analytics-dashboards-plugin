/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiButtonIcon, EuiLink, EuiToolTip } from '@elastic/eui';
import { LogType } from '../../../../types';
import { capitalize } from 'lodash';
import { Search } from '@opensearch-project/oui/src/eui_components/basic_table';
import { ruleSource } from '../../Rules/utils/constants';
import { logTypeCategories } from '../../../utils/constants';

export const getLogTypesTableColumns = (
  showDetails: (id: string) => void,
  deleteLogType: (logType: LogType) => void
) => [
  {
    field: 'name',
    name: 'Name',
    sortable: true,
    render: (name: string, item: LogType) => {
      return <EuiLink onClick={() => showDetails(item.id)}>{name}</EuiLink>;
    },
  },
  {
    field: 'description',
    name: 'Description',
    truncateText: false,
  },
  {
    field: 'category',
    name: 'Category',
    truncateText: false,
  },
  {
    field: 'source',
    name: 'Source',
    render: (source: string) => capitalize(source),
  },
  {
    name: 'Actions',
    actions: [
      {
        render: (item: LogType) => {
          return (
            <EuiToolTip content="Delete">
              <EuiButtonIcon
                aria-label={'Delete log type'}
                iconType={'trash'}
                color="danger"
                onClick={() => deleteLogType(item)}
              />
            </EuiToolTip>
          );
        },
      },
    ],
  },
];

export const getLogTypesTableSearchConfig = (): Search => {
  return {
    box: {
      placeholder: 'Search log types',
      schema: true,
    },
    filters: [
      {
        type: 'field_value_selection',
        field: 'category',
        name: 'Category',
        multiSelect: 'or',
        options: logTypeCategories.map((category) => ({
          value: category,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'source',
        name: 'Source',
        multiSelect: 'or',
        options: ruleSource.map((source: string) => ({
          value: source,
        })),
      },
    ],
  };
};
