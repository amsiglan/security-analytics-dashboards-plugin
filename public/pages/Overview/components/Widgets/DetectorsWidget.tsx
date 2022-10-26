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

const columns: EuiBasicTableColumn<DetectorItem>[] = [
  {
    field: 'name',
    name: 'Detector name',
    sortable: true,
    align: 'left',
  },
  {
    field: 'enabled',
    name: 'Status',
    sortable: false,
    align: 'left',
    render: (enabled) => (enabled ? 'ACTIVE' : 'INACTIVE'),
  },
  {
    field: 'detector_type',
    name: 'Log types',
    sortable: true,
    align: 'left',
  },
];

export interface DetectorsWidgetProps {}

export const DetectorsWidget: React.FC<DetectorsWidgetProps> = () => {
  const [detectors, setDetectors] = useState([]);
  const { detectorsService } = useContext(ServicesContext);

  useEffect(() => {
    console.log('detectorService', detectorsService);
    const getDetectors = async () => {
      const res = await detectorsService?.getDetectors();
      if (res?.ok) {
        const detectors = res.response.hits.hits.map((detector: any) => detector._source);
        setDetectors(detectors);
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
    <WidgetContainer title={`Detectors (${2})`} actions={actions}>
      <TableWidget columns={columns} items={detectors} />
    </WidgetContainer>
  );
};
