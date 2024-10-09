/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
var worker = new Worker('/js/time-worker.js');
var workerTimer = {
  id: 0,
  callbacks: {},
  setInterval: function (cb, interval, context) {
    this.id++;
    var id = this.id;
    this.callbacks[id] = { fn: cb, context: context };
    worker.postMessage({
      command: 'interval:start',
      interval: interval,
      id: id,
    });
    return id;
  },
  onMessage: function (e) {
    switch (e.data.message) {
      case 'interval:tick':
        var callback = this.callbacks[e.data.id];
        if (callback && callback.fn) callback.fn.apply(callback.context);
        break;
      case 'interval:cleared':
        delete this.callbacks[e.data.id];
        break;
    }
  },
  clearInterval: function (id) {
    worker.postMessage({ command: 'interval:clear', id: id });
  },
};
worker.onmessage = workerTimer.onMessage.bind(workerTimer);
export default workerTimer;
