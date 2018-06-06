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
 * Create a MySQL query string that gets the number of rows with the given
 * essayId from the Edits table and name the column numberOfEdits
 */
$query = "SELECT COUNT(*) AS numberOfEdits FROM Edits WHERE essayId=${essayId}";


// Try querying the database and assigning the result to $result
if (!($result = $conn->query($query))) {
    // If error, kill script and print error
    die($conn->error());
}

// Print the value of the numberOfEdits column in the assoiative row
echo($result->fetch_assoc()["numberOfEdits"]);
