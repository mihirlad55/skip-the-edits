<?php

    include_once("docConvert.php");
        
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

    $info = pathinfo($_FILES['file']['name']);
    
    if (!($_FILES['file']['type'] == "text/plain" || $info['extension'] == "docx" || $info['extension'] == 'doc')) die("Error: Not a supported file format.");
    
    require_once("dbconnect.php");

    $userId = $_SESSION["userId"];
    $title = $conn->real_escape_string($_POST["title"]);
    $editorType = $conn->real_escape_string($_POST["editorType"]);
    $instructions = $conn->real_escape_string($_POST["instructions"]);

    $queryString = "INSERT INTO Essays VALUES ('NULL', '$userId', '$title', '$editorType', '$instructions')";
    if (!$conn->query($queryString))
    {
        session_abort();
        die($conn->error);
    }
    
    $filename = $conn->insert_id;
    
    $target = "/home/ec2-user/environment/skip-the-edits/files/$filename.txt";


    if ( $info['extension'] == "docx" || $info['extension'] == 'doc')
    {
        $file = fopen("/home/ec2-user/environment/skip-the-edits/files/$filename.txt", "w");
        if ( $info['extension'] == "docx") fwrite($file, readDocx($_FILES['file']['tmp_name']));
        else fwrite($file, readDoc($_FILES['file']['tmp_name']));
        fclose($file);
    }
    else move_uploaded_file( $_FILES['file']['tmp_name'], $target);
    
    echo $target;

?>