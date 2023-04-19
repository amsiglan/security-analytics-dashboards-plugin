/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { CorrelationFinding, CorrelationGraphData, DateTimeFilter } from '../../../../types';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  defaultLogTypeFilterItemOptions,
  defaultSeverityFilterItemOptions,
  emptyGraphData,
  getAbbrFromLogType,
  graphRenderOptions,
} from '../utils/constants';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiPanel,
  EuiSuperDatePicker,
  EuiSpacer,
  EuiButtonEmpty,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiFlyoutBody,
  EuiButtonIcon,
  EuiText,
} from '@elastic/eui';
import { CorrelationsExperimentalBanner } from '../components/ExperimentalBanner';
import { FilterItem, FilterGroup } from '../components/FilterGroup';
import { CoreServicesContext } from '../../../components/core_services';
import { DEFAULT_DATE_RANGE, MAX_RECENTLY_USED_TIME_RANGES } from '../../../utils/constants';
import { CorrelationGraph } from '../components/CorrelationGraph';
import { FindingCard } from '../components/FindingCard';
import { DataStore } from '../../../store/DataStore';
import { FindingItemType } from '../../Findings/containers/Findings/Findings';

interface CorrelationsProps
  extends RouteComponentProps<
    any,
    any,
    { finding: FindingItemType; correlatedFindings: CorrelationFinding[] }
  > {
  setDateTimeFilter?: Function;
  dateTimeFilter?: DateTimeFilter;
}

interface SpecificFindingCorrelations {
  finding: CorrelationFinding;
  correlatedFindings: CorrelationFinding[];
}

interface CorrelationsState {
  recentlyUsedRanges: any[];
  graphData: CorrelationGraphData;
  specificFindingInfo?: SpecificFindingCorrelations;
  logTypeFilterOptions: FilterItem[];
  severityFilterOptions: FilterItem[];
}

export class Correlations extends React.Component<CorrelationsProps, CorrelationsState> {
  static contextType = CoreServicesContext;
  private dateTimeFilter: DateTimeFilter;
  constructor(props: CorrelationsProps) {
    super(props);
    this.state = {
      recentlyUsedRanges: [DEFAULT_DATE_RANGE],
      graphData: { ...emptyGraphData },
      logTypeFilterOptions: [...defaultLogTypeFilterItemOptions],
      severityFilterOptions: [...defaultSeverityFilterItemOptions],
      specificFindingInfo: undefined,
    };
    this.dateTimeFilter = this.props.dateTimeFilter || {
      startTime: DEFAULT_DATE_RANGE.start,
      endTime: DEFAULT_DATE_RANGE.end,
    };
  }

  async componentDidMount(): Promise<void> {
    if (this.props.location.state) {
      const state = this.props.location.state;
      const specificFindingInfo: SpecificFindingCorrelations = {
        finding: {
          id: state.finding.id,
          logType: state.finding.detector._source.type,
          timestamp: new Date(state.finding.timestamp).toLocaleString(),
          detectionRule: state.finding.queries[0],
        },
        correlatedFindings: state.correlatedFindings,
      };
      this.setState({ specificFindingInfo });

      // create graph data here
      const graphData: CorrelationGraphData = {
        graph: {
          nodes: [],
          edges: [],
        },
        events: {
          click: (params: any) => {
            console.log(params);
          },
        },
      };

      this.addNode(graphData.graph.nodes, specificFindingInfo.finding);
      specificFindingInfo.correlatedFindings.forEach((finding) => {
        this.addNode(graphData.graph.nodes, finding);
        this.addEdge(graphData.graph.edges, specificFindingInfo.finding, finding);
      });

      this.setState({ graphData });
    } else {
      // get all correlations and display them in the graph
      const allCorrelations = DataStore.correlationsStore.getAllCorrelationsInWindow();
      const createdEdges = new Set<string>();
      const graphData: CorrelationGraphData = {
        graph: {
          nodes: [],
          edges: [],
        },
        events: {
          click: (params: any) => {
            console.log(params);
          },
        },
      };
      allCorrelations.forEach((correlation) => {
        const possibleCombination1 = `${correlation.finding1.id}:${correlation.finding2.id}`;
        const possibleCombination2 = `${correlation.finding2.id}:${correlation.finding1.id}`;

        if (createdEdges.has(possibleCombination1) || createdEdges.has(possibleCombination2)) {
          return;
        }

        this.addNode(graphData.graph.nodes, correlation.finding1);
        this.addNode(graphData.graph.nodes, correlation.finding2);
        this.addEdge(graphData.graph.edges, correlation.finding1, correlation.finding2);

        createdEdges.add(`${correlation.finding1.id}:${correlation.finding2.id}`);
      });

      this.setState({ graphData });
    }

    const specificFindingInfo = await DataStore.correlationsStore.getCorrelatedFindings(
      '2c159094-7759-44ff-9002-07220c45af1f',
      ''
    );
    this.setState({ specificFindingInfo });
  }

  private addNode(nodes: any[], finding: CorrelationFinding) {
    nodes.push({
      id: finding.id,
      label: getAbbrFromLogType(finding.logType),
      title: this.createNodeTooltip(finding),
      color: {
        background: 'white',
        border: 'black',
      },
      size: 35,
    });
  }

  private addEdge(edges: any[], f1: CorrelationFinding, f2: CorrelationFinding) {
    edges.push({
      from: f1.id,
      to: f2.id,
      id: `${f1.id}:${f2.id}`,
    });
  }

  private createNodeTooltip = (finding: CorrelationFinding) => {
    const tooltip = document.createElement('div');

    function createRow(text: string) {
      const row = document.createElement('p');
      row.innerText = text;
      row.style.padding = '5px';
      return row;
    }

    tooltip.appendChild(createRow(`Log type: ${finding.logType}`));
    tooltip.appendChild(createRow(finding.timestamp));

    return tooltip;
  };

  private onTimeChange = ({ start, end }: { start: string; end: string }) => {
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

  private onRefresh = () => {};

  onLogTypeFilterChange = (items: FilterItem[]) => {
    this.setState({ logTypeFilterOptions: items });
  };

  onSeverityFilterChange = (items: FilterItem[]) => {
    this.setState({ severityFilterOptions: items });
  };

  closeFlyout = () => {
    this.setState({ specificFindingInfo: undefined });
  };

  onFindingInspect = async (id: string, logType: string) => {
    // get finding data and set the specificFindingInfo
    const specificFindingInfo = await DataStore.correlationsStore.getCorrelatedFindings(
      id,
      logType
    );
    this.setState({ specificFindingInfo });
  };

  render() {
    const findingCardsData = this.state.specificFindingInfo;

    return (
      <>
        {findingCardsData ? (
          <EuiFlyout
            hideCloseButton
            onClose={this.closeFlyout}
            ownFocus={true}
            type="push"
            maxWidth="300px"
          >
            <EuiFlyoutHeader hasBorder>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiTitle size="m">
                    <h1>Correlation</h1>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonIcon
                    aria-label="close"
                    iconType="cross"
                    display="empty"
                    iconSize="m"
                    onClick={this.closeFlyout}
                    data-test-subj={`close-correlation-details-flyout`}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlyoutHeader>
            <EuiFlyoutBody>
              <EuiTitle size="xs">
                <p>Finding</p>
              </EuiTitle>
              <FindingCard
                id={findingCardsData.finding.id}
                logType={findingCardsData.finding.logType}
                timestamp={findingCardsData.finding.timestamp}
                detectionRule={findingCardsData.finding.detectionRule}
              />
              <EuiSpacer />
              <EuiTitle size="xs">
                <p>Correlated Findings()</p>
              </EuiTitle>
              <EuiText color="subdued" size="xs">
                Higher correlation score indicated stronger correlation.
              </EuiText>
              <EuiSpacer />
              {findingCardsData.correlatedFindings.map((finding, index) => {
                return (
                  <FindingCard
                    key={index}
                    id={finding.id}
                    logType={finding.logType}
                    timestamp={finding.timestamp}
                    detectionRule={finding.detectionRule}
                    correlationData={{
                      score: finding.correlationScore || 0,
                      onInspect: this.onFindingInspect,
                    }}
                  />
                );
              })}
            </EuiFlyoutBody>
          </EuiFlyout>
        ) : null}
        <EuiFlexGroup direction="column">
          <EuiFlexItem>
            <EuiTitle size="m">
              <h1>Correlations</h1>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem>
            <CorrelationsExperimentalBanner />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel>
              <EuiFlexGroup wrap={true} justifyContent="spaceBetween">
                <EuiFlexItem>
                  <EuiFlexGroup wrap={true} gutterSize="xs">
                    <EuiFlexItem grow={false}>
                      <FilterGroup
                        groupName="Severity"
                        items={this.state.severityFilterOptions}
                        setItems={this.onSeverityFilterChange}
                      />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <FilterGroup
                        groupName="Log types"
                        items={this.state.logTypeFilterOptions}
                        setItems={this.onLogTypeFilterChange}
                      />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiButtonEmpty>Reset filters</EuiButtonEmpty>
                    </EuiFlexItem>
                  </EuiFlexGroup>
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
              <EuiSpacer />
              <CorrelationGraph
                graph={this.state.graphData.graph}
                options={{ ...graphRenderOptions }}
                events={this.state.graphData.events}
              />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
    );
  }
}
