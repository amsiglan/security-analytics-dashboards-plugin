/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { ContentPanel } from '../../../components/ContentPanel';
import { DataStore } from '../../../store/DataStore';
import { correlationRuleStateDefaultValue } from './CorrelationRuleFormModel';
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiButtonEmpty,
  EuiText,
  EuiComboBox,
  EuiFieldText,
  EuiButtonIcon,
  EuiSpacer,
} from '@elastic/eui';
import { ruleTypes } from '../../Rules/utils/constants';
import { CorrelationRule } from '../../../../types';
import { BREADCRUMBS, ROUTES } from '../../../utils/constants';
import { CoreServicesContext } from '../../../components/core_services';

export const CreateCorrelationRule: React.FC = (props) => {
  const correlationStore = DataStore.correlationsStore;
  const submit = (values: any) => {
    correlationStore.createCorrelationRule(values);
  };
  const context = useContext(CoreServicesContext);

  const createForm = (
    props: any,
    correlationSource: CorrelationRule['from'],
    source: 'from' | 'to'
  ) => {
    return (
      <EuiFlexItem grow={false} style={{ minWidth: '50%' }}>
        <EuiFlexGroup direction="column">
          <EuiFlexItem grow={false}>
            <EuiFormRow
              label={
                <EuiText size={'s'}>
                  <strong>Log type</strong>
                </EuiText>
              }
              isInvalid={props.touched[source]?.logType && !!props.errors[source]?.logType}
              error={props.errors[source]?.logType}
            >
              <EuiComboBox
                isInvalid={props.touched[source]?.logType && !!props.errors[source]?.logType}
                placeholder="Select a log type"
                data-test-subj={'rule_type_dropdown'}
                options={ruleTypes.map(({ value, label }) => ({ value, label }))}
                singleSelection={{ asPlainText: true }}
                onChange={(e) => {
                  props.handleChange(`${source}.logType`)(e[0]?.value ? e[0].value : '');
                }}
                onBlur={props.handleBlur(`${source}.logType`)}
                selectedOptions={
                  correlationSource.logType
                    ? [{ value: correlationSource.logType, label: correlationSource.logType }]
                    : []
                }
              />
            </EuiFormRow>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            {correlationSource.conditions.map((condition, index) => {
              return (
                <EuiFlexGroup>
                  <EuiFlexItem grow={false} style={{ minWidth: 200 }}>
                    <EuiFormRow
                      label={
                        <EuiText size={'s'}>
                          <strong>Field name</strong>
                        </EuiText>
                      }
                      // isInvalid={props.touched.from?.conditions && props.touched.from?.conditions[index].name && !!props.errors?.name}
                      // error={props.errors.name}
                      // helpText="Rule name must contain 5-50 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, and underscores."
                    >
                      <EuiFieldText
                        // isInvalid={props.touched.name && !!props.errors.name}
                        placeholder="Enter field name"
                        data-test-subj={'rule_name_field'}
                        onChange={(e) => {
                          props.handleChange(`${source}.conditions[${index}].name`)(e);
                        }}
                        onBlur={props.handleBlur(`${source}.conditions[${index}].name`)}
                        value={condition.name}
                      />
                    </EuiFormRow>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false} style={{ minWidth: 200 }}>
                    <EuiFormRow
                      label={
                        <EuiText size={'s'}>
                          <strong>Field value</strong>
                        </EuiText>
                      }
                      // isInvalid={props.touched.from?.conditions && props.touched.from?.conditions[index].name && !!props.errors?.name}
                      // error={props.errors.name}
                      // helpText="Rule name must contain 5-50 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, and underscores."
                    >
                      <EuiFieldText
                        // isInvalid={props.touched.name && !!props.errors.name}
                        placeholder="Enter field value"
                        data-test-subj={'rule_name_field'}
                        onChange={(e) => {
                          props.handleChange(`${source}.conditions[${index}].value`)(e);
                        }}
                        onBlur={props.handleBlur(`${source}.conditions[${index}].value`)}
                        value={condition.value}
                      />
                    </EuiFormRow>
                  </EuiFlexItem>
                  {index > 0 ? (
                    <>
                      <EuiFlexItem grow={false} style={{ minWidth: 120 }}>
                        <EuiFormRow
                          label={
                            <EuiText size={'s'}>
                              <strong>Condition</strong>
                            </EuiText>
                          }
                          isInvalid={
                            props.touched[source]?.logType && !!props.errors[source]?.logType
                          }
                          error={props.errors[source]?.logType}
                        >
                          <EuiComboBox
                            isInvalid={
                              props.touched[source]?.logType && !!props.errors[source]?.logType
                            }
                            placeholder="Select a log type"
                            data-test-subj={'rule_type_dropdown'}
                            options={['AND', 'OR'].map((condition) => ({
                              value: condition,
                              label: condition,
                            }))}
                            singleSelection={{ asPlainText: true }}
                            onChange={(e) => {
                              props.handleChange(`${source}.conditions[${index}].condition`)(
                                e[0]?.value ? e[0].value : ''
                              );
                            }}
                            onBlur={props.handleBlur(`${source}.conditions[${index}].condition`)}
                            selectedOptions={[
                              { value: condition.condition, label: condition.condition },
                            ]}
                          />
                        </EuiFormRow>
                      </EuiFlexItem>
                      <EuiFlexItem grow={false} style={{ alignSelf: 'flex-end' }}>
                        <EuiButtonIcon
                          iconType={'cross'}
                          color={'danger'}
                          display={'base'}
                          onClick={() => {
                            const newCases = [...correlationSource.conditions];
                            newCases.splice(index, 1);
                            props.setFieldValue(`${source}.conditions`, newCases);
                          }}
                        >
                          Remove
                        </EuiButtonIcon>
                      </EuiFlexItem>
                    </>
                  ) : null}
                </EuiFlexGroup>
              );
            })}
            <EuiButtonEmpty
              style={{ width: 125 }}
              onClick={() => {
                props.setFieldValue(`${source}.conditions`, [
                  ...correlationSource.conditions,
                  ...correlationRuleStateDefaultValue.from.conditions,
                ]);
              }}
            >
              Add condition
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    );
  };

  useEffect(() => {
    context?.chrome.setBreadcrumbs([
      BREADCRUMBS.SECURITY_ANALYTICS,
      BREADCRUMBS.CORRELATIONS,
      BREADCRUMBS.CORRELATIONS_RULE_CREATE,
    ]);
  }, []);

  return (
    <>
      <Formik
        initialValues={{ ...correlationRuleStateDefaultValue }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          submit(values);
        }}
      >
        {({ values: { from, to, name }, ...props }) => (
          <Form>
            <ContentPanel title={'Correlation Rule'}>
              <EuiFormRow
                label={
                  <EuiText size={'s'}>
                    <strong>Rule name</strong>
                  </EuiText>
                }
                isInvalid={props.touched.name && !!props.errors?.name}
                error={props.errors.name}
                helpText="Rule name must contain 5-50 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, and underscores."
              >
                <EuiFieldText
                  isInvalid={props.touched.name && !!props.errors.name}
                  placeholder="Enter rule name"
                  data-test-subj={'rule_name_field'}
                  onChange={(e) => {
                    props.handleChange('name')(e);
                  }}
                  onBlur={props.handleBlur('name')}
                  value={name}
                />
              </EuiFormRow>
              <EuiSpacer />
              <EuiFlexGroup justifyContent="spaceBetween">
                {createForm(props, from, 'from')}
                {createForm(props, to, 'to')}
              </EuiFlexGroup>
            </ContentPanel>
          </Form>
        )}
      </Formik>
      <EuiSpacer size="xl" />
      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButton href={`#${ROUTES.CORRELATIONS}`}>Cancel</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            href={`#${ROUTES.CORRELATIONS}`}
            onClick={() => {
              correlationStore.createCorrelationRule({
                ...correlationRuleStateDefaultValue,
              });
            }}
            fill={true}
          >
            Create
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
