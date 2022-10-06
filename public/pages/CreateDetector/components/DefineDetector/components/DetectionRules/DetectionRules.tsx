/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../../../../../components/ContentPanel';
import { EuiAccordion, EuiHorizontalRule, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import { Rule } from '../../../../../../../models/interfaces';

interface DetectionRulesProps extends RouteComponentProps {
  hasSubmitted: boolean;
  isEdit: boolean;
  detectorRules: Rule[];
}

interface DetectionRulesState {
  fieldTouched: boolean;
}

export default class DetectionRules extends Component<DetectionRulesProps, DetectionRulesState> {
  constructor(props: DetectionRulesProps) {
    super(props);
    const { isEdit } = props;
    this.state = {
      fieldTouched: false,
    };
  }

  render() {
    const { hasSubmitted, isEdit, detectorRules } = this.props;
    return (
      <EuiPanel style={{ paddingLeft: '0px', paddingRight: '0px' }}>
        <EuiAccordion
          buttonContent={
            <EuiTitle>
              <h4>{`Threat detection rules (${detectorRules.length} enabled)`}</h4>
            </EuiTitle>
          }
          buttonProps={{ style: { paddingLeft: '10px', paddingRight: '10px' } }}
          id={'detectorRulesAccordion'}
          initialIsOpen={false}
          // initialIsOpen={!isEdit} // TODO hurneyt
        >
          <EuiHorizontalRule margin={'xs'} />
          <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            <EuiSpacer size={'m'} />
            <ContentPanel></ContentPanel>
          </div>
        </EuiAccordion>
      </EuiPanel>
    );
  }
}
