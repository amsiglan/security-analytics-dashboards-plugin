/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const graphRenderOptions = {
  nodes: {
    shape: 'circle',
    widthConstraint: 40,
  },
  edges: {
    arrows: {
      to: {
        enabled: false,
      },
    },
    color: '#000000',
    chosen: false,
  },
  layout: {
    hierarchical: false,
  },
  autoResize: true,
  height: '400px',
};

export enum TabIds {
  CORRELATIONS = 'correlations',
  CORRELATION_RULES = 'correlation-rules',
}

export const tabs = [
  { id: TabIds.CORRELATIONS, name: 'Correlations' },
  { id: TabIds.CORRELATION_RULES, name: 'Correlation rules' },
];
