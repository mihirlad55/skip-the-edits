/* global richTextField page hiddenPage getCookie() */

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
    hiddenPage.innerHTML = "";
}

function execCmd (command, args) {
    richTextField.document.execCommand(command, false, args);
}

function highlight(color)
{
    execCmd('backColor', color);
}

function getSelectionRange()
{
    return richTextField.document.getSelection().getRangeAt(0);
}


function createChangeHTML(type)
{
    var selectionRange = getSelectionRange();
    var startOffset = (selectionRange.startOffset < selectionRange.endOffset) ? selectionRange.startOffset : selectionRange.endOffset;
    var endOffset = (selectionRange.startOffset < selectionRange.endOffset) ? selectionRange.endOffset : selectionRange.startOffset;
    
    var selectionStartElement = selectionRange.startContainer;
    var currentSibling = richTextField.document.getElementById("page").firstChild;
    var totalStartOffset = 0;

    if (richTextField.document.getElementById("page").getElementsByTagName("font")[0])
    {
        while ( currentSibling != selectionStartElement )
        {
            if (currentSibling.nodeName == "#text") totalStartOffset += currentSibling.length;
            else if (currentSibling.nodeName == "FONT") totalStartOffset += currentSibling.innerText.length;
            currentSibling = currentSibling.nextSibling;
        };
    }
    
    startOffset += totalStartOffset;
    endOffset += totalStartOffset;
    
    var change = {
        id: changes.length,
        type: getEnumChangeTypeString(type),
        date: new Date().getTime(),
        selection: richTextField.document.getElementById("page").innerText.substr(startOffset, endOffset - startOffset + 1),
        startOffset: startOffset,
        endOffset: endOffset,
        comment: txtComment.value
    };
    
    changes.push(change);
    
        
    var id = changes.length - 1;
    var idx = 0;
    
    if (changes.length != 0)
    {
        for (var j = 0; j <= id - 1; j++)
        {
            if (changes[j].startOffset <= change.startOffset)
            {
                idx++;
            }
        }
    }
    
    var scrubbedSelection = change.selection.replace("\t", "").replace("\r", "").replace("\n", "");
    var selectionText = "";
    
    if (scrubbedSelection.length > 40) selectionText = scrubbedSelection.substr(0, 20) + "..." + scrubbedSelection.substr(scrubbedSelection.length - 21, 20);
    else selectionText = scrubbedSelection;
    
    execCmd("backColor", "#FFFFFE");
    changesTopPos.push(richTextField.document.getElementById("page").getElementsByTagName("span")[0].offsetTop);
    execCmd("undo", "");
    execCmd("foreColor", "#0abb00");
    richTextField.getSelection().removeAllRanges();
  
    var HTML = 
                "<div class='change' style='top: " + changesTopPos[id].toString() + "px' id='change" + id.toString() + "' onmouseover='showComment(" + id.toString() + ");' onmouseout='hideComment(" + id.toString() + ");'>" +
                    "<div class='change-main-content'>" +
                        "<img class='change-picture' src='../img/edit-icons/" + getEnumChangeTypeString(type).toLowerCase() + ".png'>" +
                        "<p class='change-selection'>" + selectionText  + "</p>" +
                    "</div>" +
                    "<p class='change-comment hidden'>" + change.comment + "</p>" +
                "</div>";
                
    var containerChanges = richTextField.document.getElementById("containerChanges");
    containerChanges.innerHTML += HTML;
    
    containerChanges.lastChild.setAttribute("contentEditable", "false");
    
    if (changes.length > 1)
    {
        var lastChangeElement = containerChanges.lastChild;
        if (idx != changes.length - 1)
        {
            var proceedingElement = richTextField.document.getElementsByClassName("change")[idx];
            containerChanges.insertBefore(lastChangeElement, proceedingElement);
        }
        sortChanges();
    }
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

function getSortedChangeIndex(changes, pivot)
{

}