/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultHeaders, SecurityAnalyticsApi } from '../models/interfaces';
import { DetectorsService, FindingsService } from '../services';

export enum CLUSTER {
  ADMIN = 'admin',
  SA = 'opensearch_security_analytics',
  DATA = 'data',
}

export const DEFAULT_HEADERS: DefaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const BASE_API_PATH = '/_plugins/_security_analytics';

export const API: SecurityAnalyticsApi = Object.freeze({
  DETECTORS_BASE: `${BASE_API_PATH}/detectors`,
  FINDINGS_BASE: `${BASE_API_PATH}/findings/_search`,
});

export const REQUEST = Object.freeze({
  PUT: 'PUT',
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  HEAD: 'HEAD',
});

export interface NodeServices {
  detectorsService: DetectorsService;
  findingsService: FindingsService;
}
