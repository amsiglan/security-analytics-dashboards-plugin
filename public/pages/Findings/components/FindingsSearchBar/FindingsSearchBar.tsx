/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../../../components/ContentPanel';
import { EuiAccordion, EuiHorizontalRule, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';

interface FindingsSearchBarProps extends RouteComponentProps {}

interface FindingsSearchBarState {}

export default class FindingsSearchBar extends Component<
  FindingsSearchBarProps,
  FindingsSearchBarState
> {
  constructor(props: FindingsSearchBarProps) {
    super(props);
    this.state = {};
  }

  render() {
    return undefined;
  }
}
