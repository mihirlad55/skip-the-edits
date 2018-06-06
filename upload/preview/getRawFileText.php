<?php

// Include the code from docConvert.php
include_once("../docConvert.php");

// Check if REQUEST_METHOD is POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    // Kill script and print error
    die("Not a POST request.");
}


// Get file info from the uploaded file
$info = pathinfo($_FILES['file']['name']);

// Check if the file is plain text or a word document; print error if it isn't
if (!($_FILES['file']['type'] == "text/plain" || $info['extension'] == "docx"
    || $info['extension'] == 'doc')) {
        die("Error: Not a supported file format.");
}


// If the extension of the file is .docx or .doc
if ($info['extension'] == "docx" || $info['extension'] == 'doc') {
    // If the extension of the file is .docx
    if ($info['extension'] == "docx") {
        // Print out the text within the .docx file
        echo(readDocx($_FILES['file']['tmp_name']));
    } else {
        // Print out the text within the .doc file
        echo(readDoc($_FILES['file']['tmp_name']));
    }
} else {
    // If the extension isn't .docx or .doc, print the contents of the file
    echo(file_get_contents($_FILES['file']['tmp_name']));
}
