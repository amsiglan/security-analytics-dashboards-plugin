/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OpenSearchDashboardsRequest,
  OpenSearchDashboardsResponseFactory,
  IOpenSearchDashboardsResponse,
  ResponseError,
  RequestHandlerContext,
  ILegacyCustomClusterClient,
} from 'opensearch-dashboards/server';
import { GetFindingsParams, GetFindingsResponse } from '../models/interfaces';
import { ServerResponse } from '../models/types';
import { FINDINGS_METHODS } from './constants';

export default class FindingsService {
  constructor(private osDriver: ILegacyCustomClusterClient) {}

  /**
   * Calls backend GET Findings API.
   */
  getFindings = async (
    _context: RequestHandlerContext,
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
    } catch (error: any) {
      console.error('Security Analytics - FindingsService - getFindings:', error);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: error.message,
        },
      });
    }
  };
}
