/* exported getCookie formatDate getGetVariable */
/**
 * Get Cookie Data
 * @param {String} name Name of cookie
 * @return {String} Value of cookie
 */
function getCookie(name) {
    let cookieArray = document.cookie.toString().split(';');
    for (let index = 0; index < cookieArray.length; index++) {
        if (cookieArray[index].indexOf(name) != -1) {
            return cookieArray[index]
                .replace(name + '=', '').trim().replace(/\+/g, ' ');
        }
    }
}

/**
 * Format Date Object into String
 * @param {Date} date Date Object
 * @param {String} format Format string with token
 * @return {String} Formatted Date
 */
function formatDate(date, format) {
    let monthList = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    let dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'];

    let hour = date.getHours();
    let period = 'AM';

    if (hour > 11) {
        hour = hour - 12;
        period = 'PM';
    }

    return format
        .replace('%month', monthList[date.getMonth()])
        .replace('%day', dayList[date.getDay()])
        .replace('%year', date.getFullYear())
        .replace('%hour', hour)
        .replace('%period', period)
        .replace('%minute', (
            date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        )
        .replace('%second', date.getSeconds())
        .replace('%date', date.getDate());
}


/**
 * Get Value of GET Request Variable
 * @param {String} variable Name of GET Variable
 * @return {String} Value of GET Request Variable
 */
function getGetVariable(variable) {
    let getUri = document.location.href
        .substr(document.location.href.indexOf('?') + 1);
    let variables = getUri.split('&');

    for (let i = 0; i < variables.length; i++) {
        if (variables[i].indexOf(variable) != -1) {
            return variables[i].replace(variable + '=', '');
        }
    }
}
