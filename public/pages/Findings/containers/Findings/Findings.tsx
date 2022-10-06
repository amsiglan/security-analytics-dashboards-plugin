/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../../../components/ContentPanel';
import { EuiFlexGroup, EuiFlexItem, EuiImage, EuiSpacer } from '@elastic/eui';
import FindingsFilterBar from '../../components/FindingsFilterBar';
import FindingsTable from '../../components/FindingsTable';
import graph from './../../components/FindingsTable/FindingsHistogram.png';

interface FindingsProps extends RouteComponentProps {}

interface FindingsState {
  loading: boolean;
  findings: object[];
  ruleTypes: string[];
  ruleTypeFilters: string[];
  severityFilters: string[];
  sources: string[];
  sourcesFilters: string[];
  searchQuery: string;
}

const EXAMPLE_FINDINGS = [
  {
    id: 'finding-id-1',
    timestamp: 1663871009766,
    rule_name: 'High DNS Bytes Out',
    severity: '1',
    source: 'SIGMA',
    detector: {
      name: 'policy_3_38fj',
      rule_types: ['network', 'dns'],
    },
    logs: [
      {
        timestamp: '09/22/22 11:03 am',
        message: 'High DNS bytes detected.',
      },
      {
        timestamp: '09/22/22 11:13 am',
        message: 'High DNS bytes detected.',
      },
      {
        timestamp: '09/22/22 11:23 am',
        message: 'High DNS bytes detected.',
      },
    ],
  },
  {
    id: 'finding-id-2',
    timestamp: 1663871009766,
    rule_name: 'Cobalt String DNS Beaconing',
    severity: '1',
    source: 'SIGMA',
    detector: {
      name: 'policy_3_38fj',
      rule_types: ['network', 'dns'],
    },
    logs: [
      {
        timestamp: '09/22/22 11:23 am',
        message: 'Change detected.',
      },
    ],
  },
  {
    id: 'finding-id-3',
    timestamp: 1663871009766,
    rule_name: 'Rejetto HTTP File Server RCE',
    severity: '2',
    source: 'custom-logs',
    detector: {
      name: 'policy_2343_38fj',
      rule_types: ['custom'],
    },
    logs: [
      {
        timestamp: '09/22/22 11:23 am',
        message: 'Action type X taken on server.',
      },
      {
        timestamp: '09/22/22 11:23 am',
        message: 'Action type Y taken on server.',
      },
    ],
  },
];

export default class Findings extends Component<FindingsProps, FindingsState> {
  constructor(props: FindingsProps) {
    super(props);
    this.state = {
      loading: false,
      findings: [],
      ruleTypes: [],
      ruleTypeFilters: [],
      severityFilters: [],
      sources: [],
      sourcesFilters: [],
      searchQuery: '',
    };
  }

  componentDidMount = async () => {
    this.getFindings();
  };

  getFindings = async () => {
    this.setState({ loading: true });
    await this.setState({ findings: EXAMPLE_FINDINGS });
    this.getFilters();
    this.setState({ loading: false });
  };

  getFilters = () => {
    const { findings } = this.state;
    const allRuleTypes = new Set<string>();
    const allSources = new Set<string>();
    findings.map((finding) => {
      (finding.detector.rule_types as string[]).forEach((ruleType) => allRuleTypes.add(ruleType));
      allSources.add(finding.source);
    });
    this.setState({
      ruleTypes: Array.from(allRuleTypes),
      sources: Array.from(allSources),
    });
  };

  changeRuleTypeFilters = (selections: string[]) => {
    this.setState({ ruleTypeFilters: selections });
  };

  changeSeverityFilters = (selections: string[]) => {
    this.setState({ severityFilters: selections });
  };

  changeSourceFilters = (selections: string[]) => {
    this.setState({ sourcesFilters: selections });
  };

  render() {
    const {
      findings,
      loading,
      ruleTypes,
      ruleTypeFilters,
      severityFilters,
      sources,
      sourcesFilters,
    } = this.state;
    return (
      <ContentPanel title={'Findings'}>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <FindingsFilterBar
              loading={loading}
              ruleTypes={ruleTypes}
              changeRuleTypeFilters={this.changeRuleTypeFilters}
              changeSeverityFilters={this.changeSeverityFilters}
              sources={sources}
              changeSourceFilters={this.changeSourceFilters}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup direction={'column'}>
              <EuiFlexItem>
                <EuiImage src={graph} alt={'Some alt text'} size={'fullWidth'} />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiSpacer size={'m'} />
              </EuiFlexItem>
              <EuiFlexItem>
                <FindingsTable
                  {...this.props}
                  findings={findings}
                  loading={loading}
                  ruleTypeFilters={ruleTypeFilters}
                  changeRuleTypeFilters={this.changeRuleTypeFilters}
                  changeSeverityFilters={this.changeSeverityFilters}
                  severityFilters={severityFilters}
                  sourcesFilters={sourcesFilters}
                  changeSourceFilters={this.changeSourceFilters}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </ContentPanel>
    );
  }
}
