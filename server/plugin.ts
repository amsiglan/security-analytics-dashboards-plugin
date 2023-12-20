/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecurityAnalyticsPluginSetup, SecurityAnalyticsPluginStart } from '.';
import {
  Plugin,
  CoreSetup,
  CoreStart,
  ILegacyCustomClusterClient,
  Logger,
  PluginInitializerContext,
} from '../../../src/core/server';
import { createSecurityAnalyticsCluster } from './clusters/createSecurityAnalyticsCluster';
import { NodeServices } from './models/interfaces';
import {
  setupDetectorRoutes,
  setupCorrelationRoutes,
  setupFindingsRoutes,
  setupOpensearchRoutes,
  setupFieldMappingRoutes,
  setupIndexRoutes,
  setupAlertsRoutes,
  setupNotificationsRoutes,
  setupLogTypeRoutes,
  setupRulesRoutes,
} from './routes';
import {
  IndexService,
  FindingsService,
  OpenSearchService,
  FieldMappingService,
  DetectorService,
  AlertService,
  RulesService,
  NotificationsService,
  CorrelationService,
} from './services';
import { LogTypeService } from './services/LogTypeService';

export class SecurityAnalyticsPlugin
  implements Plugin<SecurityAnalyticsPluginSetup, SecurityAnalyticsPluginStart> {
  private readonly logger: Logger;

  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.logger = this.initializerContext.logger.get();
  }

  public async setup(core: CoreSetup) {
    // Create OpenSearch client that aware of SA API endpoints
    const osDriver: ILegacyCustomClusterClient = createSecurityAnalyticsCluster(core);

    // Initialize services
    const services: NodeServices = {
      detectorsService: new DetectorService(osDriver),
      correlationService: new CorrelationService(osDriver),
      indexService: new IndexService(osDriver),
      findingsService: new FindingsService(osDriver),
      opensearchService: new OpenSearchService(osDriver),
      fieldMappingService: new FieldMappingService(osDriver),
      alertService: new AlertService(osDriver),
      rulesService: new RulesService(osDriver, this.logger),
      notificationsService: new NotificationsService(osDriver),
      logTypeService: new LogTypeService(osDriver, this.logger),
    };

    // Create router
    const router = core.http.createRouter();

    // setup routes
    setupDetectorRoutes(services, router);
    setupCorrelationRoutes(services, router);
    setupIndexRoutes(services, router);
    setupFindingsRoutes(services, router);
    setupOpensearchRoutes(services, router);
    setupFieldMappingRoutes(services, router);
    setupAlertsRoutes(services, router);
    setupRulesRoutes(services, router);
    setupNotificationsRoutes(services, router);
    setupLogTypeRoutes(services, router);

    return {};
  }

  public async start(_core: CoreStart) {
    return {};
  }
}
