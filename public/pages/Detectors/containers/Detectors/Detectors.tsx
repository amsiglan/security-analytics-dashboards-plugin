/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../../../components/ContentPanel';
import {
  EuiButton,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiEmptyPrompt,
  EuiInMemoryTable,
  EuiLink,
  EuiPopover,
  EuiSpacer,
  EuiTableFieldDataColumnType,
  EuiText,
} from '@elastic/eui';
import { FieldValueSelectionFilterConfigType } from '@elastic/eui/src/components/search_bar/filters/field_value_selection_filter';
import { DEFAULT_EMPTY_DATA, PLUGIN_NAME, ROUTES } from '../../../../utils/constants';
import DeleteModal from '../../../../components/DeleteModal';
import { getDetectorNames } from '../../utils/helpers';
import { renderTime } from '../../../../utils/helpers';

interface DetectorsProps extends RouteComponentProps {}

interface DetectorsState {
  detectors: object[];
  loadingDetectors: boolean;
  selectedItems: object[]; // TODO change from type `object`
  isDeleteModalVisible: boolean;
  isPopoverOpen: boolean;
}

export const EXAMPLE_DETECTORS = [
  {
    name: 'Policy 3_38fj',
    id: 1,
    status: 'green',
    policy: 'policy_3_38fj',
    detector_type: 'dns',
    last_updated_time: 1663872009766,
    rules: 'custom',
  },
  {
    name: 'Policy 2343_38fj',
    id: 2,
    status: 'yellow',
    policy: 'policy_2343_38fj',
    detector_type: 'netflow',
    last_updated_time: 1663871009766,
    rules: 'network/dns',
  },
];

export default class Detectors extends Component<DetectorsProps, DetectorsState> {
  constructor(props: DetectorsProps) {
    super(props);

    this.state = {
      detectors: [],
      loadingDetectors: false,
      selectedItems: [],
      isDeleteModalVisible: false,
      isPopoverOpen: false,
    };
  }

  async componentDidMount() {
    await this.getDetectors();
  }

  getDetectors = async () => {
    this.setState({ loadingDetectors: true });
    // TODO: Implement once API is available
    this.setState({ detectors: EXAMPLE_DETECTORS }); // TODO remove after testing
    this.setState({ loadingDetectors: false });
  };

  onClickCreate = () => {
    // TODO: Implement once API is available
  };

  onClickEdit = () => {
    // TODO: Implement once API is available
  };

  openDeleteModal = () => {
    this.setState({ isDeleteModalVisible: true });
  };

  closeDeleteModal = () => {
    this.setState({ isDeleteModalVisible: false });
  };

  onClickDelete = async () => {
    const { selectedItems } = this.state;
    for (let item of selectedItems) {
      await this.deleteDetector(item.id);
    }
    await this.getDetectors();
  };

  deleteDetector = async (id: string) => {
    // TODO: Implement once API is available
  };

  onSelectionChange = (selectedItems: object[]) => {
    this.setState({ selectedItems: selectedItems });
  };

  openActionsButton = () => {
    const { isPopoverOpen } = this.state;
    this.setState({ isPopoverOpen: !isPopoverOpen });
  };

  closeActionsPopover = () => {
    this.setState({ isPopoverOpen: false });
  };

  render() {
    const {
      detectors,
      isDeleteModalVisible,
      isPopoverOpen,
      loadingDetectors,
      selectedItems,
    } = this.state;

    const actions = [
      <EuiButton
        iconType={'refresh'}
        onClick={this.getDetectors}
        data-test-subj={'detectorsRefreshButton'}
      >
        Refresh
      </EuiButton>,
      <EuiPopover
        id={'detectorsActionsPopover'}
        button={
          <EuiButton
            iconType={'arrowDown'}
            iconSide={'right'}
            disabled={!selectedItems.length}
            onClick={this.openActionsButton}
            data-test-subj={'detectorsActionsButton'}
          >
            Actions
          </EuiButton>
        }
        isOpen={isPopoverOpen}
        closePopover={this.closeActionsPopover}
        panelPaddingSize={'none'}
        anchorPosition={'downLeft'}
        data-test-subj={'detectorsActionsPopover'}
      >
        <EuiContextMenuPanel
          items={[
            <EuiContextMenuItem
              key={'Edit'}
              icon={'empty'}
              disabled={selectedItems.length != 1}
              onClick={() => {
                this.closeActionsPopover();
                this.onClickEdit();
              }}
              data-test-subj={'editButton'}
            >
              Edit
            </EuiContextMenuItem>,
            <EuiContextMenuItem
              key={'Delete'}
              icon={'empty'}
              disabled={selectedItems.length != 1}
              onClick={() => {
                this.closeActionsPopover();
                this.openDeleteModal();
              }}
              data-test-subj={'deleteButton'}
            >
              Delete
            </EuiContextMenuItem>,
          ]}
        />
      </EuiPopover>,
      <EuiButton
        disabled={!selectedItems.length}
        onClick={this.openDeleteModal}
        data-test-subj={'detectorsDeleteButton'}
      >
        Delete
      </EuiButton>,
      <EuiButton
        href={`${PLUGIN_NAME}#${ROUTES.DETECTORS_CREATE}`}
        fill={true}
        onClick={this.onClickCreate}
        data-test-subj={'detectorsCreateButton'}
      >
        Create detector
      </EuiButton>,
    ];

    const columns = [
      {
        field: 'name',
        name: 'Name',
        sortable: true,
        dataType: 'string',
        render: (name) => name || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'status',
        name: 'Status',
        sortable: true,
        dataType: 'string',
        render: (status) => status || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'type',
        name: 'Detector type',
        sortable: true,
        dataType: 'string',
        render: (type) => type || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'policy',
        name: 'Policy',
        sortable: true,
        dataType: 'string',
        render: (policy) => policy || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'rules',
        name: 'Rules',
        sortable: true,
        dataType: 'string',
        render: (rules) => rules || DEFAULT_EMPTY_DATA,
      },
      {
        field: 'last_updated_time',
        name: 'Last updated time',
        sortable: true,
        dataType: 'date',
        render: (time) => renderTime(time) || DEFAULT_EMPTY_DATA,
      },
    ];

    const statuses = [...new Set(detectors.map((detector) => detector.status))];
    const policies = [...new Set(detectors.map((detector) => detector.policy))];
    const search = {
      box: { placeholder: 'Search threat detectors' },
      filters: [
        {
          type: 'field_value_selection',
          field: 'status',
          name: 'Status',
          options: statuses.map((status) => ({ value: status })),
          multiSelect: 'or',
        } as FieldValueSelectionFilterConfigType,
        {
          type: 'field_value_selection',
          field: 'policy',
          name: 'Policy',
          options: policies.map((policy) => ({ value: policy })),
          multiSelect: 'or',
        } as FieldValueSelectionFilterConfigType,
      ],
    };

    const sorting = {
      sort: {
        field: 'name',
        direction: 'asc',
      },
    };
    return (
      <ContentPanel title={'Threat detectors'} actions={actions}>
        <EuiSpacer size={'m'} />
        <EuiInMemoryTable
          items={detectors}
          itemId={(item) => `${item.id}:${item.name}`}
          columns={columns}
          pagination={true}
          sorting={sorting}
          isSelectable={true}
          selection={{ onSelectionChange: this.onSelectionChange }}
          search={search}
          loading={loadingDetectors}
          noItemsMessage={
            <EuiEmptyPrompt
              style={{ maxWidth: '45em' }}
              body={
                <EuiText>
                  <p>There are no existing detectors.</p>
                </EuiText>
              }
              actions={[actions[3]]}
            />
          }
        />

        {isDeleteModalVisible && (
          <DeleteModal
            closeDeleteModal={this.closeDeleteModal}
            ids={getDetectorNames(selectedItems)}
            onClickDelete={this.onClickDelete}
            type={selectedItems.length > 1 ? 'detectors' : 'detector'}
          />
        )}
      </ContentPanel>
    );
  }
}
