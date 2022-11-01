/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserServices } from '../../../models/interfaces';
import { DetectorHit } from '../../../../server/models/interfaces';
import { AlertItem, FindingItem } from './interfaces';

export interface OverviewViewModel {
  detectors: DetectorHit[];
  findings: FindingItem[];
  alerts: AlertItem[];
}

export type OverviewViewModelRefreshHandler = (overviewState: OverviewViewModel) => void;

export class OverviewViewModelActor {
  private overviewViewModel: OverviewViewModel = {
    detectors: [],
    findings: [],
    alerts: [],
  };
  private refreshHandlers: OverviewViewModelRefreshHandler[] = [];
  private refreshState: 'InProgress' | 'Complete' = 'Complete';

  constructor(private services: BrowserServices | null) {}

  private async updateDetectors() {
    const res = await this.services?.detectorsService.getDetectors();
    if (res?.ok) {
      this.overviewViewModel.detectors = res.response.hits.hits;
    }
  }

  private async updateFindings() {
    const detectorInfo = new Map<string, string>();
    this.overviewViewModel.detectors.forEach((detector) => {
      detectorInfo.set(detector._id, detector._source.detector_type);
    });
    const detectorIds = detectorInfo.keys();
    let findingItems: FindingItem[] = [];

    for (let id of detectorIds) {
      const findingRes = await this.services?.findingsService.getFindings({ detectorId: id });

      if (findingRes?.ok) {
        const logType = detectorInfo.get(id) as string;
        const detectorFindings: FindingItem[] = findingRes.response.findings.map((finding) => ({
          detector: finding.detectorId,
          findingName: finding.id,
          id: finding.id,
          time: finding.timestamp,
          logType,
        }));
        findingItems = findingItems.concat(detectorFindings);
      }
    }

    this.overviewViewModel.findings = findingItems;
  }

  private async updateAlerts() {
    const detectorInfo = new Map<string, string>();
    this.overviewViewModel.detectors.forEach((detector) => {
      detectorInfo.set(detector._id, detector._source.detector_type);
    });
    const detectorIds = detectorInfo.keys();
    let alertItems: AlertItem[] = [];

    for (let id of detectorIds) {
      const alertsRes = await this.services?.alertService.getAlerts({ detector_id: id });

      if (alertsRes?.ok) {
        const logType = detectorInfo.get(id) as string;
        const detectorAlertItems: AlertItem[] = alertsRes.response.alerts.map((alert) => ({
          id: alert.id,
          severity: alert.severity,
          time: alert.last_notification_time,
          triggerName: alert.trigger_name,
          logType,
          acknowledged: !!alert.acknowledged_time,
        }));
        alertItems = alertItems.concat(detectorAlertItems);
      }
    }

    this.overviewViewModel.alerts = alertItems;
  }

  public getOverviewViewModel() {
    return this.overviewViewModel;
  }

  public registerRefreshHandler(handler: OverviewViewModelRefreshHandler) {
    this.refreshHandlers.push(handler);
  }

  public async onRefresh() {
    if (this.refreshState === 'InProgress') {
      return;
    }

    this.refreshState = 'InProgress';
    await this.updateDetectors();
    await this.updateFindings();
    await this.updateAlerts();

    this.refreshHandlers.forEach((handler) => {
      handler(this.overviewViewModel);
    });

    this.refreshState = 'Complete';
  }
}
