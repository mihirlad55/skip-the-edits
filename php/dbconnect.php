<?php

// Define some constants for the database connection
define("DB_DATABASE", "skiptheedits");
define("DB_USER", "AWS");
define("DB_HOST", "207.223.160.10");
define("DB_PASSWORD", "6Jy%J6uWsIXr*t@^");

// Connect to the MySQL database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);

// If connection fails, kill script, and print error message
if ($conn->connect_error) {
    die("Could not connect: " . $conn->connect_error);
}
