<?php
    require_once('dbconnect.php');
    session_start();
    $essays = array();

    if (isset($_POST['register'])) {
        $username = $conn->real_escape_string($_POST['username']);
    }

    if (isset($_POST['retrieveessays'])) {
        $sql = "SELECT * FROM Essays";
        $result = $conn->query($sql);

        while ($row = $result->fetch_assoc()) {
            $essays[] = $row;
        }
        $essays = array_reverse($essays);
    }
?>