<?php

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET Request!");
    
    require_once("../php/dbconnect.php");
    
    
    $essayId = $conn->real_escape_string($_GET["id"]);
    
    $query = "SELECT COUNT(*) AS numberOfEdits FROM Edits WHERE essayId=${essayId}";
    
    if ( !($result = $conn->query($query)) ) die($conn->error());
    
    echo($result->fetch_assoc()["numberOfEdits"]);
?>