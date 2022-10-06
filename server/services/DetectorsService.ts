/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ICustomClusterClient,
  OpenSearchDashboardsRequest,
  OpenSearchDashboardsResponseFactory,
  IOpenSearchDashboardsResponse,
  ResponseError,
  RequestHandlerContext,
} from 'opensearch-dashboards/server';
import { ServerResponse } from '../models/types';
import {
  CreateDetectorParams,
  CreateDetectorResponse,
  DeleteDetectorParams,
  DeleteDetectorResponse,
  GetDetectorParams,
  GetDetectorResponse,
  GetDetectorsParams,
  GetDetectorsResponse,
  UpdateDetectorParams,
  UpdateDetectorResponse,
} from '../models/interfaces';
import { Detector } from '../../models/interfaces';

export const DETECTORS_METHODS = {
  CREATE_DETECTOR: 'security_analytics.createDetector',
  DELETE_DETECTOR: 'security_analytics.deleteDetector',
  GET_DETECTOR: 'security_analytics.getDetector',
  GET_DETECTORS: 'security_analytics.getDetectors',
  UPDATE_DETECTOR: 'security_analytics.updateDetector',
};

export default class DetectorsService {
  osDriver: ICustomClusterClient;

  constructor(osDriver: ICustomClusterClient) {
    this.osDriver = osDriver;
  }

  /**
   * Calls backend POST Detectors API.
   */
  createDetector = async (
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<CreateDetectorResponse> | ResponseError>
  > => {
    try {
      const { detector } = request.params as { detector: string };
      const params: CreateDetectorParams = { detector };
      const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      const createDetectorResponse: CreateDetectorResponse = await callWithRequest(
        DETECTORS_METHODS.CREATE_DETECTOR,
        params
      );
      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: createDetectorResponse,
        },
      });
    } catch (e) {
      console.error('Security Analytics - DetectorsService - createDetector:', e);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: e.message,
        },
      });
    }
  };

  /**
   * Calls backend DELETE Detectors API.
   */
  deleteDetector = async (
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<DeleteDetectorResponse> | ResponseError>
  > => {
    try {
      const { detectorId } = request.params as { detectorId: string };
      const params: DeleteDetectorParams = { detectorId };
      const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      const deleteDetectorResponse: DeleteDetectorResponse = await callWithRequest(
        DETECTORS_METHODS.DELETE_DETECTOR,
        params
      );
      if (deleteDetectorResponse.result !== 'deleted') {
        return response.custom({
          statusCode: 200,
          body: {
            ok: false,
            error: deleteDetectorResponse.result,
          },
        });
      }
      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: true,
        },
      });
    } catch (e) {
      console.error('Security Analytics - DetectorsService - deleteDetector:', e);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: e.message,
        },
      });
    }
  };

  // TODO: Not implemented on the backend yet
  /**
   * Calls backend GET Detector API.
   */
  getDetector = async (
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetDetectorResponse> | ResponseError>
  > => {
    try {
      const { detectorId } = request.params as { detectorId: string };
      const params: GetDetectorParams = { detectorId };
      const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      const getDetectorResponse: GetDetectorResponse = await callWithRequest(
        DETECTORS_METHODS.GET_DETECTOR,
        params
      );
      const detector = getDetectorResponse.detector;
      if (detector) {
        return response.custom({
          statusCode: 200,
          body: {
            ok: true,
            response: {
              detector: detector as Detector,
            },
          },
        });
      } else {
        return response.custom({
          statusCode: 200,
          body: {
            ok: false,
            error: 'Failed to load detector.',
          },
        });
      }
    } catch (e) {
      console.error('Security Analytics - DetectorsService - getDetector:', e);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: e.message,
        },
      });
    }
  };

  // TODO: Not implemented on the backend yet
  /**
   * Calls backend GET Detectors API.
   */
  getDetectors = async (
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetDetectorsResponse> | ResponseError>
  > => {
    try {
      const { detectorId } = request.params as { detectorId: string };
      const params: GetDetectorsParams = { detectorId };
      const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      const getDetectorsResponse: GetDetectorsResponse = await callWithRequest(
        DETECTORS_METHODS.GET_DETECTOR,
        params
      );
      const detectors = getDetectorsResponse.detectors;
      if (detectors) {
        return response.custom({
          statusCode: 200,
          body: {
            ok: true,
            response: {
              detector: detectors as Detector[],
            },
          },
        });
      } else {
        return response.custom({
          statusCode: 200,
          body: {
            ok: false,
            error: 'Failed to load detectors.',
          },
        });
      }
    } catch (e) {
      console.error('Security Analytics - DetectorsService - getDetectors:', e);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: e.message,
        },
      });
    }
  };

  /**
   * Calls backend PUT Detector API.
   */
  updateDetector = async (
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<UpdateDetectorResponse> | ResponseError>
  > => {
    try {
      const { detectorId, detector } = request.params as { detectorId: string; detector: string };
      const params: UpdateDetectorParams = { detectorId, detector };
      const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      const updateDetectorResponse: UpdateDetectorResponse = await callWithRequest(
        DETECTORS_METHODS.UPDATE_DETECTOR,
        params
      );
      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: updateDetectorResponse,
        },
      });
    } catch (e) {
      console.error('Security Analytics - DetectorsService - updateDetector:', e);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: e.message,
        },
      });
    }
  };
}
