/* global richTextField page hiddenPage */

function enableEditMode() {
    richTextField.document.designMode = "On";
    richTextField.document.getElementById("page").innerHTML = hiddenPage.innerHTML;
    hiddenPage.innerHTML = "";
}

function execCmd (command) {
    richTextField.document.execCommand(command, false, null);
}