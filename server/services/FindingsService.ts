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
import { GetFindingsParams, GetFindingsResponse } from '../models/interfaces';
import { ServerResponse } from '../models/types';

export const FINDINGS_METHODS = {
  GET_FINDINGS: 'security_analytics.getFindings',
};

export default class FindingsService {
  osDriver: ICustomClusterClient;

  constructor(osDriver: ICustomClusterClient) {
    this.osDriver = osDriver;
  }

  /**
   * Calls backend GET Findings API.
   */
  getFindings = async (
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetFindingsResponse> | ResponseError>
  > => {
    try {
      const { detectorId } = request.params as { detectorId: string };
      const params: GetFindingsParams = { detectorId };
      const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      const getFindingsResponse: GetFindingsResponse = await callWithRequest(
        FINDINGS_METHODS.GET_FINDINGS,
        params
      );
      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: getFindingsResponse,
        },
      });
    } catch (e) {
      console.error('Security Analytics - FindingsService - getFindings:', e);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: err.message,
        },
      });
    }
  };
}
