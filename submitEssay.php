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
    
    require_once("dbconnect.php");

    $username = $_SESSION["username"];
    $title = $conn->real_escape_string($_POST["title"]);
    $editorType = $conn->real_escape_string($_POST["editorType"]);
    $instructions = $conn->real_escape_string($_POST["instructions"]);

    $queryString = "INSERT INTO Essays VALUES ('NULL', '$username', '$title', '$editorType', '$instructions')";
    if (!$conn->query($queryString))
    {
        session_abort();
        die($conn->error);
    }
    
    $filename = $conn->insert_id;
    
    $info = pathinfo($_FILES['file']['name']);

    if ($_FILES['file']['type'] != "text/plain") die("Error: Not a plain text file");
    
    $target = "/home/ec2-user/environment/skip-the-edits/files/$filename.txt";
    echo $target;
    move_uploaded_file( $_FILES['file']['tmp_name'], $target);
?>