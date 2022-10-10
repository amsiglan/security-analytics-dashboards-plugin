/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpSetup } from 'opensearch-dashboards/public';
import { ServerResponse } from '../../server/models/types';
import {
  CreateDetectorResponse,
  DeleteDetectorResponse,
  GetDetectorsResponse,
} from '../../server/models/interfaces';
import { NODE_API } from '../../server/utils/constants';
import { Detector } from '../../models/interfaces';

export default class DetectorsService {
  httpClient: HttpSetup;

  constructor(httpClient: HttpSetup) {
    this.httpClient = httpClient;
  }

  createDetector = async (detector: Detector): Promise<ServerResponse<CreateDetectorResponse>> => {
    const url = `..${NODE_API.DETECTORS}`;
    const response = (await this.httpClient.post(url, {
      body: JSON.stringify(detector),
    })) as ServerResponse<CreateDetectorResponse>;

    return response;
  };

  getDetector = async (detectorId: string): Promise<ServerResponse<GetDetectorsResponse>> => {
    const url = `..${NODE_API.DETECTORS}/${detectorId};`;
    return await this.httpClient.get(url);
  };

  getDetectors = async (): Promise<ServerResponse<GetDetectorsResponse>> => {
    const url = `..${NODE_API.DETECTORS}`;
    return await this.httpClient.get(url);
  };

  deleteDetector = async (detectorId: string): Promise<ServerResponse<DeleteDetectorResponse>> => {
    const url = `..${NODE_API.DETECTORS}/${detectorId}`;
    return await this.httpClient.delete(url);
  };
}
