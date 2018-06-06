/* exported getCookie formatDate getGetVariable */
/**
 * Get Cookie Data
 * @param {String} name Name of cookie
 * @return {String} Value of cookie
 */
function getCookie(name) {
    // Split the cookie string at the ';' into the array cookieArray
    let cookieArray = document.cookie.toString().split(';');
    // Go through every cookie in the array
    for (let index = 0; index < cookieArray.length; index++) {
        // If the cookie's name contains the given name
        if (cookieArray[index].indexOf(name) != -1) {
            // Remove cookie name and '=' from the cookie line and return it
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
    // Initialize some variables
    let monthList = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    let dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'];
    let hour = date.getHours();
    let period = 'AM';

    // If hour is greater than 11, subtract 12 to convert from 24h time to 12h
    if (hour > 11) {
        hour = hour - 12;
        // Set the period to PM
        period = 'PM';
    }

    // Replace the symbols with date values and return it
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
    // Get the part of the URL after the '?' sign
    let getUri = document.location.href
        .substr(document.location.href.indexOf('?') + 1);
    // Split getUri at every '&' into the variables array
    let variables = getUri.split('&');

    // Go through every variable in the variables array
    for (let i = 0; i < variables.length; i++) {
        // If the variable contains the given variable name...
        if (variables[i].indexOf(variable) != -1) {
            // Remove the variable name and '=' sign, and return the value
            return variables[i].replace(variable + '=', '');
        }
    }
}
