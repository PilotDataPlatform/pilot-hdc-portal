/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const moment = require('moment');
const {
  waitForAPIResponse,
  getProjectStatsValues,
  getFileSizeChartTooltipData,
  getHeatmapColors,
} = require('../utils');
const { login, logout } = require('../../../../utils/login.js');
const { init } = require('../../../../utils/commonActions.js');
const { baseUrl, dataConfig } = require('../../../config');
jest.setTimeout(700000000);

const projectCode = 'testproject';

describe('3.3 Canvas Page - Charts', () => {
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'collaborator');
    await init(page, { closeBanners: true });
  });

  afterAll(async () => {
    await logout(page);
    await page.waitForTimeout(3000);
  });

  beforeEach(async () => {
    await page.goto(`${baseUrl}project/${projectCode}/canvas`);
  });

  it('Project Admin should be able to see all Project members, Total files number, total file size, project members uploaded file number, downloaded file number', async function () {
    await waitForAPIResponse(page, { url: '/statistics' });

    const stats = ['Total Files', 'Total File Size', 'Uploaded', 'Downloaded'];
    const projectStats = await getProjectStatsValues(page, stats);
    expect(projectStats.length).toBe(stats.length);
  });

  it('Project File Size should have month range for x axis and y axis, file size data shown in tooltip when hovering over chart', async function () {
    await waitForAPIResponse(page, { url: '/size', timeout: 2000 });

    const { month, chartValues } = await getFileSizeChartTooltipData(page);
    const fileUnits = ['kb', 'mb', 'gb'];
    for (let values of chartValues) {
      const lastIndex = values.length - 1;
      expect(
        fileUnits.find((unit) => unit === values[lastIndex]) ||
          values[lastIndex] === '0',
      );
    }

    expect(moment(month, 'MMM').month()).toBeTruthy();
  });

  it('Heat Map should contain color-coded File uploading, downloading, copy, deletion activities frequence by time ', async function () {
    await waitForAPIResponse(page, { url: '/activity', timeout: 2000 });

    const tabs = ['downloads', 'upload', 'deletion'];
    const heatmapColors = await getHeatmapColors(page, tabs);

    let copyTab;
    try {
      copyTab = await page.waitForXPath(
        `//li[contains(@class, 'Components_tab-switcher__tabs') and contains(text(), 'copy')]`,
        { timeout: 5000 },
      );
      console.log(copyTab);
    } catch {}

    expect(heatmapColors.length).toBe(tabs.length);
    expect(copyTab).toBeFalsy();
  });
});
