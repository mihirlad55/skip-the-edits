/* exported loadInfo */


/**
 * Load Profile Info into page
 */
function loadInfo() {
    document.getElementById('pName').innerHTML = info.fullName;
    document.getElementById('pProfession').innerHTML = info.profession;
    document.getElementById('pApprovalRate').innerHTML = parseInt(
        info.approvalRating).toString() + '% Approval Rate';
    document.getElementById('pNumberOfRatings').innerHTML = info
        .numberOfRatings + ' Ratings';
    document.getElementById('pNumberOfEdits').innerHTML = info
        .numberOfEdits + ' Edits';
    document.getElementById('pBio').innerHTML = info.bio;
    document.getElementById('pLocation').innerHTML = info.location;
    document.getElementById('pWebsite').innerHTML = info.website;
    document.getElementById('pTwitterHandle').innerHTML = '@'
     + info.twitterHandle;
    document.getElementById('pNumberOfProfileViews').innerHTML = info
        .profileViews + ((parseInt(info.profileViews) == 1) ? ' Profile View' :
        ' Profile Views');
    document.getElementById('profilePicture').src = '/img/profile/'
        + info.id.toString() + '.png';
}
