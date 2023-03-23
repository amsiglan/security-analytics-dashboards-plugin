/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Edge, GraphEvents, Node } from 'react-graph-vis';

export enum CorrelationsLevel {
  AllFindings = 'AllFindings',
  Finding = 'Finding',
}

export interface CorrelationGraphData {
  level: CorrelationsLevel;
  graph: {
    nodes: (Node & { chosen?: boolean })[];
    edges: Edge[];
  };
  events: GraphEvents;
}

export type CorrelationGraphUpdateHandler = (newGraphData: CorrelationGraphData) => void;

export interface CorrelationRuleField {
  logType: string;
  conditions: CorrelationFieldCondition[];
}

export interface CorrelationFieldCondition {
  name: string;
  value: any;
  condition: 'AND' | 'OR';
}

export interface CorrelationRule {
  name: string;
  fields: CorrelationRuleField[];
}

export interface ICorrelationsStore {
  getCorrelationsGraphData(levelInfo?: CorrelationLevelInfo): CorrelationGraphData;
  registerGraphUpdateHandler(handler: CorrelationGraphUpdateHandler): void;
  resetCorrelationsLevel(): void;
  createCorrelationRule(correlationRule: CorrelationRule): void;
  getCorrelationRules(): CorrelationRule[];
}

export type CorrelationLevelInfo =
  | {
      level: CorrelationsLevel.AllFindings;
    }
  | {
      level: CorrelationsLevel.Finding;
      findingId: string;
      logType: string;
      correlations: any;
    };
