/* exported validateForm */


/**
 * Validate Form and Pass Page Text to Input
 * @param {Event} event Event Object for onsubmit event
 */
function validateForm(event) {
    // Set richPage to a reference of the page
    let richPage = document.getElementById('page');
    // Set the innerHTML of txtPage to the innerHTML of richPage
    document.getElementById('txtPage').innerHTML = richPage.innerHTML;

    // If removing trailing/leading spaces from richPage results in empty text
    if (richPage.innerHTML.trim() == '') {
        // Notify the user
        alert('Cannot submit a blank essay! Please enter your essay!');
        // Prevent the automatic form submission
        event.preventDefault();
    }
}
