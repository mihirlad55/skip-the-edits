<?php

    session_start();
    
    /*if (!$_SESSION["isLoggedIn"]) {
        session_abort();
        die("Not Logged In.");
    }
    else if ($_SERVER["REQUEST_METHOD"] != "POST")
    {
        session_abort();
        die("Not a POST request.");
    }*/

    if ($_SERVER["REQUEST_METHOD"] != "POST") die("Not a POST Request");

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/dbconnect.php");

    $userId = $_SESSION["user"]["id"];
    $title = $conn->real_escape_string($_POST["essayTitle"]);
    $editorType = $conn->real_escape_string($_POST["editorType"]);
    $instructions = $conn->real_escape_string($_POST["essayInstructions"]);
    $text = $_POST["page"];

    $queryString = "INSERT INTO Essays VALUES ('NULL', '$userId', '$title', '$editorType', '$instructions')";
    if (!$conn->query($queryString))
    {
        session_abort();
        die($conn->error);
    }
    
    $filename = $conn->insert_id;
    
    $target = "${_SERVER['DOCUMENT_ROOT']}/files/$filename.txt";

    $file = fopen($target, "w");
    fwrite($file, $text);
    fclose($file);

    header("Location: /view?id=${filename}")
?>