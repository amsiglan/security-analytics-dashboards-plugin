/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiBasicTableColumn, EuiButton } from '@elastic/eui';
import { ROUTES } from '../../../../utils/constants';
import React, { useContext, useEffect, useState } from 'react';
import { AlertItem } from '../../models/interfaces';
import { TableWidget } from './TableWidget';
import { WidgetContainer } from './WidgetContainer';
import { ServicesContext } from '../../../../services';

const columns: EuiBasicTableColumn<AlertItem>[] = [
  {
    field: 'time',
    name: 'Time',
    sortable: true,
    align: 'left',
  },
  {
    field: 'triggerName',
    name: 'Alert Trigger Name',
    sortable: false,
    align: 'left',
  },
  {
    field: 'severity',
    name: 'Alert severity',
    sortable: true,
    align: 'left',
  },
];

export interface RecentAlertsWidgetProps {
  items: AlertItem[];
}

export const RecentAlertsWidget: React.FC<RecentAlertsWidgetProps> = () => {
  const [alerts, setAlerts] = useState([]);
  const { alertService } = useContext(ServicesContext);

  useEffect(() => {
    const getAlerts = async () => {
      const res = await alertService?.getAlerts();
      if (res?.ok) {
        const alerts = res.response.hits.hits.map((alert: any) => alert._source);
        setAlerts(alerts);
      }
    };
    getAlerts();
  }, [alertService]);

  const actions = React.useMemo(
    () => [<EuiButton href={`#${ROUTES.ALERTS}`}>View Alerts</EuiButton>],
    []
  );

  return (
    <WidgetContainer title="Top 20 recent alerts" actions={actions}>
      <TableWidget columns={columns} items={alerts} />
    </WidgetContainer>
  );
};
