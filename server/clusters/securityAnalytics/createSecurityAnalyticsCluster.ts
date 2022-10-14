/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import securityAnalyticsPlugin from './securityAnalyticsPlugin';
import { CLUSTER } from '../../utils/constants';
import { CoreSetup } from 'opensearch-dashboards/server';

export function createSecurityAnalyticsCluster(core: CoreSetup) {
  return core.opensearch.legacy.createClient(CLUSTER.SA, {
    plugins: [securityAnalyticsPlugin],
  });
}
