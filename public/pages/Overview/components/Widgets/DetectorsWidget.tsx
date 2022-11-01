/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTableColumn, EuiButton } from '@elastic/eui';
import { ROUTES } from '../../../../utils/constants';
import React from 'react';
import { DetectorItem } from '../../models/interfaces';
import { TableWidget } from './TableWidget';
import { WidgetContainer } from './WidgetContainer';
import { DetectorHit } from '../../../../../server/models/interfaces';

const columns: EuiBasicTableColumn<DetectorItem>[] = [
  {
    field: 'detectorName',
    name: 'Detector name',
    sortable: true,
    align: 'left',
  },
  {
    field: 'status',
    name: 'Status',
    sortable: false,
    align: 'left',
    render: (enabled: boolean) => (enabled ? 'ACTIVE' : 'INACTIVE'),
  },
  {
    field: 'logTypes',
    name: 'Log types',
    sortable: true,
    align: 'left',
  },
];

export interface DetectorsWidgetProps {
  detectorHits: DetectorHit[];
}

export const DetectorsWidget: React.FC<DetectorsWidgetProps> = ({ detectorHits }) => {
  const detectors = detectorHits.map((detectorHit) => ({
    detectorName: detectorHit._source.name,
    id: detectorHit._id,
    logTypes: detectorHit._source.detector_type,
    status: detectorHit._source.enabled ? 'ACTIVE' : 'INACTIVE',
  }));

  const actions = React.useMemo(
    () => [
      <EuiButton href={`#${ROUTES.DETECTORS}`}>View all detectors</EuiButton>,
      <EuiButton href={`#${ROUTES.DETECTORS_CREATE}`}>Create detector</EuiButton>,
    ],
    []
  );

  return (
    <WidgetContainer title={`Detectors (${detectors.length})`} actions={actions}>
      <TableWidget columns={columns} items={detectors} />
    </WidgetContainer>
  );
};
