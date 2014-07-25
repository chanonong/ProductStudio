/*!
YUI 3.17.2 (build 9b67fe7)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('datatype-date-parse', function (Y, NAME) {

var LANG = Y.Lang;

function createUtcDate(fullYear, month, date, hours, minutes, seconds, milliseconds) {
    var utcDate = new Date(0);
    utcDate.setUTCFullYear(fullYear);
    utcDate.setUTCMonth(month);
    utcDate.setUTCDate(date);
    utcDate.setUTCHours(hours);
    utcDate.setUTCMinutes(minutes);
    utcDate.setUTCSeconds(seconds);
    utcDate.setUTCMilliseconds(milliseconds);
    return utcDate;
}

/*!
 * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
 * © 2011 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
function parseIso8601Date(data) {
    var date,
        struct,
        minutesOffset = 0,
        numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];

    if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(data))) {
        // avoid NaN dates caused by undefined values being passed to createUtcDate
        for (var i = 0, k; (k = numericKeys[i]); ++i) {
            struct[k] = +struct[k] || 0;
        }

        // allow undefined days and months
        struct[2] = (+struct[2] || 1) - 1;
        struct[3] = +struct[3] || 1;

        if (struct[8] !== 'Z' && struct[9] !== undefined) {
            minutesOffset = struct[10] * 60 + struct[11];

            if (struct[9] === '+') {
                minutesOffset = 0 - minutesOffset;
            }
        }
        date = createUtcDate(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
    } else {
        date = null;
    }
    return date;
}

/**
 * Parse number submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
Y.mix(Y.namespace("Date"), {
    /**
     * Converts data to type Date.
     *
     * @method parse
     * @param data {Date|Number|String} date object, timestamp (string or number), or string parsable by Date.parse
     * @return {Date} a Date object or null if unable to parse
     */
    parse: function(data) {
        var val = new Date(+data || data);
        if (Y.Lang.isDate(val)) {
            return val;
        } else {
            // Not a valid date, try to parse using ISO 8601
            val = parseIso8601Date(data);
            return val;
        }
    }
});

// Add Parsers shortcut
Y.namespace("Parsers").date = Y.Date.parse;

Y.namespace("DataType");
Y.DataType.Date = Y.Date;


}, '3.17.2');
