<?php

// Get defined constants for database
require_once("constants.php");

// Connect to the MySQL database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);

// If connection fails, kill script, and print error message
if ($conn->connect_error) {
    die("Could not connect: " . $conn->connect_error);
}
