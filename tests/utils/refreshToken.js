/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
function waitClickRefresh(it,testTitle,getPage){
    it(testTitle,async ()=>{
        const page = getPage();
        await page.waitForSelector('#refresh_modal_refresh',{timeout:6*60*1000});
        await page.waitForTimeout(6000);
        await page.click('#refresh_modal_refresh');
    })
};

module.exports = {waitClickRefresh}