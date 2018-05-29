/**
 * Load User Info into Inputs/Textfields
 */
function loadInfo() { // eslint-disable-line no-unused-vars
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
 * @param {Object} event Event Object from input file onchange
 */
function refreshPreview(event) { // eslint-disable-line no-unused-vars
    document.getElementById('inputFilePath').value = document.
        getElementById('filePicker').value.substr(12);

    let imagePreview = document.getElementById('imagePreview');
    if (event.target.files[0]) {
        imagePreview.src = URL.createObjectURL(event.target.files[0]);
    }
}
