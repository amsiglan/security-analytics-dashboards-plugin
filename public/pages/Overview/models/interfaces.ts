/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouteComponentProps } from 'react-router-dom';
import { OverviewViewModel } from './OverviewViewModel';

export interface OverviewProps extends RouteComponentProps {}

export interface OverviewState {
  groupBy: string;
  overviewViewModel: OverviewViewModel;
}

export interface FindingItem {
  id: string;
  time: number;
  findingName: string;
  detector: string;
  logType: string;
}

export interface AlertItem {
  id: string;
  time: string;
  triggerName: string;
  severity: string;
  logType: string;
  acknowledged: boolean;
}

export interface DetectorItem {
  id: string;
  detectorName: string;
  status: string;
  logTypes: string;
}
