<?php

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");
    
    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET Request!");
    
    require_once("../php/dbconnect.php");
    
    $essayId = -1;
    if (isset($_GET["id"])) {
        $essayId = $conn->real_escape_string($_GET["id"]);
    }

    $query = "SELECT COUNT(*) AS doesEssayExist FROM Essays WHERE id=${essayId}";
    
    $result;
    if ( !($result = $conn->query($query)) ) die($conn->error());
    
    if ($result->fetch_assoc()['doesEssayExist'] == 0) {
        session_start();
        $_SESSION['msg'] = 'Essay does not exist!';
        session_write_close();
        header('Location: /home');
    }
?>