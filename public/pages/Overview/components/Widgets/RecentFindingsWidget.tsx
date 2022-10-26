/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTableColumn, EuiButton } from '@elastic/eui';
import { ROUTES } from '../../../../utils/constants';
import React, { useContext, useEffect, useState } from 'react';
import { FindingItem } from '../../models/interfaces';
import { TableWidget } from './TableWidget';
import { WidgetContainer } from './WidgetContainer';
import { ServicesContext } from '../../../../services';
import { BrowserServices } from '../../../../models/interfaces';
import { renderTime } from '../../../../utils/helpers';

const columns: EuiBasicTableColumn<FindingItem>[] = [
  {
    field: 'time',
    name: 'Time',
    sortable: true,
    align: 'left',
    render: renderTime,
  },
  {
    field: 'findingName',
    name: 'Finding Name',
    sortable: false,
    align: 'left',
  },
  {
    field: 'detector',
    name: 'Detector',
    sortable: true,
    align: 'left',
  },
];

export interface RecentFindingsWidgetProps {
  items: FindingItem[];
}

export const RecentFindingsWidget: React.FC<RecentFindingsWidgetProps> = () => {
  const [findingItems, setFindingItems] = useState<FindingItem[]>([]);
  const services = useContext(ServicesContext);

  useEffect(() => {
    const getFindings = async () => {
      const { findingsService, detectorsService } = services as BrowserServices;

      const detectorsRes = await detectorsService.getDetectors();
      if (detectorsRes.ok) {
        const detectorIds = detectorsRes.response.hits.hits.map((hit) => hit._id);
        let findings: Finding[] = [];

        for (let id of detectorIds) {
          const findingRes = await findingsService.getFindings({ detectorId: id });

          if (findingRes.ok) {
            findings = findings.concat(findingRes.response.findings);
          }
        }

        const findingItems: FindingItem[] = findings.map((finding) => ({
          detector: finding.detectorId,
          findingName: finding.id,
          id: finding.id,
          time: finding.timestamp,
        }));

        setFindingItems(findingItems);
      }
    };
    getFindings();
  }, [services]);

  const actions = React.useMemo(
    () => [<EuiButton href={`#${ROUTES.FINDINGS}`}>View all findings</EuiButton>],
    []
  );

  return (
    <WidgetContainer title="Top 20 recent findings" actions={actions}>
      <TableWidget columns={columns} items={findingItems} />
    </WidgetContainer>
  );
};
