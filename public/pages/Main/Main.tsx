/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
// @ts-ignore
import { EuiSideNav, EuiPage, EuiPageBody, EuiPageSideBar } from '@elastic/eui';
import { CoreStart } from 'opensearch-dashboards/public';
import { ServicesConsumer } from '../../services';
import { BrowserServices } from '../../models/interfaces';
import { ROUTES } from '../../utils/constants';
import { CoreServicesConsumer } from '../../components/core_services';
import Dashboards from '../Dashboards';
import Findings from '../Findings';
import Detectors from '../Detectors';
import Categories from '../Categories';
import Rules from '../Rules';
import Overview from '../Overview';
import Alerts from '../Alerts';
import Flyout, { FlyoutData } from '../../components/Flyout/Flyout';

enum Navigation {
  SecurityAnalytics = 'Security Analytics',
  Dashboards = 'Dashboards',
  Findings = 'Findings',
  Detectors = 'Detectors',
  Categories = 'Categories',
  Rules = 'Rules',
  Alerts = 'Alerts',
}

enum Pathname {}

/**
 * Add here the ROUTES for pages on which the EuiPageSideBar should NOT be displayed.
 */
const HIDDEN_NAV_ROUTES: string[] = [];

interface MainProps extends RouteComponentProps {
  landingPage: string;
}

interface MainState {
  flyoutData?: FlyoutData;
}

export default class Main extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      flyoutData: undefined,
    };
  }

  // TODO: Move this to a central store/context so we don't have to pass down setFlyout through components
  setFlyout = (flyoutData: FlyoutData) => {
    const { flyoutData: currentFlyout } = this.state;
    // If current flyout and new flyout are same type, set to null to mimic closing flyout when clicking on same button
    if (currentFlyout && flyoutData && currentFlyout.type === flyoutData.type) {
      this.setState({ flyoutData: undefined });
    } else {
      this.setState({ flyoutData: flyoutData });
    }
  };

  render() {
    const {
      location: { pathname },
    } = this.props;
    const sideNav = [
      {
        name: Navigation.SecurityAnalytics,
        id: 0,
        href: `#${ROUTES.SECURITY_ANALYTICS}`,
        items: [
          {
            name: Navigation.Dashboards,
            id: 1,
            href: `#${ROUTES.DASHBOARDS}`,
          },
          {
            name: Navigation.Findings,
            id: 2,
            href: `#${ROUTES.FINDINGS}`,
          },
          {
            name: Navigation.Detectors,
            id: 3,
            href: `#${ROUTES.DETECTORS}`,
          },
          {
            name: Navigation.Categories,
            id: 4,
            href: `#${ROUTES.CATEGORIES}`,
          },
          {
            name: Navigation.Rules,
            id: 5,
            href: `#${ROUTES.RULES}`,
          },
          {
            name: Navigation.Alerts,
            id: 6,
            href: `#${ROUTES.ALERTS}`,
          },
        ],
      },
    ];
    const { landingPage } = this.props;
    return (
      <CoreServicesConsumer>
        {(core: CoreStart | null) =>
          core && (
            <ServicesConsumer>
              {(services: BrowserServices | null) =>
                services && (
                  <EuiPage restrictWidth={'100%'}>
                    {/* Hide side navigation bar when on any HIDDEN_NAV_ROUTES pages. */}
                    {!HIDDEN_NAV_ROUTES.includes(pathname) && (
                      <EuiPageSideBar style={{ minWidth: 200 }}>
                        <EuiSideNav style={{ width: 200 }} items={sideNav} />
                      </EuiPageSideBar>
                    )}

                    <EuiPageBody>
                      {this.state.flyoutData && (
                        <Flyout
                          flyoutData={{ ...this.state.flyoutData }}
                          onClose={() => this.setState({ flyoutData: undefined })}
                        />
                      )}
                      <Switch>
                        <Route
                          path={ROUTES.DASHBOARDS}
                          render={(props: RouteComponentProps) => <Dashboards {...props} />}
                        />
                        <Route
                          path={ROUTES.FINDINGS}
                          render={(props: RouteComponentProps) => <Findings {...props} />}
                        />
                        <Route
                          path={ROUTES.DETECTORS}
                          render={(props: RouteComponentProps) => <Detectors {...props} />}
                        />
                        <Route
                          path={ROUTES.CATEGORIES}
                          render={(props: RouteComponentProps) => <Categories {...props} />}
                        />
                        <Route
                          path={ROUTES.RULES}
                          render={(props: RouteComponentProps) => <Rules {...props} />}
                        />
                        <Route
                          path={ROUTES.ALERTS}
                          render={(props: RouteComponentProps) => (
                            <Alerts setFlyout={this.setFlyout} {...props} />
                          )}
                        />
                        <Route
                          path={ROUTES.SECURITY_ANALYTICS}
                          render={(props: RouteComponentProps) => <Overview {...props} />}
                        />
                        <Redirect from={'/'} to={landingPage} />
                      </Switch>
                    </EuiPageBody>
                  </EuiPage>
                )
              }
            </ServicesConsumer>
          )
        }
      </CoreServicesConsumer>
    );
  }
}
