/**
 * Load User Info into Inputs/Textfields
 */
function loadInfo() { // eslint-disable-line no-unused-vars

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
