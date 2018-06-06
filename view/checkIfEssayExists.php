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

// Set $essayId to -1
$essayId = -1;
// If the ID $_GET variable exists...
if (isset($_GET["id"])) {
    // Set $essayId to the $_GET['id] variable after escaping all special chars
    $essayId = $conn->real_escape_string($_GET["id"]);
}

/*
 * Create a MySQL query string that gets the number of essays with the given
 * essay ID and return it as a row with the column doesEssayExist
 */
$query = "SELECT COUNT(*) AS doesEssayExist FROM Essays WHERE id=${essayId}";


// Initialize global variable $result
$result;

// Try querying the database and assigning the result to $result
if (!($result = $conn->query($query))) {
    // If error, kill script and print error
    die($conn->error);
}

// Get an associate row from $result and check if the doesEssayExist column = 0
if ($result->fetch_assoc()['doesEssayExist'] == 0) {
    // If a session has not been started, start a session
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    // Set the msg SESSION varaible
    $_SESSION['msg'] = 'Essay does not exist!';

    // Save the SESSION variables and close the session
    session_write_close();

    // Redirect the user to the homepage
    header('Location: /home');
}
