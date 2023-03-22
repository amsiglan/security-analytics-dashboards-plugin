/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Edge, GraphEvents, Node } from 'react-graph-vis';

export enum CorrelationsLevel {
  LogTypes = 'LogTypes',
  FindingsOfLogType = 'FindingsOfLogType',
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

export interface CorrelationFieldCondition {
  name: string;
  value: any;
  condition: 'AND' | 'OR';
}

export interface CorrelationRule {
  name: string;
  from: {
    logType: string;
    conditions: CorrelationFieldCondition[];
  };
  to: {
    logType: string;
    conditions: CorrelationFieldCondition[];
  };
}

export interface ICorrelationsStore {
  getCorrelationsGraphData(): CorrelationGraphData;
  registerGraphUpdateHandler(handler: CorrelationGraphUpdateHandler): void;
  resetCorrelationsLevel(): void;
  createCorrelationRule(correlationRule: CorrelationRule): void;
  getCorrelationRules(): CorrelationRule[];
}

export type CorrelationLevelInfo =
  | {
      level: CorrelationsLevel.LogTypes;
    }
  | {
      level: CorrelationsLevel.FindingsOfLogType;
      logType: string;
    }
  | {
      level: CorrelationsLevel.Finding;
      logType: string;
      correlations: any;
    };
