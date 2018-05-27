var essayTitle, essayInstructions, essayEditorType;
var isDocumentUploaded = false;

function getFormInfo()
{
    frameUpload.history.replaceState(null, null, "/upload/getRawFileText.php");
    essayTitle = frameUpload.txtTitle.value;
    essayInstructions = frameUpload.txtInstructions.value;
    essayEditorType = frameUpload.selectEditorType.value;
    document.getElementById("frameUpload").style.display = "none";
    isDocumentUploaded = true;
}

function refreshPreview()
{
    if (isDocumentUploaded) {
        framePreview.document.getElementById("page").innerHTML = frameUpload.document.body.innerHTML;
        document.getElementById("framePreview").style.display = "block";
    }
}