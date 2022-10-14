/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { detectorMethodNames } from '../../services/constants';
import { API } from '../../utils/constants';

export default function securityAnalyticsPlugin(Client: any, config: any, components: any) {
  const createAction = components.clientAction.factory;

  Client.prototype.sa = components.clientAction.namespaceFactory();
  const securityAnalytics = Client.prototype.sa.prototype;

  securityAnalytics[detectorMethodNames.CREATE_DETECTOR] = createAction({
    url: {
      fmt: `${API.DETECTORS_BASE}`,
    },
    needBody: true,
    method: 'POST',
  });
}
