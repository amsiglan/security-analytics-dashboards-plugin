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
import { BrowserServices } from '../../../../models/interfaces';

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
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const services = useContext(ServicesContext);

  useEffect(() => {
    const getAlerts = async () => {
      const { alertService, detectorsService } = services as BrowserServices;

      const detectorsRes = await detectorsService.getDetectors();
      if (detectorsRes.ok) {
        const detectorIds = detectorsRes.response.hits.hits.map((hit) => hit._id);
        let alertItems: AlertItem[] = [];

        for (let id of detectorIds) {
          const alertsRes = await alertService.getAlerts({ detector_id: id });

          if (alertsRes.ok) {
            const detectroAlertItems: AlertItem[] = alertsRes.response.alerts.map((alert) => ({
              id: alert.id,
              severity: alert.severity,
              time: alert.last_notification_time,
              triggerName: alert.trigger_name,
            }));
            alertItems = alertItems.concat(detectroAlertItems);
          }
        }

        setAlerts(alertItems);
      }
    };
    getAlerts();
  }, [services]);

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
