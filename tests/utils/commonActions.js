/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { waitForRes } = require('./api');
const openSupportDrawer = async (page) => {
  const support = await page.waitForXPath('//li[contains(span, "Support")]');
  await support.click();
  await page.waitForSelector('.ant-drawer-content-wrapper', { visible: true });
};

const openAndWaitForTarget = async (browser, page, elementHandle) => {
  const pageTarget = page.target();
  await elementHandle.click();

  const newTarget = await browser.waitForTarget(
    (target) => target.opener() === pageTarget,
  );
  const newPage = await newTarget.page();

  return newPage;
};

const closeReleaseNote = async (page, { wait = true } = {}) => {
  if (wait) {
    await waitForRes(page, '/notifications');
  }
  try {
    const closeModal = await page.waitForXPath(
      '//div[contains(@class, "ant-notification-notice-message")]/b[contains(text(), "Release")]/ancestor::div[contains(@class, "ant-notification-notice")]/descendant::a[contains(@class, "ant-notification-notice-close")]',
      { timeout: 10000, visible: true },
    );
    await closeModal.click();
    await page.waitForTimeout(1000);
  } catch {}
};

const closeAllBanners = async (page, { wait = true } = {}) => {
  if (wait) {
    const res = await waitForRes(page, '/notifications');
  }
  let bannerLeft = true;
  while (bannerLeft) {
    let bannerLeftBtn;
    try {
      bannerLeftBtn = await page.waitForXPath(
        '//ul[contains(@class, "Notifications_banner-notifications")]//li//button',
        { timeout: 3000 },
      );
      await page.evaluate((ele) => ele.click(), bannerLeftBtn);
      await page.waitForTimeout(100);
    } catch {
      bannerLeft = false;
    }
  }
};

const closeMaintenanceWarning = async (page) => {
  await page.evaluateOnNewDocument(() => {
    setInterval(() => {
      const modalButtons = Array.from(
        document.querySelectorAll('.ant-modal-footer button'),
      );
      if (modalButtons.length) {
        const confirmButton = modalButtons.find(
          (button) => button.textContent === 'OK',
        );
        confirmButton.click();
      }
    }, 15000);
  });
};

const init = async (
  page,
  {
    closeMaintenanceModal = true,
    closeReleaseNoteModal = true,
    closeBanners = true,
  } = {},
) => {
  await page.waitForResponse(
    (response) =>
      response.url().includes('/notifications') && response.status() === 200,
  );
  if (closeMaintenanceModal) {
    await closeMaintenanceWarning(page);
  }
  if (closeReleaseNoteModal) {
    await closeReleaseNote(page, { wait: false });
  }
  if (closeBanners) {
    await closeAllBanners(page, { wait: false });
  }
};

module.exports = {
  init,
  closeReleaseNote,
  closeAllBanners,
  openSupportDrawer,
  openAndWaitForTarget,
};
