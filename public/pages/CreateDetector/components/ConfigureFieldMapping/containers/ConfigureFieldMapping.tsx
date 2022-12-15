/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { EuiSpacer, EuiTitle, EuiText } from '@elastic/eui';
import FieldMappingsTable from '../components/RequiredFieldMapping';
import { createDetectorSteps } from '../../../utils/constants';
import { ContentPanel } from '../../../../../components/ContentPanel';
import { Detector, FieldMapping } from '../../../../../../models/interfaces';
import { DetectorCreationStep } from '../../../models/types';
import FieldMappingService from '../../../../../services/FieldMappingService';

export interface FieldMappingState {
  existingMappings: FieldMapping[];
  newMappingData: {
    initialized: boolean;
    unmappedRuleAliasNames: string[];
    logFieldNameOptions: { name: string; taken: boolean }[];
    transientMappings: FieldMapping[];
  };
}

interface ConfigureFieldMappingProps extends RouteComponentProps {
  isEdit: boolean;
  detector: Detector;
  filedMappingService: FieldMappingService;
  mappingData: {
    initialized: boolean;
    unmappedRuleAliasNames: string[];
    logFieldNameOptions: { name: string; taken: boolean }[];
    transientMappings: FieldMapping[];
  };
  loading: boolean;
  updateDataValidState: (step: DetectorCreationStep, isValid: boolean) => void;
  initializeFieldMappingState: (fieldMappingState: FieldMappingState) => void;
  onNewMappingsSelected: (mappings: FieldMapping[]) => void;
}

interface ConfigureFieldMappingState {
  loading: boolean;
  createdMappings: Record<string, string>;
}

export default class ConfigureFieldMapping extends Component<
  ConfigureFieldMappingProps,
  ConfigureFieldMappingState
> {
  constructor(props: ConfigureFieldMappingProps) {
    super(props);
    this.state = {
      loading: props.loading || false,
      createdMappings: {},
    };
  }

  componentDidMount = () => {
    if (!this.props.mappingData.initialized) {
      this.initializeMappingViewData();
      return;
    }

    const createdMappings: Record<string, string> = {};

    if (this.props.mappingData.initialized) {
      this.props.mappingData.transientMappings.forEach((mapping) => {
        createdMappings[mapping.ruleFieldName] = mapping.indexFieldName;
      });
    }

    this.setState({
      createdMappings,
    });
  };

  initializeMappingViewData = async () => {
    this.setState({ loading: true });
    const mappingsView = await this.props.filedMappingService.getMappingsView(
      this.props.detector.inputs[0].detector_input.indices[0],
      this.props.detector.detector_type.toLowerCase()
    );

    if (mappingsView.ok) {
      const existingMappings: FieldMapping[] = [];
      Object.keys(mappingsView.response.properties).forEach((ruleFieldName) => {
        existingMappings.push({
          indexFieldName: mappingsView.response.properties[ruleFieldName].path,
          ruleFieldName,
        });
      });
      this.props.initializeFieldMappingState({
        existingMappings,
        newMappingData: {
          initialized: true,
          logFieldNameOptions:
            mappingsView.response.unmapped_index_fields?.map((field) => ({
              name: field,
              taken: false,
            })) || [],
          unmappedRuleAliasNames: mappingsView.response.unmapped_field_aliases || [],
          transientMappings: [],
        },
      });
    }

    this.setState({ loading: false });
  };

  onMappingUpdate = (newMappings: Record<string, string | undefined>): void => {};

  render() {
    const { isEdit, mappingData } = this.props;
    const { loading, createdMappings } = this.state;
    const existingMappings: Record<string, string | undefined> = {
      ...createdMappings,
    };
    const ruleFields = mappingData.unmappedRuleAliasNames;
    ruleFields.forEach((fieldName) => {
      if (!existingMappings[fieldName]) {
        existingMappings[fieldName] = undefined;
      }
    });

    return (
      <div>
        {!isEdit && (
          <>
            <EuiTitle size={'m'}>
              <h3>{createDetectorSteps[DetectorCreationStep.CONFIGURE_FIELD_MAPPING].title}</h3>
            </EuiTitle>

            <EuiText size="s" color="subdued">
              To perform threat detection, known field names from your log data source are
              automatically mapped to rule field names. Additional fields that may require manual
              mapping will be shown below.
            </EuiText>

            <EuiSpacer size={'m'} />
          </>
        )}

        {ruleFields.length > 0 && (
          <>
            <ContentPanel title={`Required field mappings (${ruleFields.length})`} titleSize={'m'}>
              <FieldMappingsTable
                {...this.props}
                loading={loading}
                indexFieldOptions={mappingData.logFieldNameOptions}
                existingMappings={existingMappings}
                onMappingUpdate={this.onMappingUpdate}
              />
            </ContentPanel>
            <EuiSpacer size={'m'} />
          </>
        )}
      </div>
    );
  }
}
