/* exported loadInfo refreshPreview */


/**
 * Load User Info into Inputs/Textfields
 */
function loadInfo() {
    // Update textboxes with current profile details
    document.getElementById('txtFirstName').value = info.firstName;
    document.getElementById('txtLastName').value = info.lastName;
    document.getElementById('txtProfession').value = info.profession;
    document.getElementById('txtLocation').value = info.location;
    document.getElementById('txtTwitterHandle').value = info.twitterHandle;
    document.getElementById('txtWebsite').value = info.website;
    document.getElementById('txtBio').value = info.bio;
    document.getElementById('imagePreview').src = '/img/profile/' +
        info.userId.toString() + '.png';
}

/**
 * Refresh Uploaded Image Preview
 * @param {Event} event Event Object from input file onchange
 */
function refreshPreview(event) {
    // Get filename of uploaded file
    document.getElementById('inputFilePath').value = document.
        getElementById('filePicker').value.substr(12);

    // Get reference to img imagePreview
    let imagePreview = document.getElementById('imagePreview');

    // If a file has been uploaded...
    if (event.target.files[0]) {
        // Set the src of the img element to the Object URL of uploaded file
        imagePreview.src = URL.createObjectURL(event.target.files[0]);
    }
}
