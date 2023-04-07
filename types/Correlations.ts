/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Edge, GraphEvents, Node } from 'react-graph-vis';
import { FilterItem } from '../public/pages/Correlations/components/LogTypeFilterGroup';

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
export type CorrelationGraphEventHandler = (eventParams: any) => void;
export type CorrelationFinding = {
  logType: string;
  timestamp: number;
  name: string;
  id: string;
  rule: { name: string; severity: 'Critical' | 'Medium' | 'Info' | 'Low' };
};

export interface CorrelationRuleQuery {
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
  fields: CorrelationRuleQuery[];
}

export interface ICorrelationsStore {
  findings: { [id: string]: CorrelationFinding };
  correlations: { [finding: string]: string[] };
  colorByLogType: { [logType: string]: string };
  getCorrelationsGraphData(levelInfo?: CorrelationLevelInfo): CorrelationGraphData;
  registerGraphUpdateHandler(handler: CorrelationGraphUpdateHandler): void;
  registerGraphEventHandler(event: string, handler: CorrelationGraphEventHandler): void;
  resetCorrelationsLevel(): void;
  createCorrelationRule(correlationRule: CorrelationRule): void;
  getCorrelationRules(): CorrelationRule[];
}

export type CorrelationLevelInfo =
  | {
      level: CorrelationsLevel.AllFindings;
      logTypeFilterItems?: FilterItem[];
    }
  | {
      level: CorrelationsLevel.Finding;
      findingId: string;
    };
