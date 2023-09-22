/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
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
const { projectCode } = dataConfig.adminCanvas;
jest.setTimeout(700000000);

describe('1.3 Canvas Page - Charts', () => {
  beforeAll(async () => {
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.goto(baseUrl);
    await page.setViewport({ width: 1080, height: 900 });
    await login(page, 'admin');
    await init(page, { closeBanners: false });
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

    const stats = [
      'Total Files',
      'Total File Size',
      'Project Members',
      'Uploaded',
      'Downloaded',
    ];
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

    const tabs = ['downloads', 'upload', 'deletion', 'copy'];
    const heatmapColors = await getHeatmapColors(page, tabs);

    expect(heatmapColors.length).toBe(tabs.length);
  });
});
