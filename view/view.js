/* global richTextField hiddenPage */
/* exported refreshDropDownEditors refreshChanges loadEditMessages rate */


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
    let dropDownEditor = document.getElementById('dropDownEditor');
    editors.forEach(function(user) {
        dropDownEditor.innerHTML += '<option value=' + user.id + '>';
        dropDownEditor.innerHTML += user.firstName + ' ' + user.lastName;
        dropDownEditor.innerHTML += '</option>';
    });
}


/**
 * Enable the richTextField iFrame Document Design Mode
 */
function enableEditMode() { // eslint-disable-line no-unused-vars
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
    let substr1 = string.substr(0, insertIndex);
    let substr2 = string.substr(insertIndex);
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
    let pivot = changesArr[high];
    let i = low - 1;
    let tempChange;

    for (let j = low; j <= high - 1; j++) {
        if (changesArr[j].startOffset <= pivot.startOffset) {
            i++;
            tempChange = changesArr[i];
            changesArr[i] = changesArr[j];
            changesArr[j] = tempChange;
        }
    }

    tempChange = changesArr[i + 1];
    changesArr[i + 1] = changesArr[high];
    changesArr[high] = tempChange;
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
    if (low < high) {
        let pi = partitionChanges(changesArr, low, high);

        quickSortChanges(changesArr, low, pi - 1);
        quickSortChanges(changesArr, pi + 1, high);
    }

    return changesArr;
}


/**
 * Refresh the richTextField Page by Resetting Text and Redisplaying Changes
 */
function refreshChanges() {
    let editorId = document.getElementById('dropDownEditor').value;
    let page = richDoc.getElementById('page');
    let pageHTML = hiddenPage.innerHTML;
    let selection;
    let startOffset;
    let endOffset;

    page.innerHTML = hiddenPage.innerHTML;
    richDoc.getElementById('containerChanges').innerHTML = '';
    changes = [];


    allChanges.forEach(function(change) {
        if (change.editorId == editorId) {
            selection = pageHTML.substr(
                change.startOffset, change.endOffset - change.startOffset
            );
            selection = selection
                .replace('\t', '')
                .replace('\r', '')
                .replace('\n', '');

            if (selection.length > 40) {
                change.condensedSelection = selection.substr(0, 20) +
                    '...' +
                    selection.substr(selection.length - 21);
            } else change.condensedSelection = selection;

            changes.push(change);
        }
    });

    let sortedChanges = changes.slice();

    sortedChanges = quickSortChanges(sortedChanges, 0, changes.length - 1);
    let totalOffset = 0;

    sortedChanges.forEach(function(change) {
        startOffset = parseInt(change.startOffset);
        endOffset = parseInt(change.endOffset);

        pageHTML = insertBetweenString(
            pageHTML, totalOffset + startOffset, '<font color=\'#0abb00\'>'
        );
        totalOffset += '<font color=\'#0abb00\'>'.length;

        pageHTML = insertBetweenString(
            pageHTML, totalOffset + endOffset, '</font>'
        );

        totalOffset += '</font>'.length;
    });

    page.innerHTML = pageHTML;


    let fontElements = page.getElementsByTagName('font');
    let change;
    let HTML;

    for (let i = 0; i < sortedChanges.length; i++) {
        change = sortedChanges[i];
        changesTopPos[change.id] = fontElements[i].offsetTop;
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

    sortChanges();
}


/**
 * Reorganize the top positions of the DOM Cards
 */
function sortChanges() {
    let changeElements = richDoc.getElementsByClassName('change');
    let pElement;
    let cElement;
    let pElementBottom = 0;
    let cId = 0;
    let cTopPos = 0;
    let changeEl0Id = changeElements[0].id;

    changeElements[0].style.top = changes[getChangeIndexFromId(
        changeEl0Id.id.substr(6, changeEl0Id.length - 6)
    )].topPos;

    for (let i = 1; i < changeElements.length; i++) {
        pElement = changeElements[i - 1];
        cElement = changeElements[i];
        cId = cElement.id.substr(6, cElement.id.length - 6);
        pElementBottom = pElement.offsetTop + pElement.offsetHeight;
        cTopPos = changes[getChangeIndexFromId(cId)].topPos;

        if (cTopPos < pElementBottom) {
            cElement.style.top = pElementBottom.toString() + 'px';
        } else cElement.style.top = cTopPos.toString() + 'px';
    }
}


/**
 * Load DOM Edit Messages
 */
function loadEditMessages() {
    let HTML;
    let editMessagesContainer = document
        .getElementById('editMessagesContainer');
    let btnLikeClassNameSuffix = '';
    let btnDislikeClassNameSuffix = '';

    editMessages.forEach(function(editMessage) {
        btnLikeClassNameSuffix = (editMessage.ratingUser == 'LIKE') ?
            ' editMessage-rating-active' : '';
        btnDislikeClassNameSuffix = (editMessage.ratingUser == 'DISLIKE') ?
            ' editMessage-rating-active': '';

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
    editMessages.forEach(function(editMessage) {
        if (editMessage.id == editMessageId) {
            let userRating = editMessage.ratingUser;

            if (rating == userRating) {
                rating = 'NONE';
            }

            $.ajax({
                'url': 'rateEditMessage.php',
                'method': 'POST',
                'data': {
                    'editMessageId': editMessageId,
                    'rating': rating,
                },
            });

            let editMessageEl = document
                .getElementById('editMessage' + editMessageId.toString());
            let ratingSymbolContainer = editMessageEl
                .getElementsByClassName('editMessage-ratingSymbolContainer')[0];
            let likeBtn = ratingSymbolContainer
                .getElementsByClassName('editMessage-btnLike')[0];
            let dislikeBtn = ratingSymbolContainer
                .getElementsByClassName('editMessage-btnDislike')[0];

            likeBtn.className = 'editMessage-btnRate editMessage-btnLike';
            dislikeBtn.className = 'editMessage-btnRate editMessage-btnDislike';

            let rate = {
                'DISLIKE': -1,
                'NONE': 0,
                'LIKE': 1,
            };
            editMessage.ratingTotal +=
                rate[rating] - rate[editMessage.ratingUser];

            if (rating == 'LIKE') {
                likeBtn.className += ' editMessage-rating-active';
            } else if (rating == 'DISLIKE') {
                dislikeBtn.className += ' editMessage-rating-active';
            }

            editMessage.ratingUser = rating;

            ratingSymbolContainer
                .getElementsByClassName('editMessage-rating')[0]
                .innerHTML = editMessage.ratingTotal;
            return;
        }
    });
}
