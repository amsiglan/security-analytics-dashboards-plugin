/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FieldMappingPropertyMap,
  GetFieldMappingViewResponse,
} from '../../../../../../server/models/interfaces';

export const STATUS_ICON_PROPS = {
  unmapped: { type: 'alert', color: 'danger' },
  mapped: { type: 'checkInCircleFilled', color: 'success' },
};

export const EMPTY_FIELD_MAPPINGS_VIEW: GetFieldMappingViewResponse = {
  properties: {},
  unmapped_field_aliases: [],
  unmapped_index_fields: [],
};

export const EMPTY_FIELD_MAPPINGS: FieldMappingPropertyMap = {
  properties: {},
};

export const fieldsToBeMapped: { [detectorType: string]: Set<string> } = {
  network: new Set([
    'timestamp',
    'cloud.account.id',
    'cloud.region',
    'network.packets',
    'source.packets',
    'source.ip',
    'source.geo.country_iso_code',
  ]),
  s3: new Set([
    'timestamp',
    'cloud.account.id',
    'cloud.region',
    'source.geo.country_iso_code',
    'source.ip',
    'Bucket',
    'ErrorCode',
    'HTTPstatus',
    'Operation',
    'RequestURI_key',
    'Requester',
  ]),
  cloudtrail: new Set([
    'cloud.account.id',
    'cloud.region',
    'source.geo.country_name',
    'source.ip',
    'source.geo.country_iso_code',
    'source.as.organization.name',
    'userIdentity.arn',
    'eventName',
    'eventType',
    'errorCode',
    'eventSource',
    'tlsDetails.tlsVersion',
    'user_agent.name',
    'threat.matched.providers',
  ]),
};
