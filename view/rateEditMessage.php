<?php

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

    if ($_SERVER['REQUEST_METHOD'] != "POST") die("Not a POST Request");

    session_start();
    $userId = $_SESSION['user']['id'];
    session_abort();

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/dbconnect.php");
    
    $rating = $conn->real_escape_string($_POST['rating']);
    $editMessageId = $conn->real_escape_string($_POST['editMessageId']);

    $query = "DELETE FROM MessageRatings WHERE userId = ${userId} AND messageId = ${editMessageId} LIMIT 1";

    if (!($conn->query($query))) die($conn->error);

    $query = "INSERT INTO MessageRatings (userId, messageId, rating) VALUES (${userId}, ${editMessageId}, '${rating}')";

    if (!($conn->query($query))) die($conn->error);
?>