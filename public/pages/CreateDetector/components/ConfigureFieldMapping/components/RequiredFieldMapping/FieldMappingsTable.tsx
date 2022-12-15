/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  EuiBasicTableColumn,
  EuiEmptyPrompt,
  EuiIcon,
  EuiInMemoryTable,
  EuiText,
} from '@elastic/eui';
import { DEFAULT_EMPTY_DATA } from '../../../../../../utils/constants';
import { STATUS_ICON_PROPS } from '../../utils/constants';
import FieldNameSelector from './FieldNameSelector';
import { FieldMappingsTableItem } from '../../../../models/interfaces';

interface FieldMappingsTableProps extends RouteComponentProps {
  loading: boolean;
  indexFieldOptions: { name: string; taken: boolean }[];
  existingMappings: Record<string, string | undefined>;
  onMappingUpdate: (newMappings: Record<string, string | undefined>) => void;
}

interface FieldMappingsTableState {
  mappingsData: Record<string, { logField?: string }>;
}

export default class FieldMappingsTable extends Component<
  FieldMappingsTableProps,
  FieldMappingsTableState
> {
  constructor(props: FieldMappingsTableProps) {
    super(props);
    const existingMappingsData: Record<string, { logField?: string; isInvalid: boolean }> = {};
    Object.entries(props.existingMappings).forEach(([ruleField, logField]) => {
      existingMappingsData[ruleField] = { logField, isInvalid: !logField };
    });
    this.state = {
      mappingsData: existingMappingsData,
    };
  }

  render() {
    const { loading } = this.props;
    const { mappingsData: mappings } = this.state;
    const items: FieldMappingsTableItem[] = Object.keys(mappings).map((ruleField) => ({
      ruleFieldName: ruleField,
      logFieldName: mappings[ruleField].logField,
    }));
    const columns: EuiBasicTableColumn<FieldMappingsTableItem>[] = [
      {
        field: 'ruleFieldName',
        name: 'Rule field name',
        sortable: true,
        dataType: 'string',
        width: '25%',
        render: (ruleFieldName: string) => ruleFieldName || DEFAULT_EMPTY_DATA,
      },
      {
        field: '',
        name: 'Maps to',
        align: 'center',
        width: '15%',
        render: () => <EuiIcon type={'sortRight'} />,
      },
      {
        field: 'logFieldName',
        name: 'Log field name',
        sortable: true,
        dataType: 'string',
        width: '45%',
        render: (_logFieldName: string, entry: FieldMappingsTableItem) => {
          const { onMappingUpdate, indexFieldOptions } = this.props;
          const { mappingsData: mappings } = this.state;
          const onMappingSelected = (selectedField: string) => {
            const newMappingsData = {
              ...mappings,
              [entry.ruleFieldName]: {
                logField: selectedField,
              },
            };
            this.setState({
              mappingsData: newMappingsData,
            });

            const newMappings: Record<string, string | undefined> = {};
            Object.entries(newMappingsData).forEach(([ruleField, logFieldData]) => {
              newMappings[ruleField] = logFieldData.logField;
            });
            onMappingUpdate(newMappings);
          };

          return (
            <FieldNameSelector
              fieldNameOptions={indexFieldOptions
                .filter((option) => !option.taken)
                .map((option) => option.name)}
              selectedField={mappings[entry.ruleFieldName].logField}
              isInvalid={!mappings[entry.ruleFieldName]}
              onChange={onMappingSelected}
            />
          );
        },
      },
      {
        field: 'status',
        name: 'Status',
        sortable: true,
        dataType: 'string',
        align: 'center',
        width: '15%',
        render: (_status: 'mapped' | 'unmapped', entry: FieldMappingsTableItem) => {
          const { mappingsData } = this.state;
          const iconProps = !mappingsData[entry.ruleFieldName]
            ? STATUS_ICON_PROPS['unmapped']
            : STATUS_ICON_PROPS['mapped'];

          return <EuiIcon {...iconProps} /> || DEFAULT_EMPTY_DATA;
        },
      },
    ];

    const sorting: { sort: { field: string; direction: 'asc' | 'desc' } } = {
      sort: {
        field: 'ruleFieldName',
        direction: 'asc',
      },
    };

    return (
      <EuiInMemoryTable
        loading={loading}
        items={items}
        columns={columns}
        pagination={true}
        sorting={sorting}
        isSelectable={false}
        message={
          <EuiEmptyPrompt
            style={{ maxWidth: '45em' }}
            body={
              <EuiText>
                <p>There are no field mappings.</p>
              </EuiText>
            }
          />
        }
      />
    );
  }
}
