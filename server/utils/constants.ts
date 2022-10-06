/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultHeaders, SecurityAnalyticsApi } from '../models/interfaces';
import { DetectorsService, FindingsService } from '../services';

export const API: SecurityAnalyticsApi = {};

export enum CLUSTER {
  ADMIN = 'admin',
  SA = 'opensearch_security_analytics',
  DATA = 'data',
}

export const DEFAULT_HEADERS: DefaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const BASE_API_PATH = '/api/_security_analytics';

export const NODE_API = Object.freeze({
  DETECTORS: `${BASE_API_PATH}/detectors`,
  FINDINGS: `${BASE_API_PATH}/findings/_search`,
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
