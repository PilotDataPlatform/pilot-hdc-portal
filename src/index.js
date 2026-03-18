/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import KeyCloakMiddleware from './KeyCloakMiddleware';
import './i18n';
import { ThemeProvider, theme } from './Themes/theme';

// Suppress benign ResizeObserver loop errors triggered by Ant Design components
// during rapid layout changes. This is a known browser-level issue and does not
// affect functionality. See: https://github.com/WICG/resize-observer/issues/38
window.addEventListener('error', (e) => {
  if (
    e.message ===
    'ResizeObserver loop completed with undelivered notifications.'
  ) {
    e.stopImmediatePropagation();
  }
});

ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <KeyCloakMiddleware />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </CookiesProvider>,
  document.getElementById('root'),
);
