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
import { euiPaletteColorBlind } from '@elastic/eui';

class ColorProvider {
  private palette = euiPaletteColorBlind({ rotations: 3, order: 'group', direction: 'both' });
  private currentPos: number = 0;
  private colorByLogType: { [logType: string]: string } = {};

  constructor() {
    Object.values(DETECTOR_TYPES).forEach((type) => {
      this.colorByLogType[type.id] = this.next();
    });
  }

  public getColor(logType: string) {
    return this.colorByLogType[logType] || this.next();
  }

  private next() {
    this.currentPos = (this.currentPos + 1) % this.palette.length;
    return this.palette[this.currentPos];
  }
}

class DummyCorrelationDataProvider {
  private generatedPairs: Set<string> = new Set();

  public generateDummyFindings() {
    // const eachLogtypeCount = {};
    const findings: { [id: string]: { logType: string } } = {};
    Object.values(DETECTOR_TYPES).forEach((type) => {
      const findingCount = Math.ceil(15 * Math.random());
      for (let i = 1; i <= findingCount; i++) {
        const id = `${type.id.charAt(0)}${type.id.charAt(type.id.length - 1)}-${i}`;
        findings[id] = { logType: type.id };
      }
    });

    return findings;
  }

  public generateDummyCorrelations(findings: { [id: string]: { logType: string } }) {
    this.generatedPairs = new Set();
    const findingIds = Object.keys(findings);
    const totalFindings = findingIds.length;
    const correlations: { [finding: string]: string[] } = {};
    let correlationCount = 0;

    while (correlationCount < 150) {
      while (true) {
        const pair = this.getNextPair(totalFindings);

        const f1 = findingIds[pair[0]];
        const f2 = findingIds[pair[1]];

        if (findings[f1].logType === findings[f2].logType) {
          continue;
        }

        if (!correlations[f1]) {
          correlations[f1] = [];
        }

        correlations[f1].push(f2);

        if (!correlations[f2]) {
          correlations[f2] = [];
        }

        correlations[f2].push(f1);

        break;
      }

      correlationCount++;
    }

    return correlations;
  }

  private getNextPair(max: number) {
    let next = this.generatePair(max);
    while (this.generatedPairs.has(next)) {
      next = this.generatePair(max);
    }
    this.generatedPairs.add(next);

    const pairIdx = next.split('-');

    return [Number.parseInt(pairIdx[0]), Number.parseInt(pairIdx[1])];
  }

  private generatePair(max: number) {
    const idx1 = Math.floor(Math.random() * max);
    const idx2 = Math.floor(Math.random() * max);

    const small = idx1 < idx2 ? idx1 : idx2;
    const big = idx1 > idx2 ? idx1 : idx2;
    const pair = `${small}-${big}`;

    return pair;
  }
}

export class CorrelationsStore implements ICorrelationsStore {
  private correlationRules: CorrelationRule[] = [
    {
      name: 'Between S3 and DNS',
      fields: [
        {
          logType: 'dns',
          conditions: [],
        },
        {
          logType: 's3',
          conditions: [],
        },
      ],
    },
  ];
  private graphUpdateHandlers: CorrelationGraphUpdateHandler[] = [];
  private correlationLevelInfo: CorrelationLevelInfo = { level: CorrelationsLevel.AllFindings };
  private colorProvider = new ColorProvider();
  private findings;
  private correlations: { [finding: string]: string[] };

  constructor() {
    const dataProvider = new DummyCorrelationDataProvider();
    this.findings = dataProvider.generateDummyFindings();
    this.correlations = dataProvider.generateDummyCorrelations(this.findings);
  }

  public getCorrelationsGraphData(levelInfo?: CorrelationLevelInfo): CorrelationGraphData {
    const corLevelInfo = levelInfo || this.correlationLevelInfo;
    switch (corLevelInfo.level) {
      case CorrelationsLevel.AllFindings:
        return this.getAllFindingCorrelations();
      case CorrelationsLevel.Finding:
        return this.getFindingSpecificCorrelations(corLevelInfo.findingId);
      default:
        return this.getEmptyCorrelationsData();
    }
  }

  public resetCorrelationsLevel(): void {
    this.correlationLevelInfo = { level: CorrelationsLevel.AllFindings };
  }

  public registerGraphUpdateHandler(handler: CorrelationGraphUpdateHandler): void {
    this.graphUpdateHandlers.push(handler);
  }

  public createCorrelationRule(correlationRule: CorrelationRule): void {
    // this.correlationRules.push(correlationRule);
    this.correlationRules.push({
      name: 'Between Windows and Ad_ldap',
      fields: [
        {
          logType: 'windows',
          conditions: [],
        },
        {
          logType: 'ad_ldap',
          conditions: [],
        },
      ],
    });
  }

  public getCorrelationRules(): CorrelationRule[] {
    return this.correlationRules;
  }

  private getAllFindingCorrelations(): CorrelationGraphData {
    const graphData: CorrelationGraphData = {
      level: CorrelationsLevel.AllFindings,
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
            findingId: params.nodes[0],
          };
          this.graphUpdateHandlers.forEach((handler) => {
            handler(this.getCorrelationsGraphData());
          });
        },
      },
    };

    const addedEdges = new Set<string>();

    Object.entries(this.correlations).forEach((entry) => {
      graphData.graph.nodes.push(
        this.updateNode(
          { id: entry[0], label: `${entry[1].length}`, value: entry[1].length },
          this.findings[entry[0]].logType
        )
      );

      entry[1].forEach((connectedNodeId) => {
        if (!addedEdges.has(`${connectedNodeId}-${entry[0]}`)) {
          graphData.graph.edges.push({ from: entry[0], to: connectedNodeId });
          addedEdges.add(`${entry[0]}-${connectedNodeId}`);
        }
      });
    });

    return graphData;
  }

  private getFindingSpecificCorrelations(id: string): CorrelationGraphData {
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
          alert(`Finding pane for ${params.nodes[0]}`);
        },
      },
    };

    const correlationsForFinding = this.correlations[id];
    graphData.graph.nodes.push(this.updateNode({ id, label: id }, this.findings[id].logType, true));
    correlationsForFinding.forEach((connectedId) => {
      graphData.graph.nodes.push(
        this.updateNode(
          { id: connectedId, label: connectedId },
          this.findings[connectedId].logType,
          true
        )
      );
      graphData.graph.edges.push({
        from: id,
        to: connectedId,
        label: `${Math.round(Math.random() * 100) / 100}`,
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
      level: CorrelationsLevel.AllFindings,
    };
  }

  private updateNode(node: any, logType: string, alwaysShowLabel: boolean = false) {
    return {
      ...node,
      color: this.colorProvider.getColor(logType),
      scaling: {
        max: 60,
        min: 10,
        label: {
          enabled: true,
          min: 10,
          max: 50,
          maxVisible: 200,
          drawThreshold: alwaysShowLabel ? 5 : 40,
        },
        customScalingFunction: this.customScalingFunction,
      },
    };
  }

  private customScalingFunction = (min: number, max: number, total: number, value: number) => {
    if (max === min) {
      return 0.5;
    }

    const scale = 1 / (max - min);
    return Math.max(0, (value - min) * scale);
  };
}
