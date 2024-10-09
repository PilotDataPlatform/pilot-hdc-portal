/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import moment from 'moment';

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const convertUTCDateToLocalDate = (time) => moment(time).toDate();

const mapMinutesToUnitObj = (mins) => {
  let detail = {};
  if (mins % (60 * 24) === 0) {
    detail['durationUnit'] = 'd';
    detail['duration'] = mins / (60 * 24);
  } else {
    if (mins % 60 === 0) {
      detail['durationUnit'] = 'h';
      detail['duration'] = mins / 60;
    } else {
      detail['durationUnit'] = 'm';
      detail['duration'] = mins;
    }
  }
  return detail;
};
const formatDate = (utc) => {
  const date = convertUTCDateToLocalDate(utc);
  if (!isNaN(date)) {
    const t = moment.tz.guess();
    const timezone = moment.tz(t).zoneAbbr();
    utc = moment(date).format('MMMM DD, YYYY - HH:mm') + ' ' + timezone;
  }
  return utc;
};

const curTimeZoneOffset = () => {
  const t = moment.tz.guess();
  return moment.tz(t).format('Z');
};

const curTimeZoneAbbr = () => {
  const t = moment.tz.guess();
  const timezone = moment.tz(t).zoneAbbr();
  return timezone;
};

const timeConvertWithZulu = (time, type) => {
  if (type === 'date') return moment(time).format('YYYY-MM-DD');
  if (type === 'datetime') return moment(time).format('YYYY-MM-DD HH:mm:ss');
  if (type === 'text') return moment(time).format('MMMM DD, YYYY - HH:mm');
};

const timeConvertWithOffestValue = (time, type) => {
  let date = convertUTCDateToLocalDate(time);

  const momentDate = moment(Date.parse(date));

  if (type === 'date') return momentDate.format('YYYY-MM-DD');
  if (type === 'datetime') return momentDate.format('YYYY-MM-DD HH:mm:ss');
  if (type === 'text') return momentDate.format('MMMM DD, YYYY - HH:mm');
};

const timeConvertWithUTCString = (timestamp, type) => {
  const utcMoment = moment.utc(timestamp);
  let format;
  if (type === 'date') format = 'YYYY-MM-DD';
  if (type === 'datetime') format = 'YYYY-MM-DD HH:mm:ss';
  if (type === 'text') return (format = 'MMMM DD, YYYY - HH:mm');
  return utcMoment.local().format(format);
};

const timeConvert = (time, type) => {
  time = time && time.replace(/ /g, 'T');
  if (time && !time.toLowerCase().endsWith('z')) {
    time = time + 'Z';
  }
  let date = convertUTCDateToLocalDate(time);
  const momentDate = moment(Date.parse(date));

  if (type === 'date') return momentDate.format('YYYY-MM-DD');
  if (type === 'datetime') return momentDate.format('YYYY-MM-DD HH:mm:ss');
  if (type === 'text') return momentDate.format('MMMM DD, YYYY - HH:mm');
};

const CalTimeDiff = (targetTime) => {
  if (targetTime === null) {
    return 'Invalid Timestamp';
  }
  if (targetTime === 0) {
    return '';
  }

  const currentTime = new Date().getTime();
  const timeStampDiff = currentTime - targetTime * 1000;
  const calculatedTimeDiff = timeStampDiff / (1000 * 3600);

  if (calculatedTimeDiff > 0 && calculatedTimeDiff < 1) {
    return `${calculatedTimeDiff.toFixed(1) * 60} ${
      calculatedTimeDiff.toFixed(1) > 0 ? 'minutes' : 'minute'
    } ago`;
  } else if (calculatedTimeDiff >= 1 && calculatedTimeDiff < 24) {
    return `${Math.round(calculatedTimeDiff)} ${
      Math.round(calculatedTimeDiff) > 1 ? 'hours' : 'hour'
    } ago`;
  } else if (calculatedTimeDiff >= 24 && calculatedTimeDiff < 720) {
    return `${Math.round(calculatedTimeDiff / 24)} ${
      Math.round(calculatedTimeDiff / 24) > 1 ? 'days' : 'day'
    } ago`;
  } else if (calculatedTimeDiff >= 720 && calculatedTimeDiff < 8640) {
    return `${Math.round(calculatedTimeDiff / 24 / 30)} ${
      Math.round(calculatedTimeDiff / 24 / 30) > 1 ? 'months' : 'month'
    } ago`;
  } else {
    return `${Math.round(calculatedTimeDiff / 24 / 30 / 12)} ${
      Math.round(calculatedTimeDiff / 24 / 30 / 12) > 1 ? 'years' : 'year'
    } ago`;
  }
};

export {
  timeConvertWithOffestValue,
  convertUTCDateToLocalDate,
  timeConvert,
  timeConvertWithZulu,
  formatDate,
  curTimeZoneOffset,
  curTimeZoneAbbr,
  timezone,
  mapMinutesToUnitObj,
  CalTimeDiff,
};
