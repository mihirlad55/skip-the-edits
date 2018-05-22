<?php
    
    if ($_SERVER["REQUEST_METHOD"] != "POST") die("Not a POST Request!");
    
    session_start();
    $editorId = $_SESSION["userId"];
    session_abort();
    
    $changes = json_decode($_POST["changes"], true);
    $essayId = $_POST["essayId"];
    
    require_once("../php/dbconnect.php");
    
    foreach ($changes as $change)
    {
        $change['type'] = strtoupper($change['type']);
        
        $editorId = $conn->real_escape_string($editorId);
        $essayId = $conn->real_escape_string($essayId);
        $change['type'] = $conn->real_escape_string($change['type']);
        $change['startOffset'] = $conn->real_escape_string($change['startOffset']);
        $change['endOffset'] = $conn->real_escape_string($change['endOffset']);
        $change['comment'] = $conn->real_escape_string($change['comment']);
        
        $queryString = "INSERT INTO Changes (editorId, essayId, type, startOffset, endOffset, comment)
                                    VALUES ($editorId, $essayId, '${change['type']}', ${change['startOffset']}, ${change['endOffset']}, '${change['comment']}')";
        
        if (!$conn->query($queryString)) die($conn->error());
    }
?>