<?php

// Execute logincheck.php to check if user is logged in
require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

// Check if REQUEST_METHOD is POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    // Kill script and print error
    die("Not a POST Request!");
}

// If a session has not been started, start a session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Get ID of logged on user from $_SESSION variable
$editorId = $_SESSION["user"]["id"];

// Stop the session
session_abort();

// Decode the JSON string and convert it into an object
$changes = json_decode($_POST["changes"], true);

// Get the essay ID from the POST Request
$essayId = $_POST["essayId"];

// Connect to the MySQL database
require_once("../php/dbconnect.php");

// Escape special characters in message POST variable and set it to $message
$message = $conn->real_escape_string($_POST["message"]);

/*
 * Create a MySQL query which inserts a new row into the Edits MySQL table
 * with the essay id of the essay and the id of the editor
 */
$queryString = "INSERT INTO Edits (essayId, editorId) 
    VALUES (${essayId}, ${editorId})";

// Try querying the database
if (!$conn->query($queryString)) {
    // If error, kill script and print error
    die($conn->error());
}

// Set $editId to the ID of the last row added
$editId = $conn->insert_id;

// Go through every change in the changes array...
foreach ($changes as $change) {
    // Make all the letters of the 'type' variable uppercase
    $change['type'] = strtoupper($change['type']);
    
    // Escape special characters in all these variables...
    $editorId = $conn->real_escape_string($editorId);
    $essayId = $conn->real_escape_string($essayId);
    $change['type'] = $conn->real_escape_string($change['type']);
    $change['startOffset'] = $conn->real_escape_string($change['startOffset']);
    $change['endOffset'] = $conn->real_escape_string($change['endOffset']);
    $change['comment'] = $conn->real_escape_string($change['comment']);

    
    /*
     * Create a query string that inserts the current change into the Changes
     * table with its corresponding editId, type, startOffset, endOffset, and
     * comment
     */
    $queryString = "INSERT INTO 
                        Changes (
                            editId,
                            type,
                            startOffset,
                            endOffset,
                            comment
                        )
                    VALUES (
                            ${editId},
                            '${change['type']}',
                            ${change['startOffset']},
                            ${change['endOffset']},
                            '${change['comment']}'
                    )";

    // Try querying the database
    if (!$conn->query($queryString)) {
        // If error, kill script and print error
        die($conn->error());
    }
}

/*
 * Create a query string that inserts the Edit Message into the EditMessages
 * table with its corresponding edit ID and message
 */
$queryString = "INSERT INTO 
                    EditMessages (editId, message)
                VALUES (${editId}, '${message}')";

// Try querying the database
if (!$conn->query($queryString)) {
    // If error, kill script and print error
    die($conn->error());
}
