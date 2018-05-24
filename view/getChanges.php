<?php

    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET Request!");
    
    require_once("../php/dbconnect.php");
    
    $essayId = $conn->real_escape_string($_GET["id"]);
    
    $query = "SELECT Changes.id, Edits.editorId, Changes.type, Changes.startOffset, Changes.endOffset, Changes.comment FROM Edits INNER JOIN Changes ON Edits.id = Changes.editId  WHERE Edits.essayId=${essayId}";
    
    $result;
    
    if ( !($result = $conn->query($query)) ) die($conn->error());
    
    $changes = Array();
    
    while ($row = $result->fetch_assoc())
    {
        $row["id"] = intval($row["id"]);
        $row["editorId"] = intval($row["editorId"]);
        $row["startOffset"] = intval($row["startOffset"]);
        $row["endOffset"] = intval($row["endOffset"]); 
        array_push($changes, $row);
    }
    
    echo(json_encode($changes));
?>