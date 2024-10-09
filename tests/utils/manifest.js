/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const ATTR_NAME = 'attr1';
const ATTR_VALS = ['v1', 'v2'];
async function createSimpleManifest(page, manifestName) {
  const createManifestBtn = await page.waitForXPath(
    '//button//span[text()="Create New Attribute Template"]',
  );
  await createManifestBtn.click();
  const inputName = await page.waitForXPath(
    '//span[text()="Attribute Template Name"]/following-sibling::input',
  );
  await inputName.type(manifestName);
  const nextStepBtn = await page.waitForXPath(
    '//button//span[text()="Next Step"]',
  );
  await nextStepBtn.click();
  const addAttrBtn = await page.waitForXPath(
    '//table[contains(@class, "Settings_addManifestTable")]//tr//td//span[text()="Add Attribute"]',
  );
  await addAttrBtn.click();
  const attrName = await page.waitForXPath(
    '//table[contains(@class, "Settings_addManifestTable")]//tr//td[position()=1]//input',
  );
  await attrName.type(ATTR_NAME);
  const attrSelector = await page.waitForXPath(
    '//table[contains(@class, "Settings_addManifestTable")]//tr//td[position()=3]//div[@class="ant-select-selector"]',
  );
  await attrSelector.click();
  await attrSelector.type(ATTR_VALS[0]);
  await page.keyboard.press('Enter');
  await attrSelector.type(ATTR_VALS[1]);
  await page.keyboard.press('Enter');
  const saveOneRowBtn = await page.waitForXPath(
    '//table[contains(@class, "Settings_addManifestTable")]//tr//td//span[contains(@class, "anticon-check")]',
  );
  await saveOneRowBtn.click();
  await page.waitForTimeout(2000);
  const saveManifestBtn = await page.waitForXPath(
    '//div[contains(@class, "ant-tabs-tabpane-active")]//button//span[text()="Create"]',
  );
  await saveManifestBtn.click();
}
async function fillSimpleManifest(page, manifestName) {
  const selectManifest = await page.waitForXPath(
    '//div[contains(@class, "ManifestManagement_annotate_select")]//div[contains(@class, "ant-select-selector")]',
  );
  await selectManifest.click();
  const option = await page.waitForXPath(
    '//div[@class="ant-select-item-option-content" and text()="' +
      manifestName +
      '"]',
  );
  await option.click();
  const selectAttr = await page.waitForXPath(
    '//p[text()="' +
      ATTR_NAME +
      '"]//following-sibling::div//div[contains(@class, "ManifestManagement_annotate_select")]//div[contains(@class, "ant-select-selector")]',
  );
  await selectAttr.click();
  const selectValue = await page.waitForXPath(
    '//div[contains(@class, "ant-select-item-option-content") and text()="' +
      ATTR_VALS[0] +
      '"]',
  );
  await selectValue.click();
  const confirmBtn = await page.waitForXPath(
    '//div[contains(@class, "ant-modal-footer")]//button//span[contains(text(), "Confirm")]',
  );
  await confirmBtn.click();

  await page.waitForTimeout(3000);
}

async function hasExistingManifest(page) {
  await page.waitForSelector('#side-bar');
  await page.click('#side-bar span[aria-label="setting"]');
  await page.click('#tab-file_manifest');

  let hasManifest;
  try {
    hasManifest = await page.waitForXPath(
      '//table[contains(@class, "Settings_manifest_table")]',
      { timeout: 7500 },
    );
  } catch (e) {
    hasManifest = false;
  }
  return hasManifest;
}

async function selectManifestDuringUpload(page, manifestName, attr) {
  await page.click('#manifest');
  const fileAttribute = await page.waitForXPath(
    `//div[contains(@class, "ant-select-item-option-active")]/div[contains(text(), "${manifestName}")]`,
    { timeout: 2500 },
  );
  await fileAttribute.click();
  await page.click('#attr1');
  const attributeOption = await page.waitForXPath(
    `//div[contains(@class, "ant-select-item-option-active")]/div[contains(text(), "${attr}")]`,
    { timeout: 2500 },
  );
  await attributeOption.click();
}

module.exports = {
  createSimpleManifest,
  fillSimpleManifest,
  hasExistingManifest,
  selectManifestDuringUpload,
  ATTR_NAME,
  ATTR_VALS,
};
