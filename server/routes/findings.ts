/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IRouter } from 'opensearch-dashboards/server';
import { schema } from '@osd/config-schema';
import { API, NodeServices } from '../utils/constants';

export default function (services: NodeServices, router: IRouter) {
  const { findingsService } = services;

  router.get(
    {
      path: `${API.FINDINGS}?detectorId={detectorId}`,
      validate: {
        query: schema.object({
          detectorId: schema.string(),
        }),
      },
    },
    findingsService.getFindings
  );
}
