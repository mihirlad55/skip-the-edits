/**
 * Validate Form and Pass Page Text to Input
 * @param {Object} event Event Object for onsubmit event
 */
function validateForm(event) {
    document.getElementById('txtPage').innerHTML = document.getElementById("page").innerHTML;

    if (document.getElementById("page").innerHTML.trim() == '') {
        alert("Cannot submit a blank essay! Please enter your essay!");
        event.preventDefault();
    }
}