/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AlertCondition {
  name: string;
  rule_types: string[];
  severity: string[];
  tags: string[];
  notification_channel_ids: string[];
}
