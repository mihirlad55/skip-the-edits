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
$userId = $_SESSION['user']['id'];
// Stop the session
session_abort();

// Connect to the MySQL database
require_once("${_SERVER['DOCUMENT_ROOT']}/php/dbconnect.php");

// Escape the special characters and set the POST variables to global variables
$rating = $conn->real_escape_string($_POST['rating']);
$editMessageId = $conn->real_escape_string($_POST['editMessageId']);

/*
 * Create a MySQL query string that deletes a row from the MessageRatings table
 * where the userId matches the current logged in user's id and the messageId
 * equals the given message ID
 */
$query = "
    DELETE FROM
        MessageRatings
    WHERE
        userId = ${userId}
    AND
        messageId = ${editMessageId}
    LIMIT 1";

// Try querying the database
if (!($conn->query($query))) {
    // If error, kill script and print error
    die($conn->error);
}

/*
 * Create a MySQL query string that inserts a new row into the MessageRatings
 * table with the userId, editMessageId, and the user's rating
 */
$query = "
    INSERT INTO
        MessageRatings (
            userId,
            messageId,
            rating
        )
    VALUES (
        ${userId},
        ${editMessageId},
        '${rating}'
    )";

// Try querying the database
if (!($conn->query($query))) {
    // If error, kill script and print error
    die($conn->error);
}
