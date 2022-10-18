/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { EuiSpacer, EuiTitle } from '@elastic/eui';
import { Detector, Rule } from '../../../../../../models/interfaces';
import DetectorBasicDetailsForm from '../components/DetectorDetails';
import DetectorDataSource from '../components/DetectorDataSource';
import DetectorType from '../components/DetectorType';
import DetectionRules from '../components/DetectionRules';
import { EuiComboBoxOptionOption } from '@opensearch-project/oui';

import { ServicesConsumer } from '../../../../../services';
import { BrowserServices } from '../../../../../models/interfaces';
import { MIN_NUM_DATA_SOURCES } from '../../../../Detectors/utils/constants';

interface DefineDetectorProps extends RouteComponentProps {
  detector: Detector;
  isEdit: boolean;
  changeDetector: (detector: Detector) => void;
}

interface DefineDetectorState {}

export default class DefineDetector extends Component<DefineDetectorProps, DefineDetectorState> {
  componentDidMount = async () => {
    if (this.props.isEdit) {
      // TODO: Retrieve detector using ID, and set state.detector to the result
    }
  };

  onDetectorNameChange = (detectorName: string) => {
    const newDetector: Detector = {
      ...this.props.detector,
      name: detectorName,
    };

    this.props.changeDetector(newDetector);
  };

  onDetectorInputDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>, index = 0) => {
    const { inputs } = this.props.detector;
    const newDetector: Detector = {
      ...this.props.detector,
      inputs: [
        {
          input: {
            ...inputs[0].input,
            description: event.target.value,
          },
        },
        ...inputs.slice(1),
      ],
    };

    this.props.changeDetector(newDetector);
  };

  onDetectorInputIndicesChange = (selectedOptions: EuiComboBoxOptionOption<string>[]) => {
    const detectorIndices = selectedOptions.map((selectedOption) => selectedOption.label);

    const { inputs } = this.props.detector;
    const newDetector: Detector = {
      ...this.props.detector,
      inputs: [
        {
          input: {
            ...inputs[0].input,
            indices: detectorIndices,
          },
        },
        ...inputs.slice(1),
      ],
    };

    this.props.changeDetector(newDetector);
  };

  onDetectorTypeChange = (detectorType: string) => {
    const newDetector: Detector = {
      ...this.props.detector,
      detector_type: detectorType,
    };

    this.props.changeDetector(newDetector);
  };

  onRulesChanged = (rules: Rule[]) => {};

  render() {
    const { isEdit } = this.props;
    const { name, inputs, detector_type } = this.props.detector;
    const { description, indices, enabledCustomRuleIds } = inputs[0].input;

    return (
      <ServicesConsumer>
        {(services: BrowserServices | null) =>
          services && (
            <div>
              <EuiTitle size={'l'}>
                <h3>{`${isEdit ? 'Edit' : 'Define'} detector`}</h3>
              </EuiTitle>

              <EuiSpacer size={'m'} />

              <DetectorBasicDetailsForm
                detectorName={name}
                detectorDescription={description}
                onDetectorNameChange={this.onDetectorNameChange}
                onDetectorInputDescriptionChange={this.onDetectorInputDescriptionChange}
              />

              <EuiSpacer size={'m'} />

              <DetectorDataSource
                detectorIndices={indices}
                indexService={services.indexService}
                onDetectorInputIndicesChange={this.onDetectorInputIndicesChange}
                {...this.props}
              />

              <EuiSpacer size={'m'} />

              <DetectorType
                detectorType={detector_type}
                onDetectorTypeChange={this.onDetectorTypeChange}
              />

              <EuiSpacer size={'m'} />

              <DetectionRules
                {...this.props}
                enabledCustomRuleIds={enabledCustomRuleIds}
                detectorType={detector_type}
                onRulesChanged={this.onRulesChanged}
              />
            </div>
          )
        }
      </ServicesConsumer>
    );
  }

  static validateData(detector: Detector): boolean {
    return (
      !!detector.name &&
      !!detector.detector_type &&
      detector.inputs[0].input.indices.length >= MIN_NUM_DATA_SOURCES
    );
  }
}
