/* global richTextField page hiddenPage getCookie() */

var allChanges = [ ];
var editors = [ ];
var changes = [ ];
var changesTopPos = [ ];


var EnumChangeType = { 
    "CLICHE" :      0,
    "DICTION":      1,
    "GRAMMAR":      2,
    "LENGTH":       3,
    "OVERUSED":     4,
    "PLAGIARISM":   5,
    "PRONOUN":      6,
    "REPEATS":      7,
    "STYLE":        8,
    "THESAURUS":    9 
};


function refreshDropDownEditors()
{
    var dropDownEditor = document.getElementById("dropDownEditor");
    editors.forEach(function(user){
        dropDownEditor.innerHTML += "<option value=" + user.id + ">" + user.firstName + " " + user.lastName + "</option>";
    });
}

function getEnumChangeTypeString(type)
{
    switch (type)
    {
        case EnumChangeType.CLICHE: return "Cliche";
        case EnumChangeType.DICTION: return "Diction";
        case EnumChangeType.GRAMMAR: return "Length";
        case EnumChangeType.LENGTH: return "Length";
        case EnumChangeType.OVERUSED: return "Overused";
        case EnumChangeType.PLAGIARISM: return "Plagiarism";
        case EnumChangeType.PRONOUN: return "Pronoun";
        case EnumChangeType.REPEATS: return "Repeats";
        case EnumChangeType.STYLE: return "Style";
        case EnumChangeType.THESAURUS: return "Thesaurus";
        default: return;
    }
}


function enableEditMode() {
    richTextField.document.designMode = "On";
    richTextField.document.getElementById("page").innerHTML = hiddenPage.innerHTML;
}

function execCmd (command, args) {
    richTextField.document.execCommand(command, false, args);
}



function insertBetweenString(string, insertIndex, stringToInsert)
{
    return string.substr(0, insertIndex) + stringToInsert + string.substr(insertIndex);
}


function partitionChanges(changesArr, low, high)
{
    var pivot = changesArr[high];
    var i = low - 1;
    var tempChange;
    
    for (var j = low; j <= high - 1; j++)
    {
        if (changesArr[j].startOffset <= pivot.startOffset)
        {
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

function quickSortChanges(changesArr, low, high)
{
    if (low < high)
    {
        var pi = partitionChanges(changesArr, low, high)
        
        quickSortChanges(changesArr, low, pi - 1);
        quickSortChanges(changesArr, pi + 1, high);
    }
    
    return changesArr;
}

function refreshChanges()
{
    var editorId = document.getElementById("dropDownEditor").value;
    var page = richTextField.document.getElementById("page");
    var pageHTML = page.innerHTML;
    
    var selection;
    allChanges.forEach(function(change){
        if (change.editorId == editorId)
        {
            selection = pageHTML.substr(change.startOffset, change.endOffset - change.startOffset + 1).replace("\t", "").replace("\r", "").replace("\n", "");
            
            if (selection.length > 40) change.condensedSelection = selection.substr(0, 20) + "..." + selection.substr(selection.length - 21);
            
            changes.push(change);
        }
    });
    
    var sortedChanges = changes.slice();
    
    sortedChanges = quickSortChanges(sortedChanges, 0, changes.length - 1);
    var totalOffset = 0;
    
    sortedChanges.forEach(function(change)
    {
        pageHTML = insertBetweenString(pageHTML, totalOffset + parseInt(change.startOffset), "<font color='#0abb00'>" );
        totalOffset += "<font color='#0abb00'>".length;
        pageHTML = insertBetweenString(pageHTML, totalOffset + parseInt(change.endOffset), "</font>" );
        totalOffset += "</font>".length;
    });
    
    page.innerHTML = pageHTML;
    
    var fontElements = page.getElementsByTagName("font");
    var change;
    var HTML;
    var containerChanges;

    for (var i = 0; i < sortedChanges.length; i++)
    {
        change = sortedChanges[i];
        changesTopPos[change.id] = fontElements[i].offsetTop;
        HTML = 
                "<div class='change' contentEditable='false' style='top: " + fontElements[i].offsetTop.toString() + "px' id='change" + change.id.toString() + "' onmouseover='showComment(" + change.id.toString() + ");' onmouseout='hideComment(" + change.id.toString() + ");'>" +
                    "<div class='change-main-content'>" +
                        "<img class='change-picture' src='../img/edit-icons/" + change.type.toLowerCase() + ".png'>" +
                        "<p class='change-selection'>" + change.condensedSelection  + "</p>" +
                    "</div>" +
                    "<p class='change-comment hidden'>" + change.comment + "</p>" +
                "</div>";
                
        containerChanges = richTextField.document.getElementById("containerChanges");
        containerChanges.innerHTML += HTML;
    }
    
    sortChanges();
}

function sortChanges()
{
    var changeElements = richTextField.document.getElementsByClassName("change");
    var pElement;
    var cElement;
    var pElementBottom = 0;
    var cId = 0;
    
    changeElements[0].style.top = changesTopPos[changeElements[0].id.substr(6, changeElements[0].id.length - 6)];

    for (var i = 1; i < changeElements.length; i++)
    {
        pElement = changeElements[i - 1];
        cElement = changeElements[i];
        cId = cElement.id.substr(6, cElement.id.length - 6);
        pElementBottom = pElement.offsetTop + pElement.offsetHeight;
        if (changesTopPos[cId] < pElementBottom) cElement.style.top = pElementBottom.toString() + "px";
        else cElement.style.top = changesTopPos[cId].toString() + "px";
    }
}