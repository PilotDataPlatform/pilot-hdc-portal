/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const {
  selectGreenroomFile,
  deleteAction,
  copyFileToCore,
  folderName,
} = require('./greenroomActions');
const fs = require('fs');
const moment = require('moment-timezone');
const createFolder = async function (page, folderNamePara = null) {
  const folderName = folderNamePara ? folderNamePara : `${moment().unix()}`;
  await page.waitForSelector('#files_table > div > div > table > tbody > tr');
  const newFolderBtn = await page.waitForXPath(
    '//button//span[contains(text(), "New Folder")]',
  );
  await newFolderBtn.click();
  await page.type('#folderName', folderName);
  const createFolderBtn = await page.waitForXPath(
    '//div[@class="ant-modal-footer"]//button//span[contains(text(), "Create")]',
  );
  await createFolderBtn.click();
  await page.waitForTimeout(2000);
  try {
    const closeBtn = await page.waitForXPath(
      '//span[@class="ant-modal-close-x"]',
    );
    await closeBtn.click();
  } catch (e) {
    console.log('close btn not found');
  }
  return folderName;
};
const clickIntoFolder = async function (page, folderName) {
  const folderNameElm = await page.waitForXPath(
    `//table//td//span[text()="${folderName}"]`,
  );
  await folderNameElm.click();
};
const generateLocalFile = async function (sourcePath, sourceFile) {
  let fileArr = sourceFile.split('.');
  let ext = fileArr.length ? fileArr[fileArr.length - 1] : null;
  const destFileName = `${moment().unix()}${ext ? '.' + ext : ''}`;
  console.log('destFileName', destFileName);
  try {
    const tempFolderExist = await fs.existsSync(
      `${process.cwd()}/tests/uploads/temp`,
    );
    if (!tempFolderExist) {
      await fs.mkdirSync(`${process.cwd()}/tests/uploads/temp`);
    }
    await fs.copyFileSync(
      `${sourcePath}/${sourceFile}`,
      `${process.cwd()}/tests/uploads/temp/${destFileName}`,
    );
    return destFileName;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const removeLocalFile = async function (fileName) {
  try {
    await fs.rmSync(`${process.cwd()}/tests/uploads/temp/${fileName}`);
  } catch (err) {
    console.log('no file found under temp directory : ' + fileName);
  }
};
const removeExistFile = async function (page, fileName) {
  await page.waitForTimeout(6000);
  let searchBtn = await page.waitForXPath(
    "//span[contains(@class,'search')]//parent::span",
  );
  await searchBtn.click();
  let nameInput = await page.waitForXPath(
    '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
    { visible: true },
  );
  await nameInput.type(fileName);
  let searchFileBtn = await page.waitForXPath(
    '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
    { visible: true },
  );
  await searchFileBtn.click();
  await page.waitForTimeout(2000);
  let fileInTable = await page.$x(
    `//td[@class='ant-table-cell']//span[text()='${fileName}']`,
  );

  if (fileInTable.length !== 0) {
    await selectGreenroomFile(page, fileName);
    await deleteAction(page);
  }
};

const removeExistCollection = async function (page, collectionName) {
  await page.waitForTimeout(6000);
  const collection = await page.waitForXPath(
    `//span[@aria-label='star']//ancestor::span[text()='${collectionName}']`,
  );
  await collection.click();
  await page.waitForTimeout(3000);
  const deleteBtn = await page.waitForXPath(
    "//span[text()='Delete Collection']//ancestor::button",
  );
  await deleteBtn.click();
  const confirmBtn = await page.waitForXPath(
    "//div[@class='ant-modal-footer']//button//span[text()='Delete']//ancestor::button",
  );
  await confirmBtn.click();
};

const copyExistFile = async function (page, user, fileName, folderName) {
  await page.waitForTimeout(6000);
  let searchBtn = await page.waitForXPath(
    "//span[contains(@class,'search')]//parent::span",
  );
  await searchBtn.click();
  let nameInput = await page.waitForXPath(
    '//div[contains(@class, "ant-dropdown")]//input[@placeholder="Search name"]',
    { visible: true },
  );
  await nameInput.type(fileName);
  let searchFileBtn = await page.waitForXPath(
    '//div[contains(@class, "ant-dropdown")]//button[contains(@class, "ant-btn-primary")]',
    { visible: true },
  );
  await searchFileBtn.click();
  await page.waitForTimeout(2000);
  let fileInTable = await page.$x(
    `//td[@class='ant-table-cell']//span[text()='${fileName}']`,
  );

  if (fileInTable.length !== 0) {
    await copyFileToCore(page, user, fileName, folderName);
  }
};

module.exports = {
  createFolder,
  clickIntoFolder,
  generateLocalFile,
  copyExistFile,
  removeExistFile,
  removeLocalFile,
  removeExistCollection,
};
