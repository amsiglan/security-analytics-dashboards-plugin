/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiInMemoryTable,
  EuiLink,
  EuiSuperDatePicker,
  EuiTab,
  EuiTabs,
  EuiTitle,
} from '@elastic/eui';
import {
  CorrelationGraphData,
  DateTimeFilter,
  DurationRange,
  ICorrelationsStore,
} from '../../../../types';
import {
  DEFAULT_DATE_RANGE,
  MAX_RECENTLY_USED_TIME_RANGES,
  ROUTES,
} from '../../../utils/constants';
import { ContentPanel } from '../../../components/ContentPanel';
import Graph from 'react-graph-vis';
import { graphRenderOptions, TabIds, tabs } from '../utils/constants';
import { DataStore } from '../../../store/DataStore';

export interface CorrelationsProps {
  setDateTimeFilter?: Function;
  dateTimeFilter?: DateTimeFilter;
}

export interface CorrelationsState {
  recentlyUsedRanges: DurationRange[];
  tabId: string;
  tabContent: React.ReactNode | null;
  graphData: CorrelationGraphData;
}

export class Correlations extends React.Component<CorrelationsProps, CorrelationsState> {
  private dateTimeFilter: DateTimeFilter;
  private correlationsStore: ICorrelationsStore;

  constructor(props: CorrelationsProps) {
    super(props);
    this.correlationsStore = DataStore.correlationsStore;
    this.correlationsStore.resetCorrelationsLevel();
    this.state = {
      recentlyUsedRanges: [DEFAULT_DATE_RANGE],
      tabId: tabs[0].id,
      tabContent: null,
      graphData: this.correlationsStore.getCorrelationsGraphData(),
    };
    this.dateTimeFilter = this.props.dateTimeFilter || {
      startTime: DEFAULT_DATE_RANGE.start,
      endTime: DEFAULT_DATE_RANGE.end,
    };
  }

  componentDidMount(): void {
    this.setState({ tabContent: this.renderCorrelations() });
  }

  onTimeChange = ({ start, end }: { start: string; end: string }) => {
    let { recentlyUsedRanges } = this.state;
    recentlyUsedRanges = recentlyUsedRanges.filter(
      (range) => !(range.start === start && range.end === end)
    );
    recentlyUsedRanges.unshift({ start: start, end: end });
    if (recentlyUsedRanges.length > MAX_RECENTLY_USED_TIME_RANGES)
      recentlyUsedRanges = recentlyUsedRanges.slice(0, MAX_RECENTLY_USED_TIME_RANGES);
    const endTime = start === end ? DEFAULT_DATE_RANGE.end : end;
    this.setState({
      recentlyUsedRanges: recentlyUsedRanges,
    });

    this.props.setDateTimeFilter &&
      this.props.setDateTimeFilter({
        startTime: start,
        endTime: endTime,
      });
  };

  onRefresh = () => {
    this.setState({ graphData: this.correlationsStore.getCorrelationsGraphData() });
  };

  getColumns = () => {
    return [];
  };

  getThreatScenarios() {
    return [];
  }

  renderCorrelationRules() {
    return (
      <ContentPanel title={'Correlation rules'}>
        <EuiInMemoryTable
          columns={this.getColumns()}
          items={this.getThreatScenarios()}
          // itemId={(item) => `${item.id}`}
          isSelectable={true}
          pagination
          // search={search}
          // sorting={sorting}
          // selection={selection}
          // loading={loading}
        />
      </ContentPanel>
    );
  }

  renderCorrelations() {
    if (this.state.graphData.graph.nodes.length === 0) {
      return (
        <EuiEmptyPrompt
          title={<h2>No correlations found</h2>}
          body={
            <p>
              Adjust the time range to see more results or{' '}
              <EuiLink href={`#${ROUTES.CORRELATIONS_CREATE_RULE}`}>create a rule</EuiLink> to
              generate correlations.{' '}
            </p>
          }
        />
      );
    }

    const { graph, events } = this.state.graphData;

    return (
      <Graph
        graph={graph}
        events={events}
        options={graphRenderOptions}
        style={{ border: '1px solid' }}
      />
    );
  }

  getTabContent(tabId: string) {
    switch (tabId) {
      case TabIds.CORRELATIONS:
        return this.renderCorrelations();
      case TabIds.CORRELATION_RULES:
        return this.renderCorrelationRules();
      default:
        return this.renderCorrelations();
    }
  }

  render() {
    this.dateTimeFilter = this.props.dateTimeFilter || this.dateTimeFilter;

    return (
      <EuiFlexGroup direction="column">
        <EuiFlexItem grow={false}>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiTitle size="m">
                <h1>Correlations</h1>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiSuperDatePicker
                start={this.dateTimeFilter.startTime}
                end={this.dateTimeFilter.endTime}
                recentlyUsedRanges={this.state.recentlyUsedRanges}
                onTimeChange={this.onTimeChange}
                onRefresh={this.onRefresh}
                updateButtonProps={{ fill: false }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <EuiTabs>
            {tabs.map((tab) => {
              return (
                <EuiTab
                  key={tab.id}
                  isSelected={tab.id === this.state.tabId}
                  onClick={() => {
                    this.setState({ tabId: tab.id, tabContent: this.getTabContent(tab.id) });
                  }}
                >
                  {tab.name}
                </EuiTab>
              );
            })}
          </EuiTabs>
          {this.state.tabContent}
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
}
