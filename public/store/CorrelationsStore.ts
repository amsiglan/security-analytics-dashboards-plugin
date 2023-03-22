/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CorrelationGraphData,
  CorrelationGraphUpdateHandler,
  CorrelationLevelInfo,
  CorrelationRule,
  CorrelationsLevel,
  ICorrelationsStore,
} from '../../types';
import { DETECTOR_TYPES } from '../pages/Detectors/utils/constants';

export class CorrelationsStore implements ICorrelationsStore {
  private correlationRules: CorrelationRule[] = [];
  private graphUpdateHandlers: CorrelationGraphUpdateHandler[] = [];
  private correlationLevelInfo: CorrelationLevelInfo = { level: CorrelationsLevel.LogTypes };

  public getCorrelationsGraphData(): CorrelationGraphData {
    switch (this.correlationLevelInfo.level) {
      case CorrelationsLevel.LogTypes:
        return this.getLogTypeCorrelations();
      case CorrelationsLevel.FindingsOfLogType:
        return this.getFindingsByLogTypeLevelCorrelations(this.correlationLevelInfo.logType);
      case CorrelationsLevel.Finding:
        return this.getFindingLevelCorrelations(this.correlationLevelInfo.logType);
      default:
        return this.getEmptyCorrelationsData();
    }
  }

  public resetCorrelationsLevel(): void {
    this.correlationLevelInfo = { level: CorrelationsLevel.LogTypes };
  }

  public registerGraphUpdateHandler(handler: CorrelationGraphUpdateHandler): void {
    this.graphUpdateHandlers.push(handler);
  }

  public createCorrelationRule(correlationRule: CorrelationRule): void {
    // this.correlationRules.push(correlationRule);
    this.correlationRules.push({
      from: {
        logType: 'dns',
        conditions: [],
      },
      to: {
        logType: 's3',
        conditions: [],
      },
    });
  }

  public getCorrelationRules(): CorrelationRule[] {
    return this.correlationRules;
  }

  private getLogTypeCorrelations(): CorrelationGraphData {
    const correlations = {
      [DETECTOR_TYPES.DNS.id]: [DETECTOR_TYPES.WINDOWS.id, DETECTOR_TYPES.S3.id],
      [DETECTOR_TYPES.WINDOWS.id]: [DETECTOR_TYPES.DNS.id, DETECTOR_TYPES.CLOUD_TRAIL.id],
      [DETECTOR_TYPES.S3.id]: [DETECTOR_TYPES.DNS.id],
      [DETECTOR_TYPES.CLOUD_TRAIL.id]: [DETECTOR_TYPES.WINDOWS.id],
    };

    const graphData: CorrelationGraphData = {
      level: CorrelationsLevel.LogTypes,
      graph: {
        nodes: [],
        edges: [],
      },
      events: {
        doubleClick: (params: any) => {
          console.log('double click');
          console.log(params);
          this.correlationLevelInfo = {
            level: CorrelationsLevel.FindingsOfLogType,
            logType: params.nodes[0],
          };
          this.graphUpdateHandlers.forEach((handler) => {
            handler(this.getCorrelationsGraphData());
          });
        },
      },
    };

    Object.entries(correlations).forEach((entry) => {
      graphData.graph.nodes.push({ id: entry[0], label: entry[0] });
      entry[1].forEach((edge) => {
        graphData.graph.edges.push({ from: entry[0], to: edge });
      });
    });

    return graphData;
  }

  private getFindingsByLogTypeLevelCorrelations(_logType: string): CorrelationGraphData {
    const correlations = {
      'dns-1': [
        { logType: DETECTOR_TYPES.WINDOWS.id, id: 'W-1' },
        { logType: DETECTOR_TYPES.S3.id, id: 'S3-1' },
        { logType: DETECTOR_TYPES.S3.id, id: 'S3-2' },
      ],
      'dns-2': [
        { logType: DETECTOR_TYPES.WINDOWS.id, id: 'W-2' },
        { logType: DETECTOR_TYPES.CLOUD_TRAIL.id, id: 'CT-1' },
        { logType: DETECTOR_TYPES.CLOUD_TRAIL.id, id: 'CT-2' },
        { logType: DETECTOR_TYPES.S3.id, id: 'S3-2' },
        { logType: DETECTOR_TYPES.S3.id, id: 'S3-3' },
      ],
      'dns-3': [
        { logType: DETECTOR_TYPES.WINDOWS.id, id: 'W-1' },
        { logType: DETECTOR_TYPES.AD_LDAP.id, id: 'AD-1' },
      ],
    };

    const graphData: CorrelationGraphData = {
      level: CorrelationsLevel.FindingsOfLogType,
      graph: {
        nodes: [],
        edges: [],
      },
      events: {
        doubleClick: (params: any) => {
          console.log('double click');
          console.log(params);
          this.correlationLevelInfo = {
            level: CorrelationsLevel.Finding,
            logType: params.nodes[0],
            correlations: undefined,
          };
          this.graphUpdateHandlers.forEach((handler) => {
            handler(this.getCorrelationsGraphData());
          });
        },
      },
    };

    const nodesSet = new Set<string>();
    Object.entries(correlations).forEach((entry) => {
      if (!nodesSet.has(entry[0])) {
        nodesSet.add(entry[0]);
        graphData.graph.nodes.push({ id: entry[0], label: entry[0] });
      }
      nodesSet.add(entry[0]);
      entry[1].forEach((connectedNode) => {
        if (!nodesSet.has(connectedNode.id)) {
          nodesSet.add(connectedNode.id);
          graphData.graph.nodes.push({ id: connectedNode.id, label: connectedNode.id });
        }
        graphData.graph.edges.push({ from: entry[0], to: connectedNode.id });
      });
    });

    return graphData;
  }

  private getFindingLevelCorrelations(logType: string): CorrelationGraphData {
    const correlations = {
      'dns-1': [
        { logType: DETECTOR_TYPES.WINDOWS.id, id: 'W-1', score: '0.4' },
        { logType: DETECTOR_TYPES.S3.id, id: 'S3-1', score: '0.7' },
        { logType: DETECTOR_TYPES.S3.id, id: 'S3-2', score: '0.9' },
        { logType: DETECTOR_TYPES.CLOUD_TRAIL.id, id: 'CT-1', score: '0.9' },
      ],
    };

    const graphData: CorrelationGraphData = {
      level: CorrelationsLevel.Finding,
      graph: {
        nodes: [],
        edges: [],
      },
      events: {
        doubleClick: (params: any) => {
          console.log('double click');
          console.log(params);
          alert(`Finding pane for ${logType}`);
        },
      },
    };

    const nodesSet = new Set<string>();
    Object.entries(correlations).forEach((entry) => {
      if (!nodesSet.has(entry[0])) {
        nodesSet.add(entry[0]);
        graphData.graph.nodes.push({ id: entry[0], label: entry[0] });
      }
      nodesSet.add(entry[0]);
      entry[1].forEach((connectedNode) => {
        if (!nodesSet.has(connectedNode.id)) {
          nodesSet.add(connectedNode.id);
          graphData.graph.nodes.push({ id: connectedNode.id, label: connectedNode.id });
        }
        graphData.graph.edges.push({
          from: entry[0],
          to: connectedNode.id,
          label: connectedNode.score,
        });
      });
    });

    return graphData;
  }

  private getEmptyCorrelationsData(): CorrelationGraphData {
    return {
      graph: {
        nodes: [],
        edges: [],
      },
      events: {},
      level: CorrelationsLevel.LogTypes,
    };
  }
}
