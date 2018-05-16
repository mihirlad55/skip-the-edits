<?php
    if (!isset($_SESSION['user'])) {
        session_destroy();
        header('location: login.html');
    }

    if (isset($_SESSION['msg'])) {
        include_once '../modal.php';
        unset($_SESISON['msg']);
    }
?>