<?php

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['user'])) {
        session_destroy();
        header('location: ../login/');
    }

    if (isset($_SESSION['msg'])) {
        include_once '../modal.php';
        unset($_SESSION['msg']);
    }

    session_abort();
?>