<?php
//connect to mysql database

    define("DB_NAME", "users");
    define("DB_USER", "AWS");
    define("DB_HOST", "207.223.160.10");
    define("DB_PASSWORD", "6Jy%J6uWsIXr*t@^");
    
    //connect to the sql databse
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    
    //if connection fails, exit and send error message
    if ($conn->connect_error) {
    	die("Could not connect: " . $conn->connect_error);
    } else {
        echo "Connection successful";
    }
?>
