/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { StandardLayout } from '../../Components/Layout';
import { errorPageRoutes as routes } from '../../Routes/index';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
function ErrorPage(props) {
  const {
    match: { path },
  } = props;
  const config = {
    observationVars: [],
    initFunc: () => {},
  };
  return (
    <StandardLayout {...config}>
      <Switch>
        {routes.map((item) => (
          <Route
            exact={item.exact || false}
            path={path + item.path}
            key={item.path}
            render={() => <item.component />}
          ></Route>
        ))}
        <Redirect to="/error/404" />
      </Switch>
    </StandardLayout>
  );
}

export default withRouter(ErrorPage);
