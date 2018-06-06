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

/*
 * Create a MySQL query string that gets the user's ID, firstName, and lastName
 * for every editor that edited the essay with the given ID
 */
$query = "
    SELECT DISTINCT
        Users.id,
        Users.firstName,
        Users.lastName
    FROM
        Edits
    INNER JOIN
        Users
    ON
        Edits.editorId = Users.id
    WHERE
        essayId=${essayId}";

// Try querying the database and assigning the result to $result
if (!($result = $conn->query($query))) {
    // If error, kill script and print error
    die($conn->error());
}

// Create empty users array
$users = array();

// For each row in result
foreach ($result as $row) {
    // Convert the id of the row into an integer
    $row["id"] = intval($row["id"]);

    // Push the row into the users array
    array_push($users, $row);
}

// Print the JSON enocded users array
echo(json_encode($users));
