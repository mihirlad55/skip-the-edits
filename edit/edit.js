/* global richTextField hiddenPage */
/* exported createChangeHTML showPanelFinalMessage showPanelMark postChanges
   removeChange */

/**
 * Enumeration of types of changes
 * @typedef {Object} EnumChangeType
 * @type {Object}
 */

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


let changes = [];
let id = -1;
let richDoc = richTextField.document;
let page = richDoc.getElementById('page');

let EnumChangeType = {
    'CLICHE': 0,
    'DICTION': 1,
    'GRAMMAR': 2,
    'LENGTH': 3,
    'OVERUSED': 4,
    'PLAGIARISM': 5,
    'PRONOUN': 6,
    'REPEATS': 7,
    'STYLE': 8,
    'THESAURUS': 9,
};


window.onbeforeunload = function() {
return true;
};

/**
 * Get the string name of the enumeration EnumChangeType
 * @param {EnumChangeType} type EnumChangeType
 * @return {String} String Version of Enum Type
 */
function getEnumChangeTypeString(type) {
    switch (type) {
        case EnumChangeType.CLICHE: return 'Cliche';
        case EnumChangeType.DICTION: return 'Diction';
        case EnumChangeType.GRAMMAR: return 'Length';
        case EnumChangeType.LENGTH: return 'Length';
        case EnumChangeType.OVERUSED: return 'Overused';
        case EnumChangeType.PLAGIARISM: return 'Plagiarism';
        case EnumChangeType.PRONOUN: return 'Pronoun';
        case EnumChangeType.REPEATS: return 'Repeats';
        case EnumChangeType.STYLE: return 'Style';
        case EnumChangeType.THESAURUS: return 'Thesaurus';
        default: return;
    }
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
 * Execute a command on the richTextField IFrame Document
 * @param {String} command Design Mode Command to execute
 * @param {String} args Optional arguments for command
 */
function execCmd(command, args) {
    richDoc.execCommand(command, false, args);
}


/**
 * Get Selection Range from the richTextField IFrame Document
 * @return {Object} Selection Object
 */
function getSelectionRange() {
    return richDoc.getSelection().getRangeAt(0);
}

/**
 * Create and Append the Card HTML for new changes
 * @param {EnumChangeType} type Type of change
 */
function createChangeHTML(type) {
    let selectionRange = getSelectionRange();
    let startOffset = selectionRange.startOffset;
    let endOffset = selectionRange.endOffset;

    let selectionStartElement = selectionRange.startContainer;
    let selectionEndElement = selectionRange.endContainer;
    let currentSibling = richDoc.getElementById('page')
        .firstChild;
    let totalStartOffset = 0;
    let totalEndOffset = 0;

    if (page.getElementsByTagName('font')[0]) {
            while ( currentSibling != selectionStartElement) {
                if (currentSibling.nodeName == '#text') {
                        totalStartOffset += currentSibling.length;
                    }

                if (!currentSibling.length && currentSibling.firstChild) {
                    currentSibling = currentSibling.firstChild;
                } else if (!currentSibling.nextSibling &&
                    currentSibling.parentNode != page) {
                    if (currentSibling.parentNode.nextSibling) {
                        currentSibling = currentSibling.parentNode.nextSibling;
                    } else break;
                } else currentSibling = currentSibling.nextSibling;
            }

        currentSibling = page.firstChild;

        while ( currentSibling != selectionEndElement ) {
            if (currentSibling.nodeName == '#text') {
                totalEndOffset += currentSibling.length;
            }

            if (!currentSibling.length && currentSibling.firstChild) {
                currentSibling = currentSibling.firstChild;
            } else if (!currentSibling.nextSibling &&
                    currentSibling.parentNode != page) {
                if (currentSibling.parentNode.nextSibling) {
                    currentSibling = currentSibling.parentNode.nextSibling;
                } else break;
            } else currentSibling = currentSibling.nextSibling;
        }
    }

    startOffset += totalStartOffset;
    endOffset += totalEndOffset;

    if (startOffset > endOffset) {
        let tempOffset = startOffset;
        startOffset = endOffset;
        endOffset = tempOffset;
    }

    let change = {
        id: changes.length,
        type: getEnumChangeTypeString(type),
        selection: page.innerText.substr(startOffset, endOffset - startOffset),
        startOffset: startOffset,
        endOffset: endOffset,
        topPos: 0,
        comment: txtComment.value,
    };

    changes.push(change);


    id++;
    let idx = 0;

    if (changes.length != 0) {
        for (let j = 0; j <= id - 1; j++) {
            if (changes[j].startOffset <= change.startOffset) {
                idx++;
            }
        }
    }

    let scrubbedSelection = change.selection
        .replace('\t', '')
        .replace('\r', '')
        .replace('\n', '');

    let selectionText = '';

    if (scrubbedSelection.length > 40) {
        selectionText = scrubbedSelection.substr(0, 20) +
            '...' +
            scrubbedSelection.substr(scrubbedSelection.length - 21, 20);
    } else selectionText = scrubbedSelection;

    execCmd('backColor', '#FFFFFE');

    let styledEl = page
        .querySelector('[style=\'background-color: rgb(255, 255, 254);\'');

    changes[id].topPos = styledEl.offsetTop;

    execCmd('undo', '');
    execCmd('foreColor', '#0abb00');
    richTextField.getSelection().removeAllRanges();
    txtComment.value = '';
    updateCharacterCounter();

    let HTML =
        '<div class=\'change\' contentEditable=\'false\' style=\'top:' +
            changes[id].topPos.toString() + 'px\' id=\'change' + id.toString() +
            '\' onmouseover=\'showComment(' + id.toString() + ');\'' +
            'onmouseout=\'hideComment(' + id.toString() + ');\'>' +
                '<div class=\'change-remove\' onclick=\'parent.removeChange(' +
                    id.toString() + ')\'>x</div>' +
                    '<div class=\'change-main-content\'>' +
                    '<img class=\'change-picture\' src=\'/img/edit-icons/' +
                    getEnumChangeTypeString(type).toLowerCase() + '.png\'>' +
                    '<p class=\'change-selection\'>' + selectionText + '</p>' +
                '</div>' +
                '<p class=\'change-comment hidden\'>' + change.comment +
                '</p>' +
        '</div>';

    let containerChanges = richDoc
    .getElementById('containerChanges');

    containerChanges.innerHTML += HTML;


    if (changes.length > 1) {
        let lastChangeElement = containerChanges.lastChild;
        if (idx != changes.length - 1) {
            let proceedingElement = richDoc
                .getElementsByClassName('change')[idx];

            containerChanges.insertBefore(lastChangeElement, proceedingElement);
        }
        sortChanges();
    }
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
 * Get the index of a change in the changes array
 * @param {number} id ID of change
 * @return {number} Index of change
 */
function getChangeIndexFromId(id) {
    for (let i = 0; i < changes.length; i++) {
        if (changes[i].id == id) {
            return i;
        }
    }
}


/**
 * Show the Final Message Panel in the right container
 */
function showPanelFinalMessage() {
    document.getElementById('panelMark').style.display = 'none';
    document.getElementById('panelFinalMessage').style.display = 'block';
    updateCharacterCounter();
}

/**
 * Show the marking panel in the right container
 */
function showPanelMark() {
    document.getElementById('panelMark').style.display = 'block';
    document.getElementById('panelFinalMessage').style.display = 'none';
    updateCharacterCounter();
}

/**
 * Update the character count for the textareas in the right container
 */
function updateCharacterCounter() {
    let textAreaCounter = document.getElementById('textAreaCounter');
    let panelMark = document.getElementById('panelMark');
    let panelFinalMessage = document.getElementById('panelFinalMessage');
    let charCount = 0;

    if (panelMark.style.display != 'none') {
        charCount = 150 - txtComment.value.length;
        textAreaCounter.innerHTML = charCount.toString() + ' Characters Left';
    } else if (panelFinalMessage.style.display != 'none') {
        charCount = 300 - txtFinalMessage.value.length;
        textAreaCounter.innerHTML = charCount.toString() + ' Characters Left';
    }
}

/**
 * Send Changes as JSON String to postChanges.php
 */
function postChanges() {
    window.onbeforeunload = null;
    confirm('Are you sure you are finished marking?');
    $.ajax({
        url: 'postChanges.php',
        method: 'POST',
        data: {
            'changes': JSON.stringify(changes),
            'message': txtFinalMessage.value,
            'essayId': getGetVariable('id'),
        },
        success: function(response) {
            let changeId = getGetVariable('id').toString();
            document.location.href = '../view?id=' + changeId;
        },
    });
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
    let page = richDoc.getElementById('page');
    let pageHTML = hiddenPage.innerHTML;
    let sortedChanges = changes.slice();
    let totalOffset = 0;
    let startOffset = 0;
    let endOffset = 0;

    page.innerHTML = hiddenPage.innerHTML;
    sortedChanges = quickSortChanges(sortedChanges, 0, changes.length - 1);

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
}


/**
 * Remove a Change from the Document and Changes Array
 * @param {Number} id ID of Change
 */
function removeChange(id) {
    for (let i = 0; i < changes.length; i++) {
        if (changes[i].id == id) {
            changes.splice(i, 1);
            break;
        }
    }
    let changeElement = richDoc.getElementById('change' + id.toString());
    richDoc.getElementById('containerChanges').removeChild(changeElement);

    refreshChanges();
    sortChanges();
}
