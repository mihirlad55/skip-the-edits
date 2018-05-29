<?php

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['user'])) {
        session_destroy();
        header("location: /login/?redirect=${_SERVER['REQUEST_URI']}");
    }

    if (isset($_SESSION['msg'])) {
        require_once("${_SERVER['DOCUMENT_ROOT']}/modal.html");
        unset($_SESSION['msg']);
    }

    session_write_close();
?>