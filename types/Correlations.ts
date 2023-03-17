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
    nodes: Node[];
    edges: Edge[];
  };
  events: GraphEvents;
}

export interface ICorrelationsStore {
  correlationsLevel: CorrelationsLevel;
  getCorrelationsGraphData(): CorrelationGraphData;
  resetCorrelationsLevel(): void;
}
