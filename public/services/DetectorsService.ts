/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpSetup } from 'opensearch-dashboards/public';
import { ServerResponse } from '../../server/models/types';
import { CreateDetectorResponse } from '../../server/models/interfaces';
import { NODE_API } from '../../server/utils/constants';

export default class DetectorsService {
  httpClient: HttpSetup;

  constructor(httpClient: HttpSetup) {
    this.httpClient = httpClient;
  }

  createDetector = async (): Promise<ServerResponse<CreateDetectorResponse>> => {
    const url = `..${NODE_API.DETECTORS}`;
  };
}
