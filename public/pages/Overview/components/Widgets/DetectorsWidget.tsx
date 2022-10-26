/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTableColumn, EuiButton } from '@elastic/eui';
import { ROUTES } from '../../../../utils/constants';
import React, { useContext, useEffect, useState } from 'react';
import { DetectorItem } from '../../models/interfaces';
import { TableWidget } from './TableWidget';
import { WidgetContainer } from './WidgetContainer';
import { ServicesContext } from '../../../../services';
import { BrowserServices } from '../../../../models/interfaces';
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

export interface DetectorsWidgetProps {}

export const DetectorsWidget: React.FC<DetectorsWidgetProps> = () => {
  const [detectors, setDetectors] = useState<DetectorItem[]>([]);
  const { detectorsService } = useContext(ServicesContext) as BrowserServices;

  useEffect(() => {
    console.log('detectorService', detectorsService);
    const getDetectors = async () => {
      const res = await detectorsService?.getDetectors();
      if (res?.ok) {
        const detectors = res.response.hits.hits.map((detector: DetectorHit) => detector._source);
        setDetectors(
          detectors.map((detector) => ({
            detectorName: detector.name,
            id: detector.id as string,
            logTypes: detector.detector_type,
            status: detector.enabled ? 'ACTIVE' : 'INACTIVE',
          }))
        );
      }
    };
    getDetectors();
  }, [detectorsService]);

  const actions = React.useMemo(
    () => [
      <EuiButton href={`#${ROUTES.DETECTORS}`}>View all detectors</EuiButton>,
      <EuiButton href={`#${ROUTES.DETECTORS_CREATE}`}>Create detector</EuiButton>,
    ],
    []
  );

  console.log('detectors', detectors);
  return (
    <WidgetContainer title={`Detectors (${detectors.length})`} actions={actions}>
      <TableWidget columns={columns} items={detectors} />
    </WidgetContainer>
  );
};
