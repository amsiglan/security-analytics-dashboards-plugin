/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const graphRenderOptions = {
  nodes: {
    shape: 'circle',
  },
  edges: {
    arrows: {
      to: {
        enabled: false,
      },
    },
    color: '#000000',
    // chosen: false,
  },
  layout: {
    hierarchical: false,
    randomSeed: 2222,
  },
  autoResize: true,
  height: '1500px',
  physics: {
    stabilization: {
      fit: true,
      iterations: 1000,
    },
  },
  interaction: {
    zoomView: true,
    dragView: false,
    dragNodes: false,
    multiselect: true,
  },
};

export enum TabIds {
  CORRELATIONS = 'correlations',
  CORRELATION_RULES = 'correlation-rules',
}

export const tabs = [
  { id: TabIds.CORRELATIONS, name: 'Correlations' },
  { id: TabIds.CORRELATION_RULES, name: 'Correlation rules' },
];
