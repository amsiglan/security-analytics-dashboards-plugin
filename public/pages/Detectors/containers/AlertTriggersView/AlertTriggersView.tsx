/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContentPanel } from '../../../../components/ContentPanel';
import React, { useMemo } from 'react';
import { EuiButton } from '@elastic/eui';
import { AlertTriggerView } from '../../components/AlertTriggerView/AlertTriggerView';
import { Detector } from '../../../../../models/interfaces';

export interface AlertTriggersViewProps {
  detector: Detector;
  editAlertTriggers: () => void;
}

export const AlertTriggersView: React.FC<AlertTriggersViewProps> = ({
  detector,
  editAlertTriggers,
}) => {
  const actions = useMemo(() => [<EuiButton onClick={editAlertTriggers}>Edit</EuiButton>], []);

  return (
    <ContentPanel title={`Alert triggers (${detector.triggers.length})`} actions={actions}>
      {detector.triggers.map((alertTrigger, index) => (
        <AlertTriggerView key={alertTrigger.id} alertTrigger={alertTrigger} orderPosition={index} />
      ))}
    </ContentPanel>
  );
};
