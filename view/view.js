/* global richTextField hiddenPage */
/* exported refreshDropDownEditors enableEditMode refreshChanges
   loadEditMessages rate */


/** A Change Object
 *  @typedef {Object} Change
 *  @type {Object}
 *  @property {Number} id - an ID
 *  @property {EnumChangeType} type Type of Change
 *  @property {String} selection Selected text
 *  @property {Number} startOffset Starting offset of selection
 *  @property {Number} endOffset Ending offset of selection
 *  @property {Number} topPos Top offset of selection in document
 *  @property {String} comment Comment relating to change
 */


let allChanges = [];
let editors = [];
let changes = [];
let editMessages = [];
let changesTopPos = [];
const richDoc = richTextField.document;


/**
 * Refresh List of editors in the editor drop down menu
 */
function refreshDropDownEditors() {
    // Set dropDownEditor to a reference of the dropDownEditor element
    let dropDownEditor = document.getElementById('dropDownEditor');
    // For each user in the editor array...
    editors.forEach(function(user) {
        // Append the starting option tag with userId value HTML to dropDown
        dropDownEditor.innerHTML += '<option value=' + user.id + '>';
        // Append the user full name between the option tags to dropDown
        dropDownEditor.innerHTML += user.firstName + ' ' + user.lastName;
        // Append the ending option tag to the dropDown
        dropDownEditor.innerHTML += '</option>';
    });
}


/**
 * Enable the richTextField iFrame Document Design Mode
 */
function enableEditMode() {
    richDoc.designMode = 'On';
    richDoc.getElementById('page')
        .innerHTML = hiddenPage.innerHTML;
}


/**
 * Insert string at an index within a string
 * @param {String} string Source String
 * @param {Number} insertIndex Index position to insert at
 * @param {String} stringToInsert String to Insert
 * @return {String} String with insertion
 */
function insertBetweenString(string, insertIndex, stringToInsert) {
    // Get text leading up to insertIndex
    let substr1 = string.substr(0, insertIndex);
    // Get text from insertIndex to end of string
    let substr2 = string.substr(insertIndex);
    // Return string with stringToInsert added at insertIndex
    return substr1 + stringToInsert + substr2;
}

/**
 * Quicksorting Partition Function to Sort Element at High Index
 * @param {Change[]} changesArr Changes array reference
 * @param {Number} low Starting index
 * @param {Number} high Ending index
 * @return {Number} Index of sorted element
 */
function partitionChanges(changesArr, low, high) {
    // Get change at ending index
    let pivot = changesArr[high];

    // Initialize some variables
    let i = low - 1;
    let tempChange;

    // Go through every element from low to high - 1
    for (let j = low; j <= high - 1; j++) {
        // If change at j comes before change at i
        if (changesArr[j].startOffset <= pivot.startOffset) {
            i++;
            // Swap change at j with change at i
            tempChange = changesArr[i];
            changesArr[i] = changesArr[j];
            changesArr[j] = tempChange;
        }
    }

    // Swap change at (i + 1) with change at high
    tempChange = changesArr[i + 1];
    changesArr[i + 1] = changesArr[high];
    changesArr[high] = tempChange;

    // Return index of sorted change/new pivot
    return i + 1;
}


/**
 * Main quicksorting function
 * @param {Change[]} changesArr Changes array reference
 * @param {Number} low Starting index
 * @param {Number} high Ending index
 * @return {Array} Sorted array of changes
 */
function quickSortChanges(changesArr, low, high) {
    // If starting index is less than ending index
    if (low < high) {
        // Set pivot index equal to sorted position of element at high
        let pi = partitionChanges(changesArr, low, high);

        // Quicksort arrays splitting at pivot index
        quickSortChanges(changesArr, low, pi - 1);
        quickSortChanges(changesArr, pi + 1, high);
    }

    // Return sorted changes array
    return changesArr;
}


/**
 * Refresh the richTextField Page by Resetting Text and Redisplaying Changes
 */
function refreshChanges() {
    // Initialize some variables
    // Get the editorId as the selected option of the dropDownEditor value
    let editorId = document.getElementById('dropDownEditor').value;
    let page = richDoc.getElementById('page');
    let pageHTML = hiddenPage.innerHTML;
    let selection;
    let startOffset;
    let endOffset;

    // Reset page HTML with original essay text
    page.innerHTML = hiddenPage.innerHTML;
    // Clear the containerChanges element's innerHTML
    richDoc.getElementById('containerChanges').innerHTML = '';
    // Set changes to an empty array
    changes = [];

    // Go through every change in the allChanges array
    allChanges.forEach(function(change) {
        // If the editorId of the change matches the selected editorId...
        if (change.editorId == editorId) {
            // Get the selection text of the change from the pageHTML
            selection = pageHTML.substr(
                change.startOffset, change.endOffset - change.startOffset
            );
            // Remove tabs, carriage returns, newline characters from selection
            selection = selection
                .replace('\t', '')
                .replace('\r', '')
                .replace('\n', '');

            // If the selection is longer than 40 characters...
            if (selection.length > 40) {
                // Set condensedSelection: '[first 20 chars]...[last 20 chars]'
                change.condensedSelection = selection.substr(0, 20) +
                    '...' +
                    selection.substr(selection.length - 21);
            } else {
                // Set condensedSelection to selection
                change.condensedSelection = selection;
            }

            // Push the change object to the changes array
            changes.push(change);
        }
    });

    // Set the sortedChanges array equal to a copy of the changes array
    let sortedChanges = changes.slice();

    // Set sortedChanges equal to itself quicksorted
    sortedChanges = quickSortChanges(sortedChanges, 0, changes.length - 1);

    // Initialize totalOffset at 0
    let totalOffset = 0;

    // Go through every change in the sorted array of changes...
    sortedChanges.forEach(function(change) {
        // Get the start/endOffsets
        startOffset = parseInt(change.startOffset);
        endOffset = parseInt(change.endOffset);

        // Insert starting font tag at totalOffset + startOffset
        pageHTML = insertBetweenString(
            pageHTML, totalOffset + startOffset, '<font color=\'#0abb00\'>'
        );

        // Increment totalOffset by length of added text
        totalOffset += '<font color=\'#0abb00\'>'.length;

        // Insert ending font tag at totalOffset + endOffset
        pageHTML = insertBetweenString(
            pageHTML, totalOffset + endOffset, '</font>'
        );

        // Increment totalOffset by length of added text
        totalOffset += '</font>'.length;
    });

    // Update the page innerHTML
    page.innerHTML = pageHTML;

    // Initialize some variables
    let fontElements = page.getElementsByTagName('font');
    let change;
    let HTML;

    // For every change in the sortedChanges array...
    for (let i = 0; i < sortedChanges.length; i++) {
        // Set change equal to the sortedChange with Index i
        change = sortedChanges[i];
        // Set top pos of change to top offset of corresponding font element
        changesTopPos[change.id] = fontElements[i].offsetTop;

        // Create HTML for change card
        HTML =
            '<div class=\'change\' contentEditable=\'false\' style=\'top:' +
                fontElements[i].offsetTop.toString() + 'px\' id=\'change' +
                change.id.toString() + '\' onmouseover=\'showComment(' +
                change.id.toString() + ');\' onmouseout=\'hideComment(' +
                change.id.toString() + ');\'>' +
                    '<div class=\'change-main-content\'>' +
                    '<img class=\'change-picture\' src=\'/img/edit-icons/' +
                        change.type.toLowerCase() + '.png\'>' +
                    '<p class=\'change-selection\'>' +
                        change.condensedSelection +
                    '</p>' +
                '</div>' +
                '<p class=\'change-comment hidden\'>' + change.comment +
                '</p>' +
            '</div>';

        richDoc
            .getElementById('containerChanges')
            .innerHTML += HTML;
    }

    // Reorganize change cards
    sortChanges();
}


/**
 * Reorganize the top positions of the DOM Cards
 */
function sortChanges() {
    // Initialize some variables
    let changeElements = richDoc.getElementsByClassName('change');
    let pElement;
    let cElement;
    let pElementBottom = 0;
    let cId = 0;
    let cTopPos = 0;
    // Get the ID of the first change card
    let changeEl0Id = changeElements[0].id;

    // Set top position of first change card to its selection's top position
    changeElements[0].style.top = changes[getChangeIndexFromId(
        changeEl0Id.id.substr(6, changeEl0Id.length - 6)
    )].topPos;

    // Go through every change HTML card, starting with the second
    for (let i = 1; i < changeElements.length; i++) {
        // Set the previous element reference to pElement
        pElement = changeElements[i - 1];
        // Set the current element reference to cElement
        cElement = changeElements[i];
        // Set the current ID of the change to cId
        cId = cElement.id.substr(6, cElement.id.length - 6);
        // Get the bottom position of the previous element
        pElementBottom = pElement.offsetTop + pElement.offsetHeight;
        // Get the top position of the current element's selection
        cTopPos = changes[getChangeIndexFromId(cId)].topPos;

        // If the top of the current element comes before bottom of previous
        if (cTopPos < pElementBottom) {
            // Set top position of current element to bottom pos of previous
            cElement.style.top = pElementBottom.toString() + 'px';
        } else {
            // Set top position of current element at its selection's top pos
            cElement.style.top = cTopPos.toString() + 'px';
        }
    }
}


/**
 * Load DOM Edit Messages
 */
function loadEditMessages() {
    // Initialize some variables
    let HTML;
    let editMessagesContainer = document
        .getElementById('editMessagesContainer');
    let btnLikeClassNameSuffix = '';
    let btnDislikeClassNameSuffix = '';

    // For every editMessage in the editMessages Array
    editMessages.forEach(function(editMessage) {
        // If user liked this message set like btn class suffix to this
        btnLikeClassNameSuffix = (editMessage.ratingUser == 'LIKE') ?
            ' editMessage-rating-active' : '';
        // If user disliked this message, set dislike btn class suffix to this
        btnDislikeClassNameSuffix = (editMessage.ratingUser == 'DISLIKE') ?
            ' editMessage-rating-active': '';

        // Create HTML for editMessage
        /* eslint-disable max-len */
        HTML = '<div class="editMessage" id="editMessage' + editMessage.id.toString() + '>' +
                    '<div class="editMessage-ratingSymbolContainer">' +
                        '<div class="editMessage-btnRate editMessage-btnLike' + btnLikeClassNameSuffix + '" onclick="rate(' + editMessage.id.toString() + ', \'LIKE\');">▲</div>' +
                        '<div class="editMessage-rating">' + editMessage.ratingTotal.toString() + '</div>' +
                        '<div class="editMessage-btnRate editMessage-btnDislike' + btnDislikeClassNameSuffix + '" onclick="rate(' + editMessage.id.toString() + ', \'DISLIKE\');">▼</div>' +
                    '</div>' +
                    '<div class="editMessage-message">' + editMessage.message + '</div>' +
                    '<div class="editMessage-editorProfileBox">' +
                        '<a href="/profile?id="' + editMessage.editorId + '>' +
                            '<object class="editMessage-profilePicture" data="/img/profile/' + editMessage.editorId.toString() + '.png" type="image/png">' +
                                '<img class="editMessage-profilePicture" src="/img/profile/default.jpeg">' +
                            '</object>' +
                        '</a>' +
                        '<div class="editMessage-editorName">' + editMessage.editorFullName + '</div>' +
                        '<div class="editMessage-editorProfession">' + editMessage.profession + '</div>' +
                        '<div class="editMessage-approvalRating">' + (editMessage.approvalRating * 100.0).toString() + '% Approval Rate</div>' +
                    '</div>' +
                '</div>';
        /* eslint-enable max-len */
        // Append editMessage HTML to editMessagesContainer HTML
        editMessagesContainer.innerHTML += HTML;
    });
}


/**
 *
 * Send AJAX Request to PHP to register user rating if necessary
 * @param {number} editMessageId Id of Edit Message
 * @param {string} rating enum ('LIKE' or 'DISLIKE')
 */
function rate(editMessageId, rating) {
    // For every editMessage in the editMessages array
    editMessages.forEach(function(editMessage) {
        // If the editMessage id matches the given editMessageId...
        if (editMessage.id == editMessageId) {
            // Set userRating equal to the user's current rating for this msg
            let userRating = editMessage.ratingUser;

            // If user clicked on same rating symbol...
            if (rating == userRating) {
                // Set rating to 'NONE'
                rating = 'NONE';
            }

            // Create an AJAX Request to send new rating
            $.ajax({
                'url': 'rateEditMessage.php',
                'method': 'POST',
                'data': {
                    'editMessageId': editMessageId,
                    'rating': rating,
                },
            });

            // Initialize some element variables
            let editMessageEl = document
                .getElementById('editMessage' + editMessageId.toString());
            let ratingSymbolContainer = editMessageEl
                .getElementsByClassName('editMessage-ratingSymbolContainer')[0];
            let likeBtn = ratingSymbolContainer
                .getElementsByClassName('editMessage-btnLike')[0];
            let dislikeBtn = ratingSymbolContainer
                .getElementsByClassName('editMessage-btnDislike')[0];

            // Reset the classnames of the like and dislike buttons
            likeBtn.className = 'editMessage-btnRate editMessage-btnLike';
            dislikeBtn.className = 'editMessage-btnRate editMessage-btnDislike';

            // Create rate enumeration with options and corresponding values
            let rate = {
                'DISLIKE': -1,
                'NONE': 0,
                'LIKE': 1,
            };

            // Update the total rating of message based on user's new rating
            editMessage.ratingTotal +=
                rate[rating] - rate[editMessage.ratingUser];

            // If user rated 'LIKE'
            if (rating == 'LIKE') {
                // Append this class to the likeBtn
                likeBtn.className += ' editMessage-rating-active';
            // Else if user rated 'DISLIKE'
            } else if (rating == 'DISLIKE') {
                // Append this class to the dislikeBtn
                dislikeBtn.className += ' editMessage-rating-active';
            }

            // Update the user's rating in the editMessage object
            editMessage.ratingUser = rating;

            // Set the new rating total in the HTML
            ratingSymbolContainer
                .getElementsByClassName('editMessage-rating')[0]
                .innerHTML = editMessage.ratingTotal;
            return;
        }
    });
}
