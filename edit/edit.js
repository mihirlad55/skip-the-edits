/* global richTextField page hiddenPage */

function enableEditMode() {
    richTextField.document.designMode = "On";
    richTextField.document.getElementById("page").innerHTML = hiddenPage.innerHTML;
    hiddenPage.innerHTML = "";
}

function execCmd (command, args) {
    richTextField.document.execCommand(command, false, args);
}

function highlight(color)
{
    execCmd('backColor', color);
}