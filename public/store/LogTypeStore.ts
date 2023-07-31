/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotificationsStart } from 'opensearch-dashboards/public';
import { LogType, LogTypeBase, LogTypeWithRules, RuleItemInfoBase } from '../../types';
import LogTypeService from '../services/LogTypeService';
import { errorNotificationToast } from '../utils/helpers';
import { DataStore } from './DataStore';
import { ruleTypes } from '../pages/Rules/utils/constants';

export class LogTypeStore {
  constructor(private service: LogTypeService, private notifications: NotificationsStart) {}

  public async getLogType(id: string): Promise<LogTypeWithRules | undefined> {
    const logTypesRes = await this.service.searchLogTypes(id);
    if (logTypesRes.ok) {
      const logTypes: LogType[] = logTypesRes.response.hits.hits.map((hit) => {
        return {
          id: hit._id,
          ...hit._source,
        };
      });

      let detectionRules: RuleItemInfoBase[] = [];

      if (logTypes[0]) {
        const logTypeName = logTypes[0].name.toLowerCase();
        detectionRules = await DataStore.rules.getAllRules({
          'rule.category': [logTypeName],
        });
      }

      return { ...logTypes[0], detectionRules };
    }

    return undefined;
  }

  public async getLogTypes(): Promise<LogType[]> {
    const logTypesRes = await this.service.searchLogTypes();
    if (logTypesRes.ok) {
      const logTypes: LogType[] = logTypesRes.response.hits.hits.map((hit) => {
        return {
          id: hit._id,
          ...hit._source,
        };
      });

      ruleTypes.splice(
        0,
        ruleTypes.length,
        ...logTypes.map((logType) => ({
          label: logType.name,
          value: logType.id,
          abbr: '',
        }))
      );

      return logTypes;
    }

    return [];
  }

  public async createLogType(logType: LogTypeBase): Promise<boolean> {
    const createRes = await this.service.createLogType(logType);

    if (!createRes.ok) {
      errorNotificationToast(this.notifications, 'create', 'log type', createRes.error);
    }

    return createRes.ok;
  }

  public async updateLogType({ id, name, description, source, tags }: LogType): Promise<boolean> {
    const updateRes = await this.service.updateLogType(id, {
      name,
      description,
      source,
      tags,
    });

    if (!updateRes.ok) {
      errorNotificationToast(this.notifications, 'update', 'log type', updateRes.error);
    }

    return updateRes.ok;
  }

  public async deleteLogType(id: string) {
    const deleteRes = await this.service.deleteLogType(id);
    if (!deleteRes.ok) {
      errorNotificationToast(this.notifications, 'delete', 'log type', deleteRes.error);
    }

    return deleteRes.ok;
  }
}
