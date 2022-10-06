/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Detector } from '../../models/interfaces';

export interface DefaultHeaders {
  'Content-Type': 'application/json';
  Accept: 'application/json';
}

export interface SecurityAnalyticsApi {
  [API_ROUTE: string]: string;
}

export interface CreateDetectorParams {
  detector: string;
}

export interface CreateDetectorResponse {
  _id: string;
  _version: number;
  detector: { detector: Detector };
}

export interface DeleteDetectorParams {
  detectorId: string;
}

export interface DeleteDetectorResponse {
  result: string;
}

// TODO: No API implemented yet
export interface GetDetectorParams {
  detectorId: string;
}

// TODO: No API implemented yet
export interface GetDetectorResponse {
  // _id: string;
  // _version: number;
  detector: { detector: Detector };
}

// TODO: No API implemented yet
export interface GetDetectorsParams {}

// TODO: No API implemented yet
export interface GetDetectorsResponse {
  detectors: Detector[];
}

export interface UpdateDetectorParams {
  detectorId: string;
  detector: string;
}

export interface UpdateDetectorResponse {}

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
