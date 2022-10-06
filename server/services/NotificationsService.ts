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
import { GetChannelsResponse, GetNotificationConfigsResponse } from '../models/interfaces';

export const NOTIFICATIONS_METHODS = {
  GET_CHANNEL: 'security_analytics.getChannel',
  GET_CHANNELS: 'security_analytics.getChannels',
};

export default class NotificationsService {
  osDriver: ICustomClusterClient;

  constructor(osDriver: ICustomClusterClient) {
    this.osDriver = osDriver;
  }

  getChannel = async (
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetNotificationConfigsResponse> | ResponseError>
  > => {
    try {
      const { id } = request.params as { id: string };
      const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);

      const getResponse: GetNotificationConfigsResponse = await callWithRequest(
        NOTIFICATIONS_METHODS.GET_CHANNEL,
        { id }
      );

      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: getResponse,
        },
      });
    } catch (err) {
      console.error('Security Analytics - NotificationService - getChannel:', err);
      return response.custom({
        statusCode: 200,
        body: {
          ok: false,
          error: err.message,
        },
      });
    }
  };

  getChannels = async (
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest,
    response: OpenSearchDashboardsResponseFactory
  ): Promise<
    IOpenSearchDashboardsResponse<ServerResponse<GetChannelsResponse> | ResponseError>
  > => {
    try {
      const { callAsCurrentUser: callWithRequest } = this.osDriver.asScoped(request);
      const getChannelsResponse: GetChannelsResponse = await callWithRequest(
        NOTIFICATIONS_METHODS.GET_CHANNELS
      );
      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: getChannelsResponse,
        },
      });
    } catch (err) {
      console.error('Security Analytics - NotificationService - getChannels:', err);
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
