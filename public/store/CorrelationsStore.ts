/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CorrelationGraphData, CorrelationsLevel, ICorrelationsStore } from '../../types';
import { DETECTOR_TYPES } from '../pages/Detectors/utils/constants';

export class CorrelationsStore implements ICorrelationsStore {
  public correlationsLevel: CorrelationsLevel = CorrelationsLevel.LogTypes;

  public getCorrelationsGraphData(): CorrelationGraphData {
    if (this.correlationsLevel === CorrelationsLevel.LogTypes) {
      return this.getLogTypeCorrelations();
    }

    return this.getEmptyCorrelationsData();
  }

  public resetCorrelationsLevel(): void {
    this.correlationsLevel = CorrelationsLevel.LogTypes;
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
