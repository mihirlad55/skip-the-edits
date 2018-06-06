<?php

// Execute logincheck.php to check if user is logged in
require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

// Check if REQUEST_METHOD is GET
if ($_SERVER["REQUEST_METHOD"] != "GET") {
    // Kill script and print error
    die("Not a GET Request!");
}


// Connect to the MySQL database
require_once("../php/dbconnect.php");


// Get the $_GET id variable, escape all special chars and set it to $essayId
$essayId = $conn->real_escape_string($_GET["id"]);


// If a session has not been started, start a session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Get ID of logged on user from $_SESSION variable
$userId = $_SESSION["user"]["id"];
// Stop the session
session_abort();

/*
 * Create a MySQL query string that selects the edit message's id,
 * corresponding editId, editorId, message, message rating, logged on user's
 * personal rating, editor's full name, editor's profession, and total number
 * of ratings on the message and return it as a row where the essayId equals
 * the given essayId
 */
$query = "
        SELECT
            EditMessages.id, 
            EditMessages.editId, 
            Edits.editorId, 
            EditMessages.message,
            SUM(
                CASE MessageRatings.rating 
                    WHEN 'LIKE' THEN 1
                    WHEN 'DISLIKE' THEN -1
                    WHEN 'NONE' THEN 0
                    ELSE 0
                END
            ) AS ratingTotal,
            IF(MessageRatings.userId = $userId, MessageRatings.rating, 'NONE') AS ratingUser,
            CONCAT(Users.firstName, ' ', Users.lastName) As editorFullName,
            Users.profession,
            AVG(
                CASE UserApprovalRatings.rating
                    WHEN 'APPROVE' THEN 1
                    WHEN 'DISAPPROVE' THEN -1
                    WHEN 'NONE' THEN 0
                    ELSE 0
                END
            ) AS approvalRating
        FROM 
            Edits
        INNER JOIN
            EditMessages
        ON
            EditMessages.editId = Edits.id
        LEFT JOIN
            MessageRatings
        ON
            MessageRatings.messageId = EditMessages.id
        INNER JOIN
            Users
        ON
            Edits.editorId = Users.id
        LEFT JOIN
            UserApprovalRatings
        ON
            UserApprovalRatings.userIdRated = Edits.editorId
        WHERE
            Edits.essayId = $essayId
        GROUP BY
            EditMessages.id";


// Initialize global $result variable
$result;

// Try querying the database and assigning the result to $result
if (!($result = $conn->query($query))) {
    // If error, kill script and print error
    die($conn->error());
}

// Create an empty array
$editMessages = array();


// While the next row exists, fetch the next associative array
while ($row = $result->fetch_assoc()) {
    // Convert all the values that should be integers into integers
    $row["id"] = intval($row["id"]);
    $row["editorId"] = intval($row["editorId"]);
    $row["editId"] = intval($row["editId"]);
    $row["ratingTotal"] = intval($row["ratingTotal"]);
    $row["approvalRating"] = intval($row["approvalRating"]);

    // Push the row into the editMessages Array
    array_push($editMessages, $row);
}

// Print the JSON encoded editMessages array
echo(json_encode($editMessages));
