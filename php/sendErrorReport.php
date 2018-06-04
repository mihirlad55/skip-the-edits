<?php

    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $userID;
        if ($_SESSION["isLoggedIn"])
        {
            $userID = $_SESSION["userID"];
            session_write_close();
        }
        $email = "skiptheedits@gmail.com";
        $content = $_POST["message"] . "\n userID: $userID\n User Agent: {$_POST['userAgent']}\n Screen Height: {$_POST['screenHeight']}\n Screen Width: {$_POST['screenWidth']}";
        $subject = "Error Report";
        
        mail($email, $subject, $content, "noreply@skiptheedits.com");
    }
?>