<?php

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET request.");

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/dbconnect.php");

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    $userId = $_SESSION["user"]["id"];
    session_abort();

    $queryString = "SELECT id AS userId, firstName, lastName, profession, location, website, twitterHandle, bio FROM Users WHERE id = ${userId}";
                    	
    if (!($result = $conn->query($queryString)))
    {
        session_abort();
        die($conn->error);
    }
    
    echo(json_encode($result->fetch_assoc()));
?>