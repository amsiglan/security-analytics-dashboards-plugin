/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DetectorBasicDetailsView } from '../../components/DetectorBasicDetailsView/DetectorBasicDetailsView';
import { DetectorRulesView } from '../../components/DetectorRulesView/DetectorRulesView';
import { EuiSpacer } from '@elastic/eui';
import { Detector } from '../../../../../models/interfaces';

export interface DetectorDetailsViewProps {
  detector: Detector;
  enabled_time?: number;
  last_update_time?: number;
  rulesCanFold?: boolean;
  editBasicDetails: () => void;
  editDetectorRules: () => void;
}

export interface DetectorDetailsViewState {}

export class DetectorDetailsView extends React.Component<
  DetectorDetailsViewProps,
  DetectorDetailsViewState
> {
  render() {
    const { detector, enabled_time, last_update_time, rulesCanFold } = this.props;
    const rules = (
      <DetectorRulesView
        detector={detector}
        rulesCanFold={rulesCanFold}
        onEditClicked={this.props.editDetectorRules}
      />
    );
    return (
      <>
        <DetectorBasicDetailsView
          detector={detector}
          enabled_time={enabled_time}
          last_update_time={last_update_time}
          rulesCanFold={rulesCanFold}
          onEditClicked={this.props.editBasicDetails}
        >
          {rulesCanFold ? rules : null}
        </DetectorBasicDetailsView>
        <EuiSpacer size="xxl" />

        {!rulesCanFold ? rules : null}
      </>
    );
  }
}
