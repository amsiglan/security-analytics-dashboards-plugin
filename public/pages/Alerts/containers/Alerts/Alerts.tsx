/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiInMemoryTable,
  EuiPanel,
  EuiSelect,
  EuiSelectOption,
  EuiSpacer,
  EuiSuperDatePicker,
  EuiToolTip,
} from '@elastic/eui';
import { FieldValueSelectionFilterConfigType } from '@elastic/eui/src/components/search_bar/filters/field_value_selection_filter';
import dateMath from '@elastic/datemath';
import React, { Component } from 'react';
import { ContentPanel } from '../../../../components/ContentPanel';
import { getAlertsVisualizationSpec } from '../../../Overview/utils/helpers';
import { View, parse } from 'vega/build-es5/vega.js';
import { compile } from 'vega-lite';
import moment from 'moment';
import {
  ALERT_STATE,
  BREADCRUMBS,
  DATE_MATH_FORMAT,
  DEFAULT_EMPTY_DATA,
} from '../../../../utils/constants';
import { CoreServicesContext } from '../../../../components/core_services';
import AlertsService from '../../../../services/AlertsService';
import DetectorService from '../../../../services/DetectorService';
import { AlertItem } from '../../../../../server/models/interfaces';
import { AlertFlyout } from '../../components/AlertFlyout/AlertFlyout';
import { FindingsService, RuleService } from '../../../../services';
import { Detector } from '../../../../../models/interfaces';
import { parseAlertSeverityToOption } from '../../../CreateDetector/components/ConfigureAlerts/utils/helpers';

export interface AlertsProps {
  alertService: AlertsService;
  detectorService: DetectorService;
  findingService: FindingsService;
  ruleService: RuleService;
}

export interface AlertsState {
  groupBy: string;
  startTime: string;
  endTime: string;
  selectedItems: AlertItem[];
  alerts: AlertItem[];
  flyoutData?: { alertItem: AlertItem };
  alertsFiltered: boolean;
  filteredAlerts: AlertItem[];
  detectors: { [key: string]: Detector };
}

const groupByOptions = [
  { text: 'Alert status', value: 'alert_status' },
  { text: 'Alert severity', value: 'alert_severity' },
];

export default class Alerts extends Component<AlertsProps, AlertsState> {
  static contextType = CoreServicesContext;

  constructor(props: AlertsProps) {
    super(props);
    const now = moment.now();
    const startTime = moment(now).subtract(15, 'hours').format(DATE_MATH_FORMAT);
    this.state = {
      groupBy: 'alert_status',
      startTime,
      endTime: moment(now).format(DATE_MATH_FORMAT),
      selectedItems: [],
      alerts: [],
      alertsFiltered: false,
      filteredAlerts: [],
      detectors: {},
    };
  }

  componentDidUpdate(prevProps: Readonly<AlertsProps>, prevState: Readonly<AlertsState>) {
    if (
      prevState.startTime !== this.state.startTime ||
      prevState.endTime !== this.state.endTime ||
      prevState.alerts.length !== this.state.alerts.length
    )
      this.filterAlerts();
  }

  filterAlerts = () => {
    const { alerts, startTime, endTime } = this.state;
    const startMoment = dateMath.parse(startTime);
    const endMoment = dateMath.parse(endTime);
    const filteredAlerts = alerts.filter((alert) =>
      moment(alert.last_notification_time).isBetween(moment(startMoment), moment(endMoment))
    );
    this.setState({ alertsFiltered: true, filteredAlerts: filteredAlerts });
  };

  getColumns(): EuiBasicTableColumn<AlertItem>[] {
    const { detectors } = this.state;
    return [
      {
        field: 'start_time',
        name: 'Start time',
        sortable: true,
      },
      {
        field: 'trigger_name',
        name: 'Alert trigger name',
        sortable: false,
        render: (triggerName: string, alertItem: AlertItem) => (
          <EuiButtonEmpty onClick={() => this.setFlyout(alertItem)}>{triggerName}</EuiButtonEmpty>
        ),
      },
      {
        field: 'detector_id',
        name: 'Detector',
        sortable: true,
        render: (id) => detectors[id].name || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'state',
        name: 'Status',
        sortable: true,
      },
      {
        field: 'severity',
        name: 'Alert severity',
        sortable: true,
        render: (severity) => parseAlertSeverityToOption(severity).label || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'start_time',
        name: 'Start time',
        sortable: true,
      },
      {
        name: 'Actions',
        sortable: false,
        actions: [
          {
            render: (alertItem: AlertItem) => (
              <EuiToolTip content={'Acknowledge'}>
                <EuiButtonIcon
                  aria-label={'Acknowledge'}
                  disabled={!!alertItem.acknowledged_time}
                  iconType={'check'}
                  onClick={() => this.onAcknowledge([alertItem])}
                />
              </EuiToolTip>
            ),
          },
          {
            render: (alertItem: AlertItem) => (
              <EuiToolTip content={'View details'}>
                <EuiButtonIcon
                  aria-label={'View details'}
                  iconType={'expand'}
                  onClick={() => this.setFlyout(alertItem)}
                />
              </EuiToolTip>
            ),
          },
        ],
      },
    ];
  }

  setFlyout(alertItem?: AlertItem): void {
    this.setState({ flyoutData: alertItem ? { alertItem } : undefined });
  }

  generateVisualizationSpec() {
    return getAlertsVisualizationSpec([], '');
  }

  renderVis() {
    let view;
    const spec = this.generateVisualizationSpec();

    try {
      renderVegaSpec(
        compile({ ...spec, width: 'container', height: 400 }).spec
      ).catch((err: Error) => console.error(err));
    } catch (error) {
      console.log(error);
    }

    function renderVegaSpec(spec: {}) {
      view = new View(parse(spec), {
        // view = new View(parse(spec, null, { expr: vegaExpressionInterpreter }), {
        renderer: 'canvas', // renderer (canvas or svg)
        container: '#view', // parent DOM container
        hover: true, // enable hover processing
      });
      return view.runAsync();
    }
  }

  createSelectComponent(
    options: EuiSelectOption[],
    value: string,
    onChange: React.ChangeEventHandler<HTMLSelectElement>
  ) {
    return (
      <EuiFlexGroup
        justifyContent="flexStart"
        alignItems="flexStart"
        direction="column"
        gutterSize="xs"
      >
        <EuiFlexItem grow={false} style={{ margin: '10px 0px' }}>
          <h5>Group by</h5>
        </EuiFlexItem>
        <EuiFlexItem grow={false} style={{ margin: 0 }}>
          <EuiSelect
            id="overview-vis-options"
            options={options}
            value={value}
            onChange={onChange}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  createGroupByControl(): React.ReactNode {
    return this.createSelectComponent(groupByOptions, this.state.groupBy, (event) => {
      this.setState({ groupBy: event.target.value });
    });
  }

  componentDidMount(): void {
    this.context.chrome.setBreadcrumbs([BREADCRUMBS.SECURITY_ANALYTICS, BREADCRUMBS.ALERTS]);
    this.onRefresh();
  }

  async getAlerts() {
    const { alertService, detectorService } = this.props;
    const { detectors } = this.state;

    const detectorsRes = await detectorService.getDetectors();
    if (detectorsRes.ok) {
      const detectorIds = detectorsRes.response.hits.hits.map((hit) => {
        detectors[hit._id] = hit._source;
        return hit._id;
      });
      let alerts: AlertItem[] = [];

      for (let id of detectorIds) {
        const alertsRes = await alertService.getAlerts({ detector_id: id });

        if (alertsRes.ok) {
          alerts = alerts.concat(alertsRes.response.alerts);
        }
      }

      this.setState({ alerts: alerts, detectors: detectors });
      this.filterAlerts();
    }
  }

  createAcknowledgeControl() {
    const { selectedItems } = this.state;
    return (
      <EuiButton disabled={!selectedItems.length} onClick={() => this.onAcknowledge(selectedItems)}>
        Acknowledge
      </EuiButton>
    );
  }

  onTimeChange = ({ start, end }: { start: string; end: string }) => {
    this.setState({ startTime: start, endTime: end });
  };

  onRefresh = async () => {
    this.getAlerts();
    // this.renderVis(); // TODO implement visualization
  };

  onSelectionChange = (selectedItems: AlertItem[]) => {
    this.setState({ selectedItems });
  };

  onFlyoutClose = () => {
    this.setState({ flyoutData: undefined });
  };

  onAcknowledge = async (selectedItems: AlertItem[] = []) => {
    const { alertService } = this.props;

    try {
      // Separating the selected items by detector ID, and adding all selected alert IDs to an array for that detector ID.
      const detectors: { [key: string]: string[] } = {};
      selectedItems.forEach((item) => {
        if (!detectors[item.detector_id]) detectors[item.detector_id] = [item.id];
        else detectors[item.detector_id].push(item.id);
      });

      for (let detectorId of Object.keys(detectors)) {
        const alertIds = detectors[detectorId];
        if (alertIds.length > 0) {
          const response = await alertService.acknowledgeAlerts(alertIds, detectorId);
          if (response.ok) {
            // TODO display toast when all responses return OK
          } else {
            // TODO display toast
            console.error('Failed to acknowledge alerts:', response.error);
          }
        }
      }
    } catch (e) {
      // TODO display toast
      console.error('Failed to acknowledge alerts:', response.error);
    }

    this.setState({ selectedItems: [] });
    this.onRefresh();
  };

  render() {
    const { ruleService } = this.props;
    const { alerts, alertsFiltered, detectors, filteredAlerts, flyoutData } = this.state;

    const severities = new Set();
    const statuses = new Set();
    filteredAlerts.forEach((alert) => {
      if (alert) {
        severities.add(alert.severity);
        statuses.add(alert.state);
      }
    });

    const search = {
      box: {
        incremental: true,
        placeholder: 'Search alerts',
      },
      filters: [
        {
          type: 'field_value_selection',
          field: 'severity',
          name: 'Rule severity',
          options: Array.from(severities).map((severity) => ({ value: severity })),
          multiSelect: 'or',
        } as FieldValueSelectionFilterConfigType,
        {
          type: 'field_value_selection',
          field: 'status',
          name: 'Status',
          options: Array.from(statuses).map((status) => ({ value: status })),
          multiSelect: 'or',
        } as FieldValueSelectionFilterConfigType,
      ],
    };

    const selection = {
      onSelectionChange: this.onSelectionChange,
      selectable: (item) => item.state === ALERT_STATE.ACTIVE,
      selectableMessage: (selectable) =>
        selectable ? undefined : 'Only active alerts can be acknowledged.',
    };

    return (
      <>
        {flyoutData && (
          <AlertFlyout
            alertItem={flyoutData.alertItem}
            detector={detectors[flyoutData.alertItem.detector_id]}
            onClose={this.onFlyoutClose}
            onAcknowledge={this.onAcknowledge}
            findingsService={this.props.findingService}
            ruleService={ruleService}
          />
        )}
        <ContentPanel title={'Security alerts'}>
          <EuiFlexGroup gutterSize={'s'} justifyContent={'flexEnd'}>
            <EuiFlexItem grow={false}>
              <EuiSuperDatePicker onTimeChange={this.onTimeChange} onRefresh={this.onRefresh} />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size={'m'} />
          <EuiSpacer size="xxl" />
          <EuiPanel>
            <EuiFlexGroup direction="column">
              <EuiFlexItem style={{ alignSelf: 'flex-end' }}>
                {this.createGroupByControl()}
              </EuiFlexItem>
              <EuiFlexItem>
                <div id="view"></div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
          <EuiSpacer size="xxl" />
          <ContentPanel title={'Alerts'} actions={[this.createAcknowledgeControl()]}>
            <EuiInMemoryTable
              columns={this.getColumns()}
              items={alertsFiltered ? filteredAlerts : alerts}
              itemId={(item) => `${item.id}`}
              isSelectable={true}
              pagination
              search={search}
              selection={selection}
            />
          </ContentPanel>
        </ContentPanel>
      </>
    );
  }
}
