/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { EuiCheckboxGroup, EuiFormRow, EuiSpacer, EuiTitle } from '@elastic/eui';
import { SEVERITY_OPTIONS } from '../../../CreateDetector/components/ConfigureAlerts/utils/constants';
import { parseStringsToOptions } from '../../../../utils/helpers';

interface FindingsFilterBarProps extends RouteComponentProps {
  loading: boolean;
  ruleTypes: string[];
  changeRuleTypeFilters: (selections: string[]) => void;
  changeSeverityFilters: (selections: string[]) => void;
  sources: string[];
  changeSourceFilters: (selections: string[]) => void;
}

interface FindingsFilterBarState {
  ruleTypesCheckboxIdToSelectedMap: {};
  severityCheckboxIdToSelectedMap: {};
  sourceFiltersCheckboxIdToSelectedMap: {};
  useDefaultFilters: boolean;
}

export default class FindingsFilterBar extends Component<
  FindingsFilterBarProps,
  FindingsFilterBarState
> {
  constructor(props: FindingsFilterBarProps) {
    super(props);
    this.state = {
      ruleTypesCheckboxIdToSelectedMap: {},
      severityCheckboxIdToSelectedMap: {},
      sourceFiltersCheckboxIdToSelectedMap: {},
      useDefaultFilters: true,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<FindingsFilterBarProps>,
    prevState: Readonly<FindingsFilterBarState>,
    snapshot?: any
  ) {
    const { loading } = this.props;
    const { useDefaultFilters } = this.state;
    if (!loading && useDefaultFilters) this.resetFilters();
  }

  changeRuleTypeFilters = (e: ChangeEvent<HTMLSelectElement>) => {
    const { changeRuleTypeFilters } = this.props;
    const { ruleTypesCheckboxIdToSelectedMap } = this.state;
    const newCheckboxIdToSelectedMap = {
      ...ruleTypesCheckboxIdToSelectedMap,
      [e]: !ruleTypesCheckboxIdToSelectedMap[e],
    };
    const appliedFilters = Object.keys(newCheckboxIdToSelectedMap).filter(
      (id) => newCheckboxIdToSelectedMap[id]
    );
    changeRuleTypeFilters(appliedFilters as string[]);
    this.setState({ ruleTypesCheckboxIdToSelectedMap: newCheckboxIdToSelectedMap });
  };

  changeSeverityFilters = (e: ChangeEvent<HTMLSelectElement>) => {
    const { changeSeverityFilters } = this.props;
    const { severityCheckboxIdToSelectedMap } = this.state;
    const newCheckboxIdToSelectedMap = {
      ...severityCheckboxIdToSelectedMap,
      [e]: !severityCheckboxIdToSelectedMap[e],
    };
    const appliedFilters = Object.keys(newCheckboxIdToSelectedMap).filter(
      (id) => newCheckboxIdToSelectedMap[id]
    );
    changeSeverityFilters(appliedFilters as string[]);
    this.setState({ severityCheckboxIdToSelectedMap: newCheckboxIdToSelectedMap });
  };

  changeSourceFilters = (e: ChangeEvent<HTMLSelectElement>) => {
    const { changeSourceFilters } = this.props;
    const { sourceFiltersCheckboxIdToSelectedMap } = this.state;
    const newCheckboxIdToSelectedMap = {
      ...sourceFiltersCheckboxIdToSelectedMap,
      [e]: !sourceFiltersCheckboxIdToSelectedMap[e],
    };
    const appliedFilters = Object.keys(newCheckboxIdToSelectedMap).filter(
      (id) => newCheckboxIdToSelectedMap[id]
    );
    changeSourceFilters(appliedFilters as string[]);
    this.setState({ sourceFiltersCheckboxIdToSelectedMap: newCheckboxIdToSelectedMap });
  };

  resetFilters = () => {
    const {
      ruleTypes,
      changeRuleTypeFilters,
      changeSeverityFilters,
      sources,
      changeSourceFilters,
    } = this.props;
    const {
      ruleTypesCheckboxIdToSelectedMap,
      severityCheckboxIdToSelectedMap,
      sourceFiltersCheckboxIdToSelectedMap,
    } = this.state;
    const severityFilterIds = Object.values(SEVERITY_OPTIONS).map((severity) => severity.id);
    ruleTypes.forEach((ruleType) => (ruleTypesCheckboxIdToSelectedMap[ruleType] = true));
    severityFilterIds.forEach((severity) => (severityCheckboxIdToSelectedMap[severity] = true));
    sources.forEach((source) => (sourceFiltersCheckboxIdToSelectedMap[source] = true));
    changeRuleTypeFilters(ruleTypes);
    changeSeverityFilters(severityFilterIds);
    changeSourceFilters(sources);
    this.setState({ useDefaultFilters: false });
  };

  render() {
    const { ruleTypes, sources } = this.props;
    const {
      ruleTypesCheckboxIdToSelectedMap,
      severityCheckboxIdToSelectedMap,
      sourceFiltersCheckboxIdToSelectedMap,
    } = this.state;
    return (
      <div>
        <EuiTitle size={'s'}>
          <h3>{'Filter'}</h3>
        </EuiTitle>

        <EuiSpacer size={'s'} />

        <EuiFormRow label={'Rule type'}>
          <EuiCheckboxGroup
            id={'rule-type-filter-checkbox'}
            options={parseStringsToOptions(ruleTypes)}
            onChange={this.changeRuleTypeFilters}
            idToSelectedMap={ruleTypesCheckboxIdToSelectedMap}
          />
        </EuiFormRow>

        <EuiSpacer size={'m'} />

        <EuiFormRow label={'Severity'}>
          <EuiCheckboxGroup
            id={'severity-filter-checkbox'}
            options={Object.values(SEVERITY_OPTIONS)}
            onChange={this.changeSeverityFilters}
            idToSelectedMap={severityCheckboxIdToSelectedMap}
          />
        </EuiFormRow>

        <EuiSpacer size={'m'} />

        <EuiFormRow label={'Source'}>
          <EuiCheckboxGroup
            id={'source-filter-checkbox'}
            options={parseStringsToOptions(sources)}
            onChange={this.changeSourceFilters}
            idToSelectedMap={sourceFiltersCheckboxIdToSelectedMap}
          />
        </EuiFormRow>
      </div>
    );
  }
}
