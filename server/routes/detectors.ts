/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IRouter } from 'opensearch-dashboards/server';
import { schema } from '@osd/config-schema';
import { NODE_API, NodeServices } from '../utils/constants';

export default function (services: NodeServices, router: IRouter) {
  const { detectorsService } = services;

  router.post(
    {
      path: NODE_API.DETECTORS,
      validate: {
        body: schema.any(),
      },
    },
    detectorsService.createDetector
  );

  router.delete(
    {
      path: `${NODE_API.DETECTORS}/{detectorId}`,
      validate: {
        params: schema.object({
          detectorId: schema.string(),
        }),
      },
    },
    detectorsService.deleteDetector
  );

  router.get(
    {
      path: `${NODE_API.DETECTORS}/{detectorId}`,
      validate: {
        params: schema.object({
          detectorId: schema.string(),
        }),
      },
    },
    detectorsService.getDetector
  );

  router.post(
    {
      path: `${NODE_API.DETECTORS}/_search`,
      validate: {
        body: schema.any(),
      },
    },
    detectorsService.getDetectors
  );

  router.put(
    {
      path: `${NODE_API.DETECTORS}/{detectorId}`,
      validate: {
        body: schema.any(),
      },
    },
    detectorsService.updateDetector
  );
}
