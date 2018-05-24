<?php

    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET Request!");
    
    require_once("../php/dbconnect.php");
    
    $essayId = $conn->real_escape_string($_GET["id"]);
    
    
    $query = "SELECT DISTINCT Users.id, Users.firstName, Users.lastName FROM Edits INNER JOIN Users ON Edits.editorId = Users.id WHERE essayId=${essayId}";
    
    if ( !($result = $conn->query($query)) ) die($conn->error());
    
    $users = Array();
    
    foreach ($result as $row)
    {
        $row["id"] = intval($row["id"]);
        array_push($users, $row);
    }
    
    echo(json_encode($users));
?>