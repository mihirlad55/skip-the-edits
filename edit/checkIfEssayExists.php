<?php

// Execute logincheck.php to check if user is logged in
require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

// Check if REQUEST_METHOD is GET
if ($_SERVER["REQUEST_METHOD"] != "GET") {
    // Kill script and print error
    die("Not a GET Request!");
}

// Connect to MySQL database
require_once("../php/dbconnect.php");

$essayId = -1;

// Check if essay ID was given in the GET request
if (isset($_GET["id"])) {
    // Escape all special characters
    $essayId = $conn->real_escape_string($_GET["id"]);
}

/*
 * Create MySQL string to get number of essays with $essayId and store it in a
 * column called doesEssayExist
 */
$query = "SELECT COUNT(*) AS doesEssayExist FROM Essays WHERE id=${essayId}";


$result;
// Try querying the database and assigning the result to $result
if (!($result = $conn->query($query))) {
    // If error, kill script and print error
    die($conn->error);
}

// Fetch associative row with column 'doesEssayExist'; check if it equals 0
if ($result->fetch_assoc()['doesEssayExist'] == 0) {
    // If a session has not been started, start a session
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    // Set the msg SESSION varaible
    $_SESSION['msg'] = 'Essay does not exist!';

    // Save and close the session
    session_write_close();

    // Redirect the user to the homepage
    header('Location: /home');
}
