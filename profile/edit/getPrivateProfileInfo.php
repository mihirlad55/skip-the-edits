<?php

// Execute logincheck.php to check if user is logged in
require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

// Check if REQUEST_METHOD is GET
if ($_SERVER["REQUEST_METHOD"] != "GET") {
    // Kill script and print error
    die("Not a GET request.");
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

/*
 * Create query that gets a row of the userId, firstName, lastName, profession,
 * location, website, twitterHandle, and bio of user with a certain id
 */
$queryString = "SELECT
                    id AS userId,
                    firstName,
                    lastName,
                    profession,
                    location,
                    website,
                    twitterHandle,
                    bio
                FROM
                    Users
                WHERE
                    id = ${userId}";

// Try querying the database and assigning the result to $result
if (!($result = $conn->query($queryString))) {
    // If error, kill script and print error
    die($conn->error);
}

// Print the $result associative row as a JSON string
echo(json_encode($result->fetch_assoc()));
