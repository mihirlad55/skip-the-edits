<?php

    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET Request!");
    
    require_once("../php/dbconnect.php");
    
    $essayId = $conn->real_escape_string($_GET["id"]);
    
    $query = "SELECT id, editorId, timestampCreated, type, startOffset, endOffset, comment FROM Changes WHERE essayId=$essayId";
    
    $result;
    
    if ( !($result = $conn->query($query)) ) die($conn->error());
    
    $changes = Array();
    
    while ($row = $result->fetch_assoc())
    {
        array_push($changes, $row);
    }
    echo(json_encode($changes));
?>