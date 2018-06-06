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


// Get the essay id from $_GET Request; escape all special chars; set $essayId
$essayId = $conn->real_escape_string($_GET["id"]);

/*
 * Create a MySQL query string that gets the change id, editor user Id, type,
 * startOffset of selection, endOffset of selection, and change comment for
 * every change with the given essayId
 */
$query = "
            SELECT
                Changes.id,
                Edits.editorId,
                Changes.type,
                Changes.startOffset,
                Changes.endOffset,
                Changes.comment
            FROM
                Edits
            INNER JOIN
                Changes
            ON
                Edits.id = Changes.editId
            WHERE
                Edits.essayId=${essayId}";

// Initialize global variable $result
$result;

// Try querying the database and assigning the result to $result
if (!($result = $conn->query($query))) {
    // If error, kill script and print error
    die($conn->error());
}

// Create an empty array $changes
$changes = array();

// While the next row exist, fetch the next associative row from $result
while ($row = $result->fetch_assoc()) {
    // Convert the variables that should be integers into integers
    $row["id"] = intval($row["id"]);
    $row["editorId"] = intval($row["editorId"]);
    $row["startOffset"] = intval($row["startOffset"]);
    $row["endOffset"] = intval($row["endOffset"]);
    
    // Push the change row into the $changes array
    array_push($changes, $row);
}

// Print the JSON encoded $changes array
echo(json_encode($changes));
