/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { EuiSpacer, EuiTitle } from '@elastic/eui';
import { Detector } from '../../../../../../models/interfaces';
import { IndexOption } from '../../../../Detectors/models/interfaces';
import DetectorDetails from '../components/DetectorDetails';
import DetectorDataSource from '../components/DetectorDataSource';
import DetectorType from '../components/DetectorType';
import DetectionRules from '../components/DetectionRules';

interface DefineDetectorProps extends RouteComponentProps {
  changeDetector: (detector: Detector) => void;
  detector: Detector;
  isEdit: boolean;
}

interface DefineDetectorState {
  hasSubmitted: boolean;
}

export default class DefineDetector extends Component<DefineDetectorProps, DefineDetectorState> {
  constructor(props) {
    super(props);
    this.state = {
      hasSubmitted: false,
    };
  }

  componentDidMount = async () => {
    if (this.props.isEdit) {
      // TODO: Retrieve detector using ID, and set state.detector to the result
    }
  };

  onDetectorNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const detectorName = e.target.value;
    const { changeDetector, detector } = this.props;
    changeDetector({ ...detector, name: detectorName });
  };

  onDetectorTypeChange = (detectorType: string) => {
    const { changeDetector, detector } = this.props;
    changeDetector({ ...detector, detector_type: detectorType });
  };

  onDetectorPeriodScheduleIntervalChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const detectorInterval = e.target.value as number;
    const { changeDetector, detector } = this.props;
    const detectorSchedule = detector.schedule;
    detectorSchedule.period.interval = detectorInterval;
    changeDetector({ ...detector, schedule: detectorSchedule });
  };

  onDetectorPeriodScheduleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const detectorUnit = e.target.value;
    const { changeDetector, detector } = this.props;
    const detectorSchedule = detector.schedule;
    detectorSchedule.period.unit = detectorUnit;
    changeDetector({ ...detector, schedule: detectorSchedule });
  };

  onDetectorInputDescriptionChange = (e: ChangeEvent<HTMLSelectElement>, index = 0) => {
    const detectorDescription = e.target.value;
    const { changeDetector, detector } = this.props;
    const detectorInputs = detector.inputs;
    detectorInputs[index].input.description = detectorDescription;
    changeDetector({ ...detector, inputs: detectorInputs });
  };

  onDetectorInputIndicesChange = (e: ChangeEvent<HTMLSelectElement>, index = 0) => {
    const detectorIndices = (e as IndexOption[]).map((selection) => selection.label);
    const { changeDetector, detector } = this.props;
    const detectorInputs = detector.inputs;
    detectorInputs[index].input.indices = detectorIndices;
    changeDetector({ ...detector, inputs: detectorInputs });
  };

  onSubmit = () => {
    this.setState({ hasSubmitted: true });
  };

  render() {
    const {
      isEdit,
      detector: { name, schedule, detector_type, inputs },
    } = this.props;
    const { hasSubmitted } = this.state;
    return (
      <div>
        <EuiTitle size={'l'}>
          <h3>{`${isEdit ? 'Edit' : 'Define'} detector`}</h3>
        </EuiTitle>

        <EuiSpacer size={'m'} />

        <DetectorDetails
          hasSubmitted={hasSubmitted}
          detectorName={name}
          detectDescription={inputs[0].input.description}
          onDetectorNameChange={this.onDetectorNameChange}
          onDetectorInputDescriptionChange={this.onDetectorInputDescriptionChange}
        />

        <EuiSpacer size={'m'} />

        <DetectorDataSource
          hasSubmitted={hasSubmitted}
          detectorIndices={inputs[0].input.indices}
          onDetectorInputIndicesChange={this.onDetectorInputIndicesChange}
        />

        <EuiSpacer size={'m'} />

        <DetectorType
          hasSubmitted={hasSubmitted}
          detectorType={detector_type}
          onDetectorTypeChange={this.onDetectorTypeChange}
        />

        <EuiSpacer size={'m'} />

        <DetectionRules
          isEdit={isEdit}
          hasSubmitted={hasSubmitted}
          detectorRules={inputs[0].input.rules}
        />
      </div>
    );
  }
}
