/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContentPanel } from '../../../../components/ContentPanel';
import React, { useContext, useEffect, useState } from 'react';
import { EuiAccordion, EuiButton, EuiInMemoryTable, EuiSpacer, EuiText } from '@elastic/eui';
import {
  RuleItem,
  RuleItemInfo,
} from '../../../CreateDetector/components/DefineDetector/components/DetectionRules/types/interfaces';
import { getRulesColumns } from '../../../CreateDetector/components/DefineDetector/components/DetectionRules/utils/constants';
import { ServicesContext } from '../../../../services';
import { ruleItemInfosToItems } from '../../../../utils/helpers';
import { Detector } from '../../../../../models/interfaces';
import { RuleInfo } from '../../../../../server/models/interfaces/Rules';

export interface DetectorRulesViewProps {
  detector: Detector;
  rulesCanFold?: boolean;
  onEditClicked: () => void;
}

export const DetectorRulesView: React.FC<DetectorRulesViewProps> = (props) => {
  const totalSelected = props.detector.inputs.reduce((sum, inputObj) => {
    return (
      sum +
      inputObj.detector_input.custom_rules.length +
      inputObj.detector_input.pre_packaged_rules.length
    );
  }, 0);

  const actions = [<EuiButton onClick={props.onEditClicked}>Edit</EuiButton>];

  const [ruleItems, setRuleItems] = useState<RuleItem[]>([]);
  const services = useContext(ServicesContext);

  useEffect(() => {
    const getRules = async (
      prePackaged: boolean,
      enabledRuleIds: Set<string>
    ): Promise<RuleInfo[]> => {
      const getRulesRes = await services?.ruleService.getRules(prePackaged, {
        from: 0,
        size: 5000,
        query: {
          nested: {
            path: 'rule',
            query: {
              bool: {
                must: [
                  { match: { 'rule.category': `${props.detector.detector_type.toLowerCase()}` } },
                ],
              },
            },
          },
        },
      });

      if (getRulesRes?.ok) {
        return getRulesRes.response.hits.hits.filter((hit: RuleInfo) => {
          return enabledRuleIds.has(hit._id);
        });
      }

      return [];
    };

    const updateRulesState = async () => {
      const prePackagedRules = await getRules(
        true,
        new Set(
          props.detector.inputs[0].detector_input.pre_packaged_rules.map((ruleInfo) => ruleInfo.id)
        )
      );
      const customRules = await getRules(
        false,
        new Set(props.detector.inputs[0].detector_input.custom_rules.map((ruleInfo) => ruleInfo.id))
      );

      let ruleItemInfos: RuleItemInfo[] = prePackagedRules.map((rule) => ({
        ...rule,
        enabled: true,
        prePackaged: true,
      }));

      ruleItemInfos = ruleItemInfos.concat(
        customRules.map((rule) => ({
          ...rule,
          enabled: true,
          prePackaged: true,
        }))
      );

      setRuleItems(ruleItemInfosToItems(props.detector.detector_type, ruleItemInfos));
    };

    updateRulesState().catch((error) => {
      // TODO: Show error toast
    });
  }, [services, props.detector]);

  const rules = (
    <EuiInMemoryTable
      columns={getRulesColumns()}
      items={ruleItems}
      itemId={(item: RuleItem) => `${item.name}`}
      pagination
    />
  );

  return props.rulesCanFold ? (
    <EuiAccordion
      id={props.detector.name}
      title="View detection rules"
      buttonContent={
        <EuiText size="m">
          <p>View detection rules</p>
        </EuiText>
      }
    >
      <EuiSpacer size="l" />
      {rules}
    </EuiAccordion>
  ) : (
    <ContentPanel title={`Detection rules (${totalSelected})`} actions={actions}>
      {rules}
    </ContentPanel>
  );
};
