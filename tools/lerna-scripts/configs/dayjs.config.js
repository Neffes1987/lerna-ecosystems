/* eslint-disable */
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const toObject = require('dayjs/plugin/toObject');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isBetween = require('dayjs/plugin/isBetween');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const utc = require('dayjs/plugin/utc');
const updateLocale = require('dayjs/plugin/updateLocale');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const localeData = require('dayjs/plugin/localeData');

require('dayjs/locale/ru');
require('dayjs/locale/en');

dayjs.extend(relativeTime);
dayjs.extend(toObject);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.locale('ru');

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});
dayjs.updateLocale('ru', {
  monthsShort: 'янв_фев_мар_апр_мая_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
  weekdaysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
});
