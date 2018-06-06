<?php

// Execute logincheck.php to check if user is logged in
require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

// Check if REQUEST_METHOD is POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    // Kill script and print error
    die("Not a POST request.");
}


// Connect to the MySQL database
require_once("${_SERVER['DOCUMENT_ROOT']}/php/dbconnect.php");


// If a session has not been started, start a session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Get ID of logged on user from $_SESSION variable
$userId = $_SESSION["user"]["id"];
// Stop the session
session_abort();

// Escape any special characters within these vars and set them to other vars
$title = $conn->real_escape_string($_POST["essayTitle"]);
$editorType = $conn->real_escape_string($_POST["editorType"]);
$instructions = $conn->real_escape_string($_POST["essayInstructions"]);
$text = $_POST["page"];

/*
 * Create a MySQL query string that inserts a new row into the Essays Table
 * with the userId of the user, title of the essay, editorType, instructions
 */
$queryString = "INSERT INTO
                    Essays
                VALUES (
                    'NULL',
                    '$userId',
                    '$title',
                    '$editorType',
                    '$instructions'
                )";

// Try querying the database
if (!$conn->query($queryString)) {
    // Kill the script, print the error
    die($conn->error);
}

// Set $filename equal to the row ID of the last Essay row inserted
$filename = $conn->insert_id;

// Set the path of the file to /files/$filename.txt in the document root
$target = "${_SERVER['DOCUMENT_ROOT']}/files/$filename.txt";

// Open a new file at the $target file path
$file = fopen($target, "w");
// Write the text of the essay into the file
fwrite($file, $text);
// Close the file for editing
fclose($file);

// Redirect the user to the view page for the essay
header("Location: /view?id=${filename}");
