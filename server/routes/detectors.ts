/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IRouter } from 'opensearch-dashboards/server';
import { schema } from '@osd/config-schema';
import { API, NodeServices } from '../utils/constants';

export function setupDetectorRoutes(services: NodeServices, router: IRouter) {
  const { detectorsService } = services;

  router.post(
    {
      path: API.DETECTORS_BASE,
      validate: {
        body: schema.any(),
      },
    },
    detectorsService.createDetector
  );
}
