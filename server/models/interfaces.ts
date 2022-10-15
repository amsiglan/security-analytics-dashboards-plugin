/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Alert, ALERT_STATE, Detector, Finding } from '../../models/interfaces';

export interface DefaultHeaders {
  'Content-Type': 'application/json';
  Accept: 'application/json';
}

export interface SecurityAnalyticsApi {
  readonly DETECTORS_BASE: string;
  readonly FINDINGS_BASE: string;
}

export interface CreateDetectorParams {
  body: Detector;
}

export interface CreateDetectorResponse {
  _id: string;
  _version: number;
  detector: {
    detector: Detector & {
      last_update_time: number;
      monitor_id: string;
      rule_topic_index: string;
    };
  };
}

export interface GetFindingsParams {
  detectorId: string;
}

export interface GetFindingsResponse {
  detector_id: string;
  total_findings: number;
  findings: Finding[];
}

export interface GetChannelsResponse {
  start_index: number;
  total_hits: number;
  total_hit_relation: string;
  channel_list: FeatureChannelList[];
}

export interface FeatureChannelList {
  config_id: string;
  name: string;
  description: string;
  config_type: string;
  is_enabled: boolean;
}

export interface GetNotificationConfigsResponse {
  start_index: number;
  total_hits: number;
  total_hit_relation: string;
  config_list: NotificationConfig[];
}

export interface NotificationConfig {
  config_id: string;
  last_updated_time_ms: number;
  created_time_ms: number;
  config: {
    name: string;
    description: string;
    config_type: string;
    is_enabled: boolean;
  };
}

interface AlertsParamsBase {
  severityLevel?: string;
  alertState?: ALERT_STATE;
  sortString?: string;
  sortOrder?: string;
  missing?: string;
  size?: number;
  startIndex?: number;
  searchString?: string;
}

export type GetAlertsParams = AlertsParamsBase &
  ({ detectorId: string } | { detectorType: string });

export interface GetAlertsReponse {
  alerts: Alert[];
  total_alerts: number;
  detector_type: string;
}
