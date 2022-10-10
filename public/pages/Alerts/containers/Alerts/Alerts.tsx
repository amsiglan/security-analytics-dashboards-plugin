/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTable, EuiBasicTableColumn, EuiLink } from '@elastic/eui';
import { FlyoutData } from '../../../../components/Flyout/Flyout';
import React, { Component } from 'react';
import { ContentPanel } from '../../../../components/ContentPanel';
import AlertsControl from '../../components/AlertsControl/AlertsControl';
import { AlertSeverity } from '../../utils/constants';

export interface AlertsProps {
  setFlyout: (flyoutData: FlyoutData) => void;
}

export interface AlertItem {
  id: number;
  allAlertsCount: number;
  activeCount: number;
  acknowledgedCount: number;
  errorCount: number;
  detectorName: string;
  severity: AlertSeverity;
}

const getColumns = (
  setFlyout: (flyoutData: FlyoutData) => void
): EuiBasicTableColumn<AlertItem>[] => [
  {
    field: 'allAlertsCount',
    name: 'Alerts',
    sortable: false,
    render: (alertsCount, alertByDetector) => {
      return (
        <EuiLink
          onClick={() => {
            setFlyout({
              title: 'Alerts details',
              type: 'dummy',
            });
          }}
        >
          {`${alertsCount} alerts for ${alertByDetector.detectorName}`}
        </EuiLink>
      );
    },
  },
  {
    field: 'activeCount',
    name: 'Active',
    sortable: false,
  },
  {
    field: 'acknowledgedCount',
    name: 'Acknowledged',
    sortable: false,
  },
  {
    field: 'errorCount',
    name: 'Errors',
    sortable: false,
  },
  {
    field: 'detectorName',
    name: 'Detector Name',
    sortable: false,
  },
  {
    field: 'severity',
    name: 'Severity',
    sortable: false,
  },
];

const alertItems: AlertItem[] = Array(7)
  .fill(undefined)
  .map((_, idx) => {
    return {
      id: idx,
      allAlertsCount: Math.round(Math.random() * 100),
      activeCount: 5,
      acknowledgedCount: 10,
      errorCount: 0,
      detectorName: `Detector-${idx}`,
      severity: AlertSeverity.ONE,
    };
  });

export default class Alerts extends Component<AlertsProps> {
  constructor(props: AlertsProps) {
    super(props);
  }

  render() {
    return (
      <ContentPanel title={'Alerts by detector'}>
        <AlertsControl />
        <EuiBasicTable columns={getColumns(this.props.setFlyout)} items={alertItems} />
      </ContentPanel>
    );
  }
}
