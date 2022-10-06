/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertCondition } from '../public/pages/CreateDetector/components/ConfigureAlerts/models/interfaces';

export interface Detector {
  type: string;
  detector_type: string;
  name: string;
  enabled: boolean;
  enabled_time?: number;
  createdBy?: string;
  schedule: PeriodSchedule;
  inputs: DetectorInput[];
  alert_conditions: AlertCondition[];
  last_update_time?: number;
  monitor_id?: string;
  rule_topic_index?: string;
}

export interface DetectorInput {
  input: {
    description: string;
    indices: string[];
    rules: Rule[];
  };
}

export interface DetectorTrigger {
  condition: string; // TODO: Triggers will likely be more complex objects
}

export interface Rule {
  id: string;
  name: string;
  rule: string; // TODO: Rules will be in "sigma yaml format"
}

export interface PeriodSchedule {
  period: {
    interval: number;
    unit: string;
  };
}
