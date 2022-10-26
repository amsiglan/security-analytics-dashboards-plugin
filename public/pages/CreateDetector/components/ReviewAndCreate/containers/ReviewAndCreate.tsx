/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiSpacer, EuiTitle } from '@elastic/eui';
import { DetectorDetailsView } from '../../../../Detectors/containers/DetectorDetailsView/DetectorDetailsView';
import { FieldMappingsView } from '../../../../Detectors/components/FieldMappingsView/FieldMappingsView';
import { AlertTriggersView } from '../../../../Detectors/containers/AlertTriggersView/AlertTriggersView';
import { RouteComponentProps } from 'react-router-dom';
import { Detector } from '../../../../../../models/interfaces';
import { DetectorCreationStep } from '../../../models/types';

export interface ReviewAndCreateProps extends RouteComponentProps {
  detector: Detector;
  setDetectorCreationStep: (step: DetectorCreationStep) => void;
}

export class ReviewAndCreate extends React.Component<ReviewAndCreateProps> {
  setDefineDetectorStep = () => {
    this.props.setDetectorCreationStep(DetectorCreationStep.DEFINE_DETECTOR);
  };

  setConfigureFieldMappingStep = () => {
    this.props.setDetectorCreationStep(DetectorCreationStep.CONFIGURE_FIELD_MAPPING);
  };

  setConfigureAlertsStep = () => {
    this.props.setDetectorCreationStep(DetectorCreationStep.CONFIGURE_ALERTS);
  };

  render() {
    return (
      <div>
        <EuiTitle size={'l'}>
          <h3>Review and create</h3>
        </EuiTitle>
        <DetectorDetailsView
          detector={this.props.detector}
          editBasicDetails={this.setDefineDetectorStep}
          editDetectorRules={this.setDefineDetectorStep}
        />
        <EuiSpacer size="l" />
        <FieldMappingsView
          detector={this.props.detector}
          editFieldMappings={this.setConfigureFieldMappingStep}
        />
        <EuiSpacer size="l" />
        <AlertTriggersView
          detector={this.props.detector}
          editAlertTriggers={this.setConfigureAlertsStep}
        />
      </div>
    );
  }
}
