<?php

    include_once("../docConvert.php");
        
    if ($_SERVER["REQUEST_METHOD"] != "POST") die("Not a POST request.");
 
    $info = pathinfo($_FILES['file']['name']);
    
    if (!($_FILES['file']['type'] == "text/plain" || $info['extension'] == "docx" || $info['extension'] == 'doc')) die("Error: Not a supported file format.");

    if ( $info['extension'] == "docx" || $info['extension'] == 'doc')
    {
        if ( $info['extension'] == "docx") echo(readDocx($_FILES['file']['tmp_name']));
        else echo(readDoc($_FILES['file']['tmp_name']));
    }
    else echo(file_get_contents($_FILES['file']['tmp_name']));
?>