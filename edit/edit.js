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


// Globals
let changes = [];
let id = -1;
let richDoc = richTextField.document;
let page = richDoc.getElementById('page');

// Enumeration representing different types of changes
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

// Confirm with user before leaving the page
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
    // Get the current user selection and offsets
    let selectionRange = getSelectionRange();
    let startOffset = selectionRange.startOffset;
    let endOffset = selectionRange.endOffset;

    // Get the starting and ending container of the selection
    let selectionStartElement = selectionRange.startContainer;
    let selectionEndElement = selectionRange.endContainer;

    // Start the currentSibling pointer at the first element of the page div
    let currentSibling = richDoc.getElementById('page')
        .firstChild;

    // Initialize the total offsets
    let totalStartOffset = 0;
    let totalEndOffset = 0;

    /*
     * Check to make sure a font element is present to ensure that there is
     * text highlighted
     */
    if (page.getElementsByTagName('font')[0]) {
            // While currentSibling pointer isn't pointing to start container
        while ( currentSibling != selectionStartElement) {
            // If text node, add length of text node to totalStartOffset
            if (currentSibling.nodeName == '#text') {
                    totalStartOffset += currentSibling.length;
                }

            // If node has no length and node has a child element...
            if (!currentSibling.length && currentSibling.firstChild) {
                // Move pointer to child element of itself
                currentSibling = currentSibling.firstChild;

            // If there is no node after the currentSibling
            } else if (!currentSibling.nextSibling &&
                // And its parent isn't page
                currentSibling.parentNode != page) {
                    // If the parent of currentSibling has siblings...
                    if (currentSibling.parentNode.nextSibling) {
                        // Set pointer to its parent's next sibling
                        currentSibling = currentSibling.parentNode.nextSibling;
                    } else break;
            } else currentSibling = currentSibling.nextSibling;
        }

        // Reset currentSibling to first child of page
        currentSibling = page.firstChild;

        // While currentSibling pointer isn't pointing to start container
        while ( currentSibling != selectionEndElement ) {
            // If text node, add length of text node to totalEndOffset
            if (currentSibling.nodeName == '#text') {
                totalEndOffset += currentSibling.length;
            }

            // If node has no length and node has a child element...
            if (!currentSibling.length && currentSibling.firstChild) {
                // Move pointer to child element of itself
                currentSibling = currentSibling.firstChild;
            // If there is no node after the currentSibling
            } else if (!currentSibling.nextSibling &&
                    // And its parent isn't page
                    currentSibling.parentNode != page) {
                    // If the parent of currentSibling has siblings...
                    if (currentSibling.parentNode.nextSibling) {
                        // Set pointer to its parent's next sibling
                        currentSibling = currentSibling.parentNode.nextSibling;
                    } else break;
            } else currentSibling = currentSibling.nextSibling;
        }
    }

    // Add on the total start/end offsets to get actual text offsets
    startOffset += totalStartOffset;
    endOffset += totalEndOffset;

    // If startOffset is larger than endOffset, swap their values
    if (startOffset > endOffset) {
        let tempOffset = startOffset;
        startOffset = endOffset;
        endOffset = tempOffset;
    }

    // Create the change object
    let change = {
        id: changes.length,
        type: getEnumChangeTypeString(type),
        selection: page.innerText.substr(startOffset, endOffset - startOffset),
        startOffset: startOffset,
        endOffset: endOffset,
        topPos: 0,
        comment: txtComment.value,
    };

    // Push the change object to the changes array
    changes.push(change);


    // Increment the global Change ID pointer
    id++;

    // Initialize the index variable
    let idx = 0;

    /*
     * Increment idx until it holds the sorted index of the change based on
     * start offsets
     */
    if (changes.length != 0) {
        for (let j = 0; j <= id - 1; j++) {
            if (changes[j].startOffset <= change.startOffset) {
                idx++;
            }
        }
    }

    // Remove all tab / carridge return / new-line characters from selection
    let scrubbedSelection = change.selection
        .replace('\t', '')
        .replace('\r', '')
        .replace('\n', '');

    // Initialize selectionText
    let selectionText = '';

    // If selection is larger than 40 characters
    if (scrubbedSelection.length > 40) {
        // Set scrubbed selection to '[first 20 chars]...[last 20 chars]'
        selectionText = scrubbedSelection.substr(0, 20) +
            '...' +
            scrubbedSelection.substr(scrubbedSelection.length - 21, 20);
    } else {
        // Set selectionText to scrubbedSelection
        selectionText = scrubbedSelection;
    }

    // Wrap selection in element with backColor attribute
    execCmd('backColor', '#FFFFFE');

    // Get element with background-color attribute #FFFFFE
    let styledEl = page
        .querySelector('[style=\'background-color: rgb(255, 255, 254);\'');

    // Set topPos property of new change object to top position of new element
    changes[id].topPos = styledEl.offsetTop;

    // Undo the backColor command
    execCmd('undo', '');

    // Set fore color of element to Green
    execCmd('foreColor', '#0abb00');

    // Clear selection
    richTextField.getSelection().removeAllRanges();

    // Clear comment textField
    txtComment.value = '';

    // Update character count for comment textField
    updateCharacterCounter();

    // Create HTML for change card
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

    // Set reference to containerChanges Element to containerChanges
    let containerChanges = richDoc
    .getElementById('containerChanges');

    // Append the change card HTML to containerChanges
    containerChanges.innerHTML += HTML;

    // If there is more than 1 change...
    if (changes.length > 1) {
        // Get the last change card element in the container
        let lastChangeElement = containerChanges.lastChild;

        // If the change's sorted position is not last
        if (idx != changes.length - 1) {
            // Get the element at the change's sorted index position
            let proceedingElement = richDoc
                .getElementsByClassName('change')[idx];

            // Insert the change card at the sorted position
            containerChanges.insertBefore(lastChangeElement, proceedingElement);
        }
        // Call sortChanges
        sortChanges();
    }
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
 * Get the index of a change in the changes array
 * @param {number} id ID of change
 * @return {number} Index of change
 */
function getChangeIndexFromId(id) {
    // Iterate through every change object in the changes array
    for (let i = 0; i < changes.length; i++) {
        // If the change's Id matches the given id...
        if (changes[i].id == id) {
            // Return the index of the change in the array
            return i;
        }
    }
}


/**
 * Show the Final Message Panel in the right container
 */
function showPanelFinalMessage() {
    // Hide panelMark
    document.getElementById('panelMark').style.display = 'none';
    // Show panelFinalMessage
    document.getElementById('panelFinalMessage').style.display = 'block';
    // Update text area character count
    updateCharacterCounter();
}

/**
 * Show the marking panel in the right container
 */
function showPanelMark() {
    // Show panelMark
    document.getElementById('panelMark').style.display = 'block';
    // Hide panelFinalMessage
    document.getElementById('panelFinalMessage').style.display = 'none';
    // Update text area character count
    updateCharacterCounter();
}

/**
 * Update the character count for the textareas in the right container
 */
function updateCharacterCounter() {
    // Initialize some variables and get references to some elements
    let textAreaCounter = document.getElementById('textAreaCounter');
    let panelMark = document.getElementById('panelMark');
    let panelFinalMessage = document.getElementById('panelFinalMessage');
    let charCount = 0;

    // If panelMark is currently showing, use 150 as the max char count
    if (panelMark.style.display != 'none') {
        charCount = 150 - txtComment.value.length;
        // Update charCount label
        textAreaCounter.innerHTML = charCount.toString() + ' Characters Left';
    // Else if panelFinalMessage currently showing, use 300 as max char count
    } else if (panelFinalMessage.style.display != 'none') {
        charCount = 300 - txtFinalMessage.value.length;
        // Update charCount label
        textAreaCounter.innerHTML = charCount.toString() + ' Characters Left';
    }
}

/**
 * Send Changes as JSON String to postChanges.php
 */
function postChanges() {
    // Don't prompt user before leaving page
    window.onbeforeunload = null;
    // Confirm with user that he is finished marking
    confirm('Are you sure you are finished marking?');

    // Create AJAX Request
    $.ajax({
        url: 'postChanges.php',
        method: 'POST',
        data: {
            'changes': JSON.stringify(changes),
            'message': txtFinalMessage.value,
            'essayId': getGetVariable('id'),
        },
        success: function(response) {
            // Get essayId from URL
            let essayId = getGetVariable('id').toString();
            // Redirect user to view page for essay
            document.location.href = '../view?id=' + essayId;
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
    let page = richDoc.getElementById('page');
    let pageHTML = hiddenPage.innerHTML;
    let sortedChanges = changes.slice();
    let totalOffset = 0;
    let startOffset = 0;
    let endOffset = 0;

    // Reset page HTML with original essay text
    page.innerHTML = hiddenPage.innerHTML;

    // Get sorted array of changes
    sortedChanges = quickSortChanges(sortedChanges, 0, changes.length - 1);

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
}


/**
 * Remove a Change from the Document and Changes Array
 * @param {Number} id ID of Change
 */
function removeChange(id) {
    // Go through every change in the changes array
    for (let i = 0; i < changes.length; i++) {
        // If the current change's ID matches the ID of change to be removed
        if (changes[i].id == id) {
            // Remove the change from the array
            changes.splice(i, 1);
            break;
        }
    }
    // Get the changeElement with the ID of the change to be removed
    let changeElement = richDoc.getElementById('change' + id.toString());

    // Remove the change element from DOM
    richDoc.getElementById('containerChanges').removeChild(changeElement);

    // Call some functions
    refreshChanges();
    sortChanges();
}
