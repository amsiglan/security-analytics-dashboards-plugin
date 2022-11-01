/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertItem, DetectorItem, FindingItem } from '../models/interfaces';

export const dummyFindingItems: FindingItem[] = Array(5)
  .fill(undefined)
  .map((_, idx) => {
    return {
      id: idx.toString(),
      time: Date.now(),
      findingName: `Finding ${idx}`,
      detector: `policy_${idx % 3}`,
    };
  });

export const dummyAlertItems: AlertItem[] = Array(5)
  .fill(undefined)
  .map((_, idx) => {
    return {
      id: `${idx}`,
      severity: 'High',
      time: new Date().toDateString(),
      triggerName: `Dummy_trigger_${idx}`,
    };
  });

export const dummyDetectorItems: DetectorItem[] = Array(5)
  .fill(undefined)
  .map((_, idx) => {
    return {
      id: `${idx}`,
      detectorName: `Detector_${idx}`,
      logTypes: `windows`,
      status: 'ACTIVE',
    };
  });
