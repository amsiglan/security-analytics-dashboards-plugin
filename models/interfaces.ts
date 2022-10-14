/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Detector {
  type: string;
  detector_type: string;
  name: string;
  enabled: boolean;
  createdBy: string;
  schedule: PeriodSchedule;
  inputs: DetectorInput[];
  triggers: TriggerCondition[];
}

export interface PeriodSchedule {
  period: {
    interval: number;
    unit: string;
  };
}

export interface DetectorInput {
  input: {
    description: string;
    indices: string[];
    rules: Rule[];
  };
}

export interface Rule {
  id: string;
  name: string;
  rule: string; // TODO: Rules will be in "sigma yaml format"
  type: string;
  active: boolean;
  description?: string;
}

export interface TriggerCondition {
  name: string;
  rule_types: string[];
  severity: string[];
  tags: string[];
  notification_channel_ids: string[];
}

export interface FindingQuery {
  id: string;
  name: string;
  query: string;
  tags: string[];
}

export interface Document {
  index: string;
  id: string;
  found: boolean;
  // Use JSON.parse to get the underlying object
  document: string;
}

export interface Finding {
  detector_id: string;
  id: string;
  related_doc_ids: string[];
  index: string;
  queries: FindingQuery[];
  timestamp: number;
  document_list: Document[];
}

export type ALERT_STATE = 'ACTIVE' | 'ACKNOWLEDGED' | 'COMPLETED' | 'ERROR' | 'DELETED';

export interface AlertHistory {
  timestamp: number;
  message: string;
}

export interface ActionExecutionResult {
  action_id: string;
  last_execution_time: string;
  throttled_count: number;
}

export interface Alert {
  detector_id: string;
  id: string;
  version: number;
  schema_version: number;
  trigger_id: string;
  trigger_name: string;
  finding_ids: string[];
  related_doc_ids: string[];
  state: ALERT_STATE;
  error_message: string | null;
  alert_history: AlertHistory[];
  severity: string;
  action_execution_results: ActionExecutionResult[];
  start_time: string;
  last_notification_time: string;
  end_time: string;
  acknowledged_time: string;
}
