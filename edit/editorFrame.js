function showComment(id)
{
    document.getElementById("change" + id.toString()).getElementsByClassName("change-comment")[0].className = "change-comment";
    parent.sortChanges();
}

function hideComment(id)
{
    document.getElementById("change" + id.toString()).getElementsByClassName("change-comment")[0].className = "change-comment hidden";
    parent.sortChanges();
}
