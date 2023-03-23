/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useEffect } from 'react';
import { Form, Formik, FormikErrors, FormikTouched } from 'formik';
import { ContentPanel } from '../../../components/ContentPanel';
import { DataStore } from '../../../store/DataStore';
import { correlationRuleStateDefaultValue } from './CorrelationRuleFormModel';
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHorizontalRule,
  EuiButtonEmpty,
  EuiText,
  EuiComboBox,
  EuiFieldText,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { ruleTypes } from '../../Rules/utils/constants';
import { CorrelationRule, CorrelationRuleField } from '../../../../types';
import { BREADCRUMBS, ROUTES } from '../../../utils/constants';
import { CoreServicesContext } from '../../../components/core_services';

export const CreateCorrelationRule: React.FC = (props) => {
  const correlationStore = DataStore.correlationsStore;
  const submit = (values: any) => {
    correlationStore.createCorrelationRule(values);
  };
  const context = useContext(CoreServicesContext);

  const createForm = (
    correlationFields: CorrelationRuleField[],
    touchedInputs: FormikTouched<CorrelationRule>,
    formikErrors: FormikErrors<CorrelationRule>,
    props: any
  ) => {
    return (
      <>
        {correlationFields.map((field, fieldIdx) => {
          const isInvalidLogType =
            touchedInputs.fields?.[fieldIdx]?.logType &&
            !!(formikErrors.fields?.[fieldIdx] as FormikErrors<CorrelationRuleField>)?.logType;

          return (
            <EuiFlexGroup direction="column">
              <EuiFlexItem>
                <EuiFlexGroup justifyContent="spaceBetween">
                  <EuiFlexItem>
                    <EuiTitle size="s">
                      <h3>{`Query ${fieldIdx + 1}`}</h3>
                    </EuiTitle>
                  </EuiFlexItem>
                  {fieldIdx > 1 ? (
                    <EuiFlexItem grow={false}>
                      <EuiButton
                        color="danger"
                        onClick={() => {
                          const newFields = [...correlationFields];
                          newFields.splice(fieldIdx, 1);

                          props.setFieldValue('fields', newFields);
                        }}
                      >
                        Remove query
                      </EuiButton>
                    </EuiFlexItem>
                  ) : null}
                </EuiFlexGroup>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiFormRow
                  label={
                    <EuiText size={'s'}>
                      <strong>Log type</strong>
                    </EuiText>
                  }
                  isInvalid={isInvalidLogType}
                  error={
                    (formikErrors.fields?.[fieldIdx] as FormikErrors<CorrelationRuleField>)?.logType
                  }
                >
                  <EuiComboBox
                    isInvalid={isInvalidLogType}
                    placeholder="Select a log type"
                    data-test-subj={'rule_type_dropdown'}
                    options={ruleTypes.map(({ value, label }) => ({ value, label }))}
                    singleSelection={{ asPlainText: true }}
                    onChange={(e) => {
                      props.handleChange(`fields[${fieldIdx}].logType`)(
                        e[0]?.value ? e[0].value : ''
                      );
                    }}
                    onBlur={props.handleBlur(`fields[${fieldIdx}].logType`)}
                    selectedOptions={
                      field.logType ? [{ value: field.logType, label: field.logType }] : []
                    }
                  />
                </EuiFormRow>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiText size="s">
                  <i>Optional</i>
                </EuiText>
                <EuiSpacer size="s" />
                {field.conditions.map((condition, conditionIdx) => {
                  const fieldNameInput = (
                    <EuiFieldText
                      // isInvalid={props.touched.name && !!props.errors.name}
                      placeholder="Enter field name"
                      data-test-subj={'rule_name_field'}
                      onChange={(e) => {
                        props.handleChange(`fields[${fieldIdx}].conditions[${conditionIdx}].name`)(
                          e
                        );
                      }}
                      onBlur={props.handleBlur(
                        `fields[${fieldIdx}].conditions[${conditionIdx}].name`
                      )}
                      value={condition.name}
                    />
                  );

                  const fieldValueInput = (
                    <EuiFieldText
                      // isInvalid={props.touched.name && !!props.errors.name}
                      placeholder="Enter field value"
                      data-test-subj={'rule_name_field'}
                      onChange={(e) => {
                        props.handleChange(`fields[${fieldIdx}].conditions[${conditionIdx}].value`)(
                          e
                        );
                      }}
                      onBlur={props.handleBlur(
                        `fields[${fieldIdx}].conditions[${conditionIdx}].value`
                      )}
                      value={condition.value}
                    />
                  );

                  const conditionInput = (
                    <EuiComboBox
                      placeholder="Select a log type"
                      data-test-subj={'rule_type_dropdown'}
                      options={['AND', 'OR'].map((condition) => ({
                        value: condition,
                        label: condition,
                      }))}
                      singleSelection={{ asPlainText: true }}
                      onChange={(e) => {
                        props.handleChange(
                          `fields[${fieldIdx}].conditions[${conditionIdx}].condition`
                        )(e[0]?.value ? e[0].value : '');
                      }}
                      onBlur={props.handleBlur(
                        `fields[${fieldIdx}].conditions[${conditionIdx}].condition`
                      )}
                      selectedOptions={[{ value: condition.condition, label: condition.condition }]}
                    />
                  );

                  const removeFieldControl = (
                    <EuiButton
                      color={'danger'}
                      onClick={() => {
                        const newCases = [...field.conditions];
                        newCases.splice(conditionIdx, 1);
                        props.setFieldValue(`fields[${fieldIdx}].conditions`, newCases);
                      }}
                    >
                      Remove condition
                    </EuiButton>
                  );

                  const firstFieldRow = (
                    <>
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
                          {fieldNameInput}
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
                          {fieldValueInput}
                        </EuiFormRow>
                      </EuiFlexItem>
                    </>
                  );

                  const fieldRowWithCondition = (
                    <>
                      <EuiFlexItem grow={false} style={{ minWidth: 120 }}>
                        {conditionInput}
                      </EuiFlexItem>
                      <EuiFlexItem grow={false} style={{ minWidth: 200 }}>
                        {fieldNameInput}
                      </EuiFlexItem>
                      <EuiFlexItem grow={false} style={{ minWidth: 200 }}>
                        {fieldValueInput}
                      </EuiFlexItem>
                      <EuiFlexItem grow={false}>{removeFieldControl}</EuiFlexItem>
                    </>
                  );

                  return (
                    <>
                      <EuiFlexGroup>
                        {conditionIdx === 0 ? firstFieldRow : fieldRowWithCondition}
                      </EuiFlexGroup>
                      <EuiSpacer size="s" />
                    </>
                  );
                })}
                <EuiButtonEmpty
                  style={{ width: 125 }}
                  onClick={() => {
                    props.setFieldValue(`fields[${fieldIdx}].conditions`, [
                      ...field.conditions,
                      ...correlationRuleStateDefaultValue.fields[0].conditions,
                    ]);
                  }}
                >
                  Add condition
                </EuiButtonEmpty>
              </EuiFlexItem>
              <EuiHorizontalRule margin="s" />
            </EuiFlexGroup>
          );
        })}
        <EuiSpacer />
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiButton
              onClick={() => {
                props.setFieldValue('fields', [
                  ...correlationFields,
                  { ...correlationRuleStateDefaultValue.fields[0] },
                ]);
              }}
            >
              Add query
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
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
      <EuiTitle>
        <h1>Create correlation rule</h1>
      </EuiTitle>
      <EuiSpacer size="l" />
      <Formik
        initialValues={{ ...correlationRuleStateDefaultValue }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          submit(values);
        }}
      >
        {({ values: { name, fields }, touched, errors, ...props }) => {
          console.log(fields);
          return (
            <Form>
              <ContentPanel
                title={'Rule details'}
                panelStyles={{ paddingLeft: 10, paddingRight: 10 }}
              >
                <EuiFormRow
                  label={
                    <EuiText size={'s'}>
                      <strong>Rule name</strong>
                    </EuiText>
                  }
                  isInvalid={touched.name && !!errors?.name}
                  error={errors.name}
                  helpText="Rule name must contain 5-50 characters. Valid characters are a-z, A-Z, 0-9, hyphens, spaces, and underscores."
                >
                  <EuiFieldText
                    isInvalid={touched.name && !!errors.name}
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
              </ContentPanel>
              <EuiSpacer size="l" />
              <ContentPanel
                title="Rule queries"
                subTitleText={
                  'Findings across all the log types from queries will be processed to generate correlations uaing the specified fields'
                }
                panelStyles={{ paddingLeft: 10, paddingRight: 10 }}
              >
                {createForm(fields, touched, errors, props)}
              </ContentPanel>
            </Form>
          );
        }}
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
