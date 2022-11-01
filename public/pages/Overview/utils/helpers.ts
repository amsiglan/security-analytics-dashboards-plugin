/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { TopLevelSpec } from 'vega-lite';
import { SummaryData } from '../components/Widgets/Summary';

function getVisualizationSpec(description: string, data: any, layers: any[]) {
  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: description,
    data: {
      values: data,
    },
    layer: layers,
  };

  return spec;
}

export function getOverviewVisualizationSpec(
  visualizationData: SummaryData[],
  groupBy: string
): TopLevelSpec {
  const timeUnit = 'yearmonthdatehours';
  const aggregate = 'sum';
  const findingsEncoding: { [x: string]: any } = {
    x: { timeUnit, field: 'time' },
    y: { aggregate, field: 'finding', type: 'quantitative' },
  };

  if (groupBy === 'log_type') {
    findingsEncoding['color'] = { field: 'logType', type: 'nominal', title: 'Log type' };
  }

  return getVisualizationSpec(
    'Plot showing average data with raw values in the background.',
    visualizationData,
    [
      {
        mark: 'bar',
        encoding: findingsEncoding,
      },
      {
        mark: 'line',
        encoding: {
          x: { timeUnit, field: 'time' },
          y: { aggregate, field: 'alert' },
        },
      },
    ]
  );
}

export function getFindingsVisualizationSpec(visualizationData: any[], groupBy: string) {
  return getVisualizationSpec('Findings data overview', visualizationData, []);
}

export function getAlertsVisualizationSpec(visualizationData: any[], groupBy: string) {
  return getVisualizationSpec('Alerts data overview', visualizationData, []);
}
