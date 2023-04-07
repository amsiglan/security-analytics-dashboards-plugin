/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiInMemoryTable,
  EuiLink,
  EuiSuperDatePicker,
  EuiTab,
  EuiTabs,
  EuiTitle,
  EuiCommentList,
  EuiCommentProps,
  EuiAvatar,
  EuiIcon,
  EuiSpacer,
  EuiComment,
  // EuiSelect
} from '@elastic/eui';
import {
  CorrelationFinding,
  CorrelationGraphData,
  CorrelationsLevel,
  DateTimeFilter,
  DurationRange,
  ICorrelationsStore,
} from '../../../../types';
import {
  BREADCRUMBS,
  DEFAULT_DATE_RANGE,
  MAX_RECENTLY_USED_TIME_RANGES,
  PLUGIN_NAME,
  ROUTES,
} from '../../../utils/constants';
import { ContentPanel } from '../../../components/ContentPanel';
import {
  defaultLogTypeFilterItemOptions,
  graphRenderOptions,
  TabIds,
  tabs,
} from '../utils/constants';
import { DataStore } from '../../../store/DataStore';
import { CoreServicesContext } from '../../../components/core_services';
import { RouteComponentProps } from 'react-router-dom';
import { CorrelationGraph } from '../components/CorrelationGraph';
import { FilterItem, LogTypeFilterGroup } from '../components/LogTypeFilterGroup';

export interface CorrelationsProps extends RouteComponentProps {
  setDateTimeFilter?: Function;
  dateTimeFilter?: DateTimeFilter;
}

export interface CorrelationsState {
  recentlyUsedRanges: DurationRange[];
  tabId: string;
  tabContent: React.ReactNode | null;
  graphData: CorrelationGraphData;
  prevGraphData: CorrelationGraphData[];
  filterdLogTypes: FilterItem[];
  findingsList: CorrelationFinding[];
}

export class Correlations extends React.Component<CorrelationsProps, CorrelationsState> {
  static contextType = CoreServicesContext;
  private dateTimeFilter: DateTimeFilter;
  private correlationsStore: ICorrelationsStore;

  constructor(props: CorrelationsProps) {
    super(props);
    this.correlationsStore = DataStore.correlationsStore;
    this.correlationsStore.resetCorrelationsLevel();
    this.correlationsStore.registerGraphUpdateHandler(this.onNextLevelUpdate);
    this.correlationsStore.registerGraphEventHandler('click', this.onNodeClick);
    const initialFilteredLogTypes = [...defaultLogTypeFilterItemOptions];
    this.state = {
      recentlyUsedRanges: [DEFAULT_DATE_RANGE],
      tabId: tabs[0].id,
      tabContent: null,
      graphData: this.correlationsStore.getCorrelationsGraphData({
        level: CorrelationsLevel.AllFindings,
        logTypeFilterItems: initialFilteredLogTypes,
      }),
      prevGraphData: [],
      filterdLogTypes: initialFilteredLogTypes,
      findingsList: [],
    };
    this.dateTimeFilter = this.props.dateTimeFilter || {
      startTime: DEFAULT_DATE_RANGE.start,
      endTime: DEFAULT_DATE_RANGE.end,
    };
  }

  componentDidMount(): void {
    const id = this.props.location.pathname.replace(`${ROUTES.CORRELATIONS}`, '');
    if (id) {
      this.setState({
        graphData: this.correlationsStore.getCorrelationsGraphData({
          level: CorrelationsLevel.Finding,
          findingId: id,
        }),
      });
    }
    this.context.chrome.setBreadcrumbs([BREADCRUMBS.SECURITY_ANALYTICS, BREADCRUMBS.CORRELATIONS]);
    this.setState({ tabContent: this.createCorrelationsGraph() });
  }

  componentDidUpdate(
    prevProps: Readonly<CorrelationsProps>,
    prevState: Readonly<CorrelationsState>,
    snapshot?: any
  ): void {
    if (
      prevState.graphData !== this.state.graphData ||
      prevState.findingsList !== this.state.findingsList
    ) {
      this.setState({ tabContent: this.createCorrelationsGraph() });
    }

    if (prevState.filterdLogTypes !== this.state.filterdLogTypes) {
      this.setState({
        graphData: this.correlationsStore.getCorrelationsGraphData({
          level: CorrelationsLevel.AllFindings,
          logTypeFilterItems: this.state.filterdLogTypes,
        }),
      });
    }
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

  onNextLevelUpdate = (nextLevelGraphData: CorrelationGraphData) => {
    this.setState({
      prevGraphData: [...this.state.prevGraphData, this.state.graphData],
      graphData: nextLevelGraphData,
    });
  };

  onNodeClick = (params: any) => {
    console.log(params);
    if (params.nodes.length === 1) {
      const allFindings = this.correlationsStore.findings;
      const nodeId = params.nodes[0];
      const correlatedFindings = this.correlationsStore.correlations[nodeId];
      const findings: CorrelationFinding[] = [];
      correlatedFindings.forEach((finding) => {
        findings.push(allFindings[finding]);
      });
      findings.sort((a, b) => a.timestamp - b.timestamp);
      findings.unshift(allFindings[nodeId]);
      this.setState({ findingsList: findings });
    }
  };

  onRefresh = () => {
    this.correlationsStore.resetCorrelationsLevel();
    this.setState({
      graphData: this.correlationsStore.getCorrelationsGraphData({
        level: CorrelationsLevel.AllFindings,
        logTypeFilterItems: this.state.filterdLogTypes,
      }),
      prevGraphData: [],
    });
  };

  getColumns = () => {
    return [
      {
        field: 'name',
        name: 'Name',
        sortable: true,
      },
      {
        field: 'from',
        name: 'Log type 1',
        sortable: true,
      },
      {
        field: 'to',
        name: 'Log type 2',
        sortable: true,
      },
    ];
  };

  getCorrelationRuleItems() {
    return this.correlationsStore.getCorrelationRules().map((rule) => {
      return {
        name: rule.name,
        from: rule.fields[0].logType,
        to: rule.fields[0].logType,
      };
    });
  }

  createCorrelationRuleAction() {
    return (
      <EuiButton
        href={`${PLUGIN_NAME}#${ROUTES.CORRELATIONS_CREATE_RULE}`}
        fill={true}
        data-test-subject={'correlationRuleCreateButton'}
      >
        Create correlation rule
      </EuiButton>
    );
  }

  renderCorrelationRules() {
    return (
      <ContentPanel title={'Correlation rules'} actions={[this.createCorrelationRuleAction()]}>
        <EuiInMemoryTable
          columns={this.getColumns()}
          items={this.getCorrelationRuleItems()}
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

  onFilteredLogTypesChange = (filterdLogTypes: FilterItem[]) => {
    this.setState({ filterdLogTypes });
  };

  createCorrelationsGraph() {
    if (this.state.graphData.graph.nodes.length === 0) {
      return (
        <EuiEmptyPrompt
          title={<h2>No correlations found</h2>}
          body={
            <p>
              Adjust the time range to see more results or{' '}
              <EuiLink href={`#${ROUTES.CORRELATIONS_CREATE_RULE}`}>create a rule</EuiLink> to
              generate correlations between findings.{' '}
            </p>
          }
        />
      );
    }

    const createComment = (finding: CorrelationFinding, type: 'update' | 'regular' = 'regular') => {
      return {
        username: <span style={{ fontSize: 16 }}>{finding.name}</span>,
        event: 'generated on ',
        timestamp: <strong>{`${new Date(finding.timestamp).toLocaleString()}`}</strong>,
        type,
        //timelineIcon: type === 'regular' ? <EuiAvatar name={finding.name} color={this.correlationsStore.colorByLogType[finding.logType]} /> : null,
        children: (
          <>
            <p>
              Log type: {finding.logType}, <em>Rule:</em> <EuiLink>{'Sample rule one'}</EuiLink>
            </p>
            <p>
              Correlation score: <strong>0.8</strong>
            </p>
          </>
        ),
        actions: (
          <EuiLink>
            <EuiIcon type={'expand'} />
          </EuiLink>
        ),
        style: {
          margin: '10px auto',
        },
      };
    };

    const { graph, events } = this.state.graphData;
    const comments: EuiCommentProps[] = this.state.findingsList.slice(1).map((finding) => {
      return createComment(finding, 'update');
    });

    return (
      <>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              style={{ width: 150 }}
              iconType={'sortLeft'}
              disabled={this.state.prevGraphData.length === 0}
              onClick={() => {
                const prevLevelData = this.state.prevGraphData.pop();
                if (prevLevelData) {
                  this.setState({
                    graphData: prevLevelData,
                    prevGraphData: [...this.state.prevGraphData],
                  });
                }
              }}
            >
              Go back
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <LogTypeFilterGroup
              items={this.state.filterdLogTypes}
              setItems={this.onFilteredLogTypesChange}
              colorByLogType={this.correlationsStore.colorByLogType}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup direction="row">
          <EuiFlexItem grow={2} style={{ border: '1px solid' }}>
            <CorrelationGraph graph={graph} options={{ ...graphRenderOptions }} events={events} />
          </EuiFlexItem>
          <EuiFlexItem grow={1} style={{ padding: '10px' }}>
            <div>
              <EuiTitle size="m">
                <h2>Findings</h2>
              </EuiTitle>
              <EuiSpacer size="l" />
              {this.state.findingsList.length ? (
                <>
                  <EuiComment {...createComment(this.state.findingsList[0])} />
                  <EuiSpacer size="xl" />
                </>
              ) : null}
              <div style={{ marginLeft: '40px' }}>
                <EuiCommentList comments={comments} />
              </div>
            </div>
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
    );
  }

  getTabContent(tabId: string) {
    switch (tabId) {
      case TabIds.CORRELATIONS:
        return this.createCorrelationsGraph();
      case TabIds.CORRELATION_RULES:
        return this.renderCorrelationRules();
      default:
        return this.createCorrelationsGraph();
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
