/* exported showComment hideComment */

/**
 * Show the comment underneath the Change HTML Card
 * @param {Number} id ID of Change
 */
function showComment(id) {
    // Set changeEl to reference of change card
    let changeEl = document.getElementById('change' + id.toString());
    // Set commentEl to reference of change's corresponding comment element
    let commentEl = changeEl.getElementsByClassName('change-comment')[0];
    // Set className of comment element to show comment
    commentEl.className = 'change-comment';

    // Reorganize change cards
    parent.sortChanges();
}


/**
 * Hide the comment underneath the Change HTML Card
 * @param {Number} id ID of Change
 */
function hideComment(id) {
    // Set changeEl to reference of change card
    let changeEl = document.getElementById('change' + id.toString());
    // Set commentEl to reference of change's corresponding comment element
    let commentEl = changeEl.getElementsByClassName('change-comment')[0];
    // Set className of comment element to hide comment
    commentEl.className = 'change-comment hidden';

    // Reorganize change cards
    parent.sortChanges();
}
