/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { waitForRes } = require('../../../utils/api');

const waitForAPIResponse = async (page, { url, timeout = 4000 }) => {
  await waitForRes(page, url);
  await page.waitForTimeout(timeout);
};

const getProjectStatsValues = async (page, stats) => {
  const projectStats = [];

  for (let stat of stats) {
    projectStats.push(
      await page.waitForXPath(
        `//ul[contains(@class, 'Cards_charts__meta')]/li/div/span[contains(text(), '${stat}')]`,
        { timeout: 5000 },
      ),
    );
  }

  return projectStats;
};

const getFileSizeChartTooltipData = async (page) => {
  const projectFileSizeChart = await page.waitForXPath(
    `//div[contains(@class, "Cards_graphs__container")]//div[@data-chart-source-type='G2Plot']/descendant::canvas`,
  );
  await projectFileSizeChart.hover();
  await page.waitForTimeout(1000);
  const tooltipMonth = await page.waitForXPath(
    `//div[contains(@class, "Cards_graphs__container")]//div[@data-chart-source-type='G2Plot']/descendant::div[@class='g2-tooltip' and contains(@style, 'visibility: visible')]/div[@class='g2-tooltip-title']`,
  );
  const month = await tooltipMonth.evaluate((node) => node.innerText);

  // an array of chart values for per zone
  const chartValueNodes = await page.$x(
    `//div[contains(@class, "Cards_graphs__container")]//div[@data-chart-source-type='G2Plot']/descendant::div[contains(@class, 'g2-tooltip') and contains(@style, 'visibility: visible')]/descendant::span[@class='g2-tooltip-value']`,
  );

  const chartValues = [];
  for (let node of chartValueNodes) {
    chartValues.push(
      await node.evaluate((n) => n.innerText.match(/[a-zA-Z]+|[0-9]+/g)),
    );
  }

  return { month, chartValues };
};

const getHeatmapColors = async (page, tabs) => {
  const colorTracker = {};
  for (let tab of tabs) {
    const activityTab = await page.waitForXPath(
      `//li[contains(@class, 'Components_tab-switcher__tabs') and contains(text(), '${tab}')]`,
    );
    if (tab !== tabs[0]) await activityTab.click();
    await page.waitForTimeout(1000);

    const legendColors = await page.$x(
      "//li[contains(@class, 'Card_heatmap-legend__color')]",
    );
    const tabColor = await legendColors[3].evaluate(
      (node) => node.style.backgroundColor,
    );
    if (!colorTracker[tabColor]) colorTracker[tabColor] = 1;
  }

  return Object.values(colorTracker);
};

module.exports = {
  waitForAPIResponse,
  getProjectStatsValues,
  getFileSizeChartTooltipData,
  getHeatmapColors,
};
