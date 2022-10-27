/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiLink } from '@elastic/eui';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../../../components/ContentPanel';

interface DashboardsProps extends RouteComponentProps {}

interface DashboardsState {}

const dashboardLink =
  "http://54.252.253.91/app/dashboards#/view/b721cd80-5594-11ed-8ecd-ebf1ee857be0?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2022-03-08T08:00:00.000Z',to:'2022-06-05T06:30:00.000Z'))&_a=(description:'',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!f,title:VPCFlowLogs,viewMode:view)";

export default class Dashboards extends Component<DashboardsProps, DashboardsState> {
  constructor(props: DashboardsProps) {
    super(props);
  }

  render() {
    return (
      <ContentPanel title={'Dashboards'}>
        <div style={{ padding: 20, fontSize: 20 }}>
          <EuiLink href={dashboardLink} target={'_blank'}>
            VPC flow logs
          </EuiLink>
        </div>
      </ContentPanel>
    );
  }
}
