/* exported showComment hideComment */

/**
 * Show the comment underneath the Change HTML Card
 * @param {Number} id ID of Change
 */
function showComment(id) {
    let changeEl = document.getElementById('change' + id.toString());
    let commentEl = changeEl.getElementsByClassName('change-comment')[0];
    commentEl.className = 'change-comment';
    parent.sortChanges();
}


/**
 * Hide the comment underneath the Change HTML Card
 * @param {Number} id ID of Change
 */
function hideComment(id) {
    let changeEl = document.getElementById('change' + id.toString());
    let commentEl = changeEl.getElementsByClassName('change-comment')[0];
    commentEl.className = 'change-comment hidden';
    parent.sortChanges();
}
