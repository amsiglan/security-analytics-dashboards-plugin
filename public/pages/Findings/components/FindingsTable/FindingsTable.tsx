/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  EuiButton,
  EuiCodeBlock,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiFormRow,
  EuiInMemoryTable,
  EuiLink,
  EuiOverlayMask,
  EuiPopover,
  EuiSpacer,
  EuiTableFieldDataColumnType,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { renderTime } from '../../../../utils/helpers';
import { DEFAULT_EMPTY_DATA, ROUTES } from '../../../../utils/constants';
import { filter } from 'cypress/types/minimatch';

interface FindingsTableProps extends RouteComponentProps {
  findings: object[];
  loading: boolean;
  ruleTypeFilters: string[];
  changeRuleTypeFilters: (selections: string[]) => void;
  changeSeverityFilters: (selections: string[]) => void;
  severityFilters: string[];
  sourcesFilters: string[];
  changeSourceFilters: (selections: string[]) => void;
}

interface FindingsTableState {
  filteredFindings: object[];
  flyoutOpen: boolean;
  searchQuery: string;
  selectingFinding: object;
}

export default class FindingsTable extends Component<FindingsTableProps, FindingsTableState> {
  constructor(props: FindingsTableProps) {
    super(props);
    this.state = {
      filteredFindings: [],
      flyoutOpen: false,
      searchQuery: '',
      selectingFinding: undefined,
    };
  }

  componentDidMount = async () => {
    await this.filterFindings();
  };

  // componentDidUpdate(
  //   prevProps: Readonly<FindingsTableProps>,
  //   prevState: Readonly<FindingsTableState>,
  //   snapshot?: any
  // ) {
  //   const {
  //     prevRuleTypeFilters,
  //     prevSeverityFilters,
  //     prevSourcesFilters,
  //   } = prevProps;
  //   const {
  //     loading,
  //     ruleTypeFilters,
  //     severityFilters,
  //     sourcesFilters,
  //   } = this.props;
  //   if (!loading) {
  //     if (
  //       prevRuleTypeFilters !== ruleTypeFilters ||
  //       prevSeverityFilters !== severityFilters ||
  //       prevSourcesFilters !== sourcesFilters
  //     ) {
  //       this.setState({searchQuery: ""});
  //       this.filterFindings();
  //     }
  //   }
  // }

  changeSearchQuery = ({ queryText, error }) => {
    this.setState({ searchQuery: queryText });
  };

  filterFindings = () => {
    const { findings, ruleTypeFilters, severityFilters, sourcesFilters } = this.props;
    const filteredFindings = findings.filter((finding) => {
      const findingRuleTypes = finding.detector.rule_types || [];
      let hasMatchingFilter = false;
      for (let filter in ruleTypeFilters) {
        if (findingRuleTypes.includes(filter)) {
          hasMatchingFilter = true;
          break;
        }
      }
      const hasMatchingSeverity = severityFilters.includes(finding.severity);
      const hasMatchingSource = sourcesFilters.includes(finding.source);
      return hasMatchingFilter && hasMatchingSeverity && hasMatchingSource;
    });
    this.setState({ filteredFindings: filteredFindings });
  };

  renderFlyout = (finding: object) => {
    return (
      <EuiFlyout
        onClose={() => this.setState({ flyoutOpen: false })}
        ownFocus={true}
        size={'s'}
        type={'push'}
      >
        <EuiFlyoutHeader hasBorder={true}>
          <EuiTitle size={'m'}>
            <h3>Finding details</h3>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFormRow label={'Time'}>
            <EuiText>{renderTime(finding.timestamp)}</EuiText>
          </EuiFormRow>

          <EuiFormRow label={'Severity'}>
            <EuiText>{finding.severity}</EuiText>
          </EuiFormRow>

          <EuiFormRow label={'Rule name'}>
            <EuiText>{finding.rule_name}</EuiText>
          </EuiFormRow>

          <EuiFormRow label={'Threat detector'}>
            <EuiText>{finding.detector.name}</EuiText>
          </EuiFormRow>

          <EuiFormRow label={'Rule types'}>
            <EuiText>{(finding.detector.rule_types as string[]).join(', ')}</EuiText>
          </EuiFormRow>

          <EuiFormRow label={'Logs'}>
            <EuiCodeBlock language={'json'} inline={false} isCopyable={true}>
              {JSON.stringify(finding.logs, null, 4)}
            </EuiCodeBlock>
          </EuiFormRow>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  };

  render() {
    const { findings, loading, ruleTypeFilters, severityFilters, sourcesFilters } = this.props;
    const { flyoutOpen, selectingFinding } = this.state;

    const columns = [
      {
        field: 'timestamp',
        name: 'Time',
        sortable: true,
        dataType: 'date',
        render: renderTime,
      },
      {
        field: 'rule_name',
        name: 'Rule name',
        sortable: true,
        dataType: 'string',
        render: (name) => name || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'detector.name',
        name: 'Threat detector',
        sortable: true,
        dataType: 'string',
        render: (name) => name || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'detector.rule_types',
        name: 'Rule type',
        sortable: true,
        dataType: 'string',
        render: (types) => (types as string[]).join('/') || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'severity',
        name: 'Severity',
        sortable: true,
        dataType: 'string',
        render: (severity) => severity || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'rule_name',
        name: 'Actions',
        sortable: false,
        render: (rule_name, finding) => {
          // severity || DEFAULT_EMPTY_DATA
          return (
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiButton
                  onClick={() => {
                    if (this.state.flyoutOpen)
                      this.setState({ flyoutOpen: false, selectingFinding: undefined });
                    else this.setState({ flyoutOpen: true, selectingFinding: finding });
                  }}
                >
                  View details
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiButton
                  onClick={() => {
                    if (this.state.flyoutOpen)
                      this.setState({ flyoutOpen: false, selectingFinding: undefined });
                    this.props.history.push(ROUTES.DETECTORS_CREATE);
                  }}
                >
                  Create alert
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          );
        },
      },
    ];

    const search = {
      box: { placeholder: 'Search findings' },
    };

    const sorting = {
      sort: {
        field: 'name',
        direction: 'asc',
      },
    };
    return (
      <div>
        <EuiInMemoryTable
          items={findings}
          columns={columns}
          itemId={(item) => item.id}
          pagination={true}
          sorting={sorting}
          isSelectable={false}
          search={search}
          loading={loading}
          noItemsMessage={
            <EuiEmptyPrompt
              style={{ maxWidth: '45em' }}
              body={
                <EuiText>
                  <p>There are no existing findings.</p>
                </EuiText>
              }
              // actions={[actions[3]]}
            />
          }
        />
        {flyoutOpen && this.renderFlyout(selectingFinding)}
      </div>
    );
  }
}
