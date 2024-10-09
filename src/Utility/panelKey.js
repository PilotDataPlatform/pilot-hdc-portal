/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
export const checkIsVirtualFolder = (panelKey) => {
  if (!panelKey) {
    return false;
  }
  return !(
    panelKey.includes('trash') ||
    panelKey.startsWith('greenroom') ||
    panelKey.startsWith('core')
  );
};

export const checkUserHomeFolder = (tabPanelKey) => {
  return tabPanelKey === 'greenroom-home' || tabPanelKey === 'core-home';
};

export const checkRootFolder = (tabPanelKey) => {
  return tabPanelKey === 'greenroom' || tabPanelKey === 'core';
};

export const checkGreenAndCore = (tabPanelKey) => {
  return checkUserHomeFolder(tabPanelKey) || checkRootFolder(tabPanelKey);
};
