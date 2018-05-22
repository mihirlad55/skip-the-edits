<?php

    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET Request!");
    
    require_once("../php/dbconnect.php");
    
    $essayId = $conn->real_escape_string($_GET["id"]);
    
    $query = "SELECT DISTINCT editorId FROM Changes WHERE essayId=$essayId";
    
    $result;
    
    if ( !($result = $conn->query($query)) ) die($conn->error());
    
    $resultArray = $result->fetch_all();
    $userIds = Array();
    
    $query = "SELECT id, firstName, lastName FROM Users WHERE id=";
    
    foreach ($result as $row)
    {
        $query .= strval($row["editorId"]) . " OR id=";
    }
    unset($row);
    
    $query = substr($query, 0, -7);
    
    if ( !($result = $conn->query($query)) ) die($conn->error());
    
    $users = Array();
    while ($row = $result->fetch_assoc())
    {
        array_push($users, $row);
    }
    
    echo(json_encode($users));
?>