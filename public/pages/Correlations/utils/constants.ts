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
    improvedLayout: false,
  },
  autoResize: true,
  height: '2000px',
  width: '100%',
  physics: {
    stabilization: {
      fit: true,
      iterations: 1000,
    },
  },
  interaction: {
    zoomView: true,
    zoomSpeed: 0.2,
    dragView: true,
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
