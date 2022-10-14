/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Detector, DetectorInput, PeriodSchedule } from '../../models/interfaces';

export const PLUGIN_NAME = 'opensearch_security_analytics_dashboards';

// TODO: Replace with actual documentation link once it's available
export const DOCUMENTATION_URL = 'https://opensearch.org/docs/latest/';

export const DEFAULT_EMPTY_DATA = '-';

export const ROUTES = Object.freeze({
  ALERTS: '/alerts',
  DASHBOARDS: '/dashboards',
  DETECTORS: '/detectors',
  FINDINGS: '/findings',
  OVERVIEW: '/overview',
  RULES: '/rules',

  get LANDING_PAGE() {
    return this.OVERVIEW;
  },
});

export const BREADCRUMBS = Object.freeze({
  SECURITY_ANALYTICS: { text: 'Security Analytics', href: '#/' },
});

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export const FixedTimeunitOptions = [
  { value: 'ms', text: 'Millisecond(s)' },
  { value: 's', text: 'Second(s)' },
  { value: 'm', text: 'Minute(s)' },
  { value: 'h', text: 'Hour(s)' },
  { value: 'd', text: 'Day(s)' },
];

export const CalendarTimeunitOptions = [
  { value: 'm', text: 'Minute' },
  { value: 'h', text: 'Hour' },
  { value: 'd', text: 'Day' },
  { value: 'w', text: 'Week' },
  { value: 'M', text: 'Month' },
  { value: 'q', text: 'Quarter' },
  { value: 'y', text: 'Year' },
];

export enum IntervalType {
  FIXED = 'fixed',
  CALENDAR = 'calendar',
}

export const EMPTY_DEFAULT_PERIOD_SCHEDULE: PeriodSchedule = {
  period: {
    interval: 1,
    unit: 'm',
  },
};

export const EMPTY_DEFAULT_DETECTOR_INPUT: DetectorInput = {
  input: {
    description: '',
    indices: [],
    rules: [],
  },
};

export const EMPTY_DEFAULT_DETECTOR: Detector = {
  type: '',
  detector_type: '',
  name: '',
  enabled: true,
  createdBy: '',
  schedule: EMPTY_DEFAULT_PERIOD_SCHEDULE,
  inputs: [EMPTY_DEFAULT_DETECTOR_INPUT],
  triggers: [],
};
