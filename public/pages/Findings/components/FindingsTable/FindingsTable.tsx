/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import {
  EuiBasicTableColumn,
  EuiButton,
  EuiEmptyPrompt,
  EuiInMemoryTable,
  EuiLink,
  EuiText,
} from '@elastic/eui';
import dateMath from '@elastic/datemath';
import { renderTime } from '../../../../utils/helpers';
import { DEFAULT_EMPTY_DATA } from '../../../../utils/constants';
import { DetectorsService, OpenSearchService } from '../../../../services';
import FindingDetailsFlyout from '../FindingDetailsFlyout';
import { Finding } from '../../models/interfaces';
import CreateAlertFlyout from '../CreateAlertFlyout';
import { EXAMPLE_CHANNELS } from '../../../CreateDetector/components/ConfigureAlerts/containers/ConfigureAlerts';

interface FindingsTableProps extends RouteComponentProps {
  detectorService: DetectorsService;
  opensearchService: OpenSearchService;
  findings: Finding[];
  loading: boolean;
  rules: object;
  searchQuery: string;
  startTime: string;
  endTime: string;
  onRefresh: () => void;
}

interface FindingsTableState {
  findingsFiltered: boolean;
  filteredFindings: Finding[];
  flyout: object;
  flyoutOpen: boolean;
  selectedFinding?: Finding;
}

export default class FindingsTable extends Component<FindingsTableProps, FindingsTableState> {
  constructor(props: FindingsTableProps) {
    super(props);
    this.state = {
      findingsFiltered: false,
      filteredFindings: [],
      flyout: undefined,
      flyoutOpen: false,
      selectedFinding: undefined,
    };
  }

  componentDidMount = async () => {
    await this.filterFindings();
  };

  componentDidUpdate(prevProps: Readonly<FindingsTableProps>) {
    if (
      prevProps.searchQuery !== this.props.searchQuery ||
      prevProps.startTime !== this.props.startTime ||
      prevProps.endTime !== this.props.endTime ||
      prevProps.findings.length !== this.props.findings.length
    )
      this.filterFindings();
  }

  filterFindings = () => {
    const { findings, searchQuery, startTime, endTime } = this.props;
    const startMoment = dateMath.parse(startTime);
    const endMoment = dateMath.parse(endTime);
    const filteredFindings = findings.filter((finding) => {
      const withinTimeRange = moment(finding.timestamp).isBetween(
        moment(startMoment),
        moment(endMoment)
      );
      if (withinTimeRange) {
        const rule = finding.queries[0];
        const timestamp = renderTime(finding.timestamp);
        const hasMatchingFieldValue =
          timestamp.includes(searchQuery) ||
          finding.id.includes(searchQuery) ||
          rule.name.includes(searchQuery) ||
          finding.detector_name.includes(searchQuery) ||
          rule.category.includes(searchQuery) ||
          rule.severity.includes(searchQuery);
        return hasMatchingFieldValue;
      } else return false;
    });
    this.setState({ findingsFiltered: true, filteredFindings: filteredFindings });
  };

  closeFlyout = (refreshPage: boolean = false) => {
    this.setState({ flyout: undefined, flyoutOpen: false, selectedFinding: undefined });
    if (refreshPage) this.props.onRefresh();
  };

  renderFindingDetailsFlyout = (finding: Finding) => {
    if (this.state.flyoutOpen) this.closeFlyout();
    else
      this.setState({
        flyout: (
          <FindingDetailsFlyout
            {...this.props}
            finding={finding}
            closeFlyout={this.closeFlyout}
            allRules={this.props.rules}
          />
        ),
        flyoutOpen: true,
        selectedFinding: finding,
      });
  };

  renderCreateAlertFlyout = (finding: Finding) => {
    if (this.state.flyoutOpen) this.closeFlyout();
    else {
      const ruleOptions = finding.queries.map((query) => {
        const rule = this.props.rules[query.id];
        return {
          name: rule.title,
          id: query.id,
          severity: rule.level,
          tags: rule.tags.map((tag) => tag.value),
        };
      });
      this.setState({
        flyout: (
          <CreateAlertFlyout
            {...this.props}
            finding={finding}
            closeFlyout={this.closeFlyout}
            notificationChannels={EXAMPLE_CHANNELS}
            allRules={this.props.rules}
            rulesOptions={ruleOptions}
          />
        ),
        flyoutOpen: true,
        selectedFinding: finding,
      });
    }
  };

  render() {
    const { findings, loading, rules } = this.props;
    const { findingsFiltered, filteredFindings, flyout, flyoutOpen, selectedFinding } = this.state;

    const columns: EuiBasicTableColumn<Finding>[] = [
      {
        field: 'timestamp',
        name: 'Time',
        sortable: true,
        dataType: 'date',
        render: renderTime,
      },
      {
        field: 'id',
        name: 'Finding ID',
        sortable: true,
        dataType: 'string',
        render: (id, finding) =>
          <EuiLink onClick={() => this.renderFindingDetailsFlyout(finding)}>{id}</EuiLink> ||
          DEFAULT_EMPTY_DATA,
      },
      {
        field: 'queries',
        name: 'Rule name',
        sortable: true,
        dataType: 'string',
        render: (queries) => rules[queries[0].id].title || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'detector._source.name',
        name: 'Threat detector',
        sortable: true,
        dataType: 'string',
        render: (name) => name || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'queries',
        name: 'Log type',
        sortable: true,
        dataType: 'string',
        render: (queries) => rules[queries[0].id].category || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'queries',
        name: 'Rule severity',
        sortable: true,
        dataType: 'string',
        render: (queries) => rules[queries[0].id].level || DEFAULT_EMPTY_DATA,
      },
      {
        name: 'Actions',
        sortable: false,
        align: 'center',
        actions: [
          {
            render: (finding) => (
              <EuiButton onClick={() => this.renderFindingDetailsFlyout(finding)}>
                View details
              </EuiButton>
            ),
          },
          {
            render: (finding) => (
              <EuiButton onClick={() => this.renderCreateAlertFlyout(finding)}>
                Create alert
              </EuiButton>
            ),
          },
        ],
      },
    ];

    const sorting = {
      sort: {
        field: 'name',
        direction: 'asc',
      },
    };

    return (
      <div>
        <EuiInMemoryTable
          items={findingsFiltered ? filteredFindings : findings}
          columns={columns}
          itemId={(item) => item.id}
          pagination={true}
          sorting={sorting}
          isSelectable={false}
          loading={loading}
          noItemsMessage={
            <EuiEmptyPrompt
              style={{ maxWidth: '45em' }}
              body={
                <EuiText>
                  <p>There are no existing findings.</p>
                </EuiText>
              }
            />
          }
        />
        {flyoutOpen && flyout}
      </div>
    );
  }
}
