/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const methodPrefix: string = 'securityAnalytics';

export const detectorMethodNames = {
  CREATE_DETECTOR: 'createDetector',
  DELETE_DETECTOR: 'deleteDetector',
  GET_DETECTOR: 'getDetector',
  GET_DETECTORS: 'getDetectors',
  UPDATE_DETECTOR: 'updateDetector',
};

export const DETECTORS_METHODS = {
  CREATE_DETECTOR: `${methodPrefix}.${detectorMethodNames.CREATE_DETECTOR}`,
  DELETE_DETECTOR: `${methodPrefix}.${detectorMethodNames.DELETE_DETECTOR}`,
  GET_DETECTOR: `${methodPrefix}.${detectorMethodNames.GET_DETECTOR}`,
  GET_DETECTORS: `${methodPrefix}.${detectorMethodNames.GET_DETECTORS}`,
  UPDATE_DETECTOR: `${methodPrefix}.${detectorMethodNames.UPDATE_DETECTOR}`,
};

export const FINDINGS_METHODS = {
  GET_FINDINGS: 'securityAnalytics.getFindings',
};
