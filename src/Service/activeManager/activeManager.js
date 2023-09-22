/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const period = 60 * 1000;
class ActiveManager {
    _timeoutId;
    _isActive;
    activate() {
        clearTimeout(this._timeoutId);
        this._isActive = true;
        this._timeoutId = setTimeout(() => {
            this._isActive = false;
        }, period);
    }
    isActive(){
        return this._isActive;  
    }
}

const activeManager = new ActiveManager();
export {activeManager};