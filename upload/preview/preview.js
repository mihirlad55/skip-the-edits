/* exported validateForm */


/**
 * Validate Form and Pass Page Text to Input
 * @param {Event} event Event Object for onsubmit event
 */
function validateForm(event) {
    let richPage = document.getElementById('page');
    document.getElementById('txtPage').innerHTML = richPage.innerHTML;

    if (richPage.innerHTML.trim() == '') {
        alert('Cannot submit a blank essay! Please enter your essay!');
        event.preventDefault();
    }
}
