function loadInfo() {
    document.getElementById("pName").innerHTML = info.fullName;
    document.getElementById("pProfession").innerHTML = info.profession;
    document.getElementById("pApprovalRate").innerHTML = parseInt(info.approvalRating).toString() + "% Approval Rate";
    document.getElementById("pNumberOfRatings").innerHTML = info.numberOfRatings + " Ratings";
    document.getElementById("pNumberOfEdits").innerHTML = info.numberOfEdits + " Edits";
}