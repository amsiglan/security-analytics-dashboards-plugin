/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecurityAnalyticsPluginSetup, SecurityAnalyticsPluginStart } from '.';
import { Plugin, CoreSetup, CoreStart, ILegacyCustomClusterClient } from '../../../src/core/server';
import { createSecurityAnalyticsCluster } from './clusters';
import { setupDetectorRoutes } from './routes';
import { DetectorsService, FindingsService } from './services';
import { NodeServices } from './utils/constants';

export class SecurityAnalyticsPlugin
  implements Plugin<SecurityAnalyticsPluginSetup, SecurityAnalyticsPluginStart> {
  public async setup(core: CoreSetup) {
    // Create OpenSearch client that aware of SA API endpoints
    const osDriver: ILegacyCustomClusterClient = createSecurityAnalyticsCluster(core);

    // Initialize services
    const detectorsService = new DetectorsService(osDriver);
    const findingsService = new FindingsService(osDriver);
    const services: NodeServices = {
      detectorsService,
      findingsService,
    };

    // Create router
    const router = core.http.createRouter();

    // setup routes
    setupDetectorRoutes(services, router);

    return {};
  }

  public async start(_core: CoreStart) {
    return {};
  }
}
