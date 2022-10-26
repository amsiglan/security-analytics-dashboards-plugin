/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiButton,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiPopover,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CoreServicesContext } from '../../../../components/core_services';
import { BREADCRUMBS, ROUTES } from '../../../../utils/constants';
import { DetectorHit } from '../../../../../server/models/interfaces';
import { DetectorDetailsView } from '../DetectorDetailsView/DetectorDetailsView';
import { FieldMappingsView } from '../../components/FieldMappingsView/FieldMappingsView';
import { AlertTriggersView } from '../AlertTriggersView/AlertTriggersView';
import { RuleItem } from '../../../CreateDetector/components/DefineDetector/components/DetectionRules/types/interfaces';

export interface DetectorDetailsProps
  extends RouteComponentProps<
    {},
    any,
    { detectorHit: DetectorHit; enabledRules?: RuleItem[]; allRules?: RuleItem[] }
  > {}

export interface DetectorDetailsState {
  isActionsMenuOpen: boolean;
  selectedTabId: TabId;
  selectedTabContent: React.ReactNode;
}

enum TabId {
  DetectorDetails = 'detector-config-tab',
  FieldMappings = 'field-mappings-tab',
  AlertTriggers = 'alert-triggers-tab',
}

export class DetectorDetails extends React.Component<DetectorDetailsProps, DetectorDetailsState> {
  static contextType = CoreServicesContext;
  private get detectorHit(): DetectorHit {
    return this.props.location.state.detectorHit as DetectorHit;
  }

  editDetectorBasicDetails = () => {
    this.props.history.push({
      pathname: ROUTES.EDIT_DETECTOR_DETAILS,
      state: { detectorHit: this.detectorHit },
    });
  };

  editDetectorRules = (enabledRules: RuleItem[], allRules: RuleItem[]) => {
    this.props.history.push({
      pathname: ROUTES.EDIT_DETECTOR_RULES,
      state: { detectorHit: this.detectorHit, enabledRules, allRules },
    });
  };

  editFieldMappings = () => {
    this.props.history.push({
      pathname: ROUTES.EDIT_FIELD_MAPPINGS,
      state: { detectorHit: this.detectorHit },
    });
  };

  editAlertTriggers = () => {
    this.props.history.push({
      pathname: ROUTES.EDIT_DETECTOR_ALERT_TRIGGERS,
      state: { detectorHit: this.detectorHit },
    });
  };

  private tabs = [
    {
      id: TabId.DetectorDetails,
      name: 'Detector configuration',
      content: (
        <DetectorDetailsView
          {...this.props}
          detector={this.detectorHit._source}
          enabled_time={this.detectorHit._source.enabled_time}
          last_update_time={this.detectorHit._source.last_update_time}
        />
      ),
    },
    {
      id: TabId.FieldMappings,
      name: 'Field mappings',
      content: <FieldMappingsView {...this.props} detector={this.detectorHit._source} />,
    },
    {
      id: TabId.AlertTriggers,
      name: 'Alert triggers',
      content: <AlertTriggersView {...this.props} detector={this.detectorHit._source} />,
    },
  ];

  constructor(props: DetectorDetailsProps) {
    super(props);
    this.state = {
      isActionsMenuOpen: false,
      selectedTabId: TabId.DetectorDetails,
      selectedTabContent: this.tabs[0].content,
    };
  }

  componentDidMount(): void {
    const { name } = this.detectorHit._source;
    this.context.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.DETECTORS,
      BREADCRUMBS.DETECTORS_DETAILS(name),
    ]);
  }

  toggleActionsMenu = () => {
    const { isActionsMenuOpen } = this.state;
    this.setState({ isActionsMenuOpen: !isActionsMenuOpen });
  };

  closeActionsPopover = () => {
    this.setState({ isActionsMenuOpen: false });
  };

  onDelete = () => {};

  toggleDetector = () => {};

  createHeaderActions(): React.ReactNode[] {
    const onClickActions = [
      { name: 'View Alerts', onClick: this.onViewAlertsClick },
      { name: 'View Findings', onClick: this.onViewFindingsClick },
    ];
    const { isActionsMenuOpen } = this.state;
    return [
      ...onClickActions.map((action) => (
        <EuiButton onClick={action.onClick}>{action.name}</EuiButton>
      )),
      <EuiPopover
        id={'detectorsActionsPopover'}
        button={
          <EuiButton
            iconType={'arrowDown'}
            iconSide={'right'}
            onClick={this.toggleActionsMenu}
            data-test-subj={'detectorsActionsButton'}
          >
            Actions
          </EuiButton>
        }
        isOpen={isActionsMenuOpen}
        closePopover={this.closeActionsPopover}
        panelPaddingSize={'none'}
        anchorPosition={'downLeft'}
        data-test-subj={'detectorsActionsPopover'}
      >
        <EuiContextMenuPanel
          items={[
            <EuiContextMenuItem
              key={'Delete'}
              icon={'empty'}
              onClick={() => {
                this.closeActionsPopover();
                this.onDelete();
              }}
              data-test-subj={'editButton'}
            >
              Delete
            </EuiContextMenuItem>,
            <EuiContextMenuItem
              key={'Toggle detector'}
              icon={'empty'}
              onClick={() => {
                this.closeActionsPopover();
                this.toggleDetector();
              }}
              data-test-subj={'deleteButton'}
            >
              {`${this.detectorHit._source.enabled ? 'Stop' : 'Start'} detector`}
            </EuiContextMenuItem>,
          ]}
        />
      </EuiPopover>,
    ];
  }

  onViewAlertsClick = () => {};

  onViewFindingsClick = () => {};

  renderTabs() {
    return this.tabs.map((tab, index) => (
      <EuiTab
        key={index}
        onClick={() => this.setState({ selectedTabId: tab.id, selectedTabContent: tab.content })}
        isSelected={this.state.selectedTabId === tab.id}
      >
        {tab.name}
      </EuiTab>
    ));
  }

  render() {
    const { _source: detector } = this.detectorHit;

    return (
      <EuiPanel>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFlexGroup alignItems="center">
              <EuiFlexItem grow={false}>
                <EuiTitle>
                  <h1>{detector.name}</h1>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiText>
                  <span style={{ color: `${detector.enabled ? 'green' : 'red'}` }}>
                    {detector.enabled ? 'Active' : 'Inactive'}
                  </span>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup justifyContent="flexEnd" alignItems="center">
              {this.createHeaderActions().map(
                (action: React.ReactNode, idx: number): React.ReactNode => (
                  <EuiFlexItem key={idx} grow={false}>
                    {action}
                  </EuiFlexItem>
                )
              )}
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="xl" />
        <EuiTabs>{this.renderTabs()}</EuiTabs>
        <EuiSpacer size="xl" />
        {this.state.selectedTabContent}
      </EuiPanel>
    );
  }
}
