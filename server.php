<?php
    /*require_once('dbconnect.php');*/
    $conn = new mysqli('localhost', 'root', '', 'test');
    $essays = array();

    if (isset($_POST['register'])) {
        
    }

    if (isset($_POST['retrieveessays'])) {
        $sql = "SELECT * FROM essays";
        $result = $conn->query($sql);

        while ($row = $result->fetch_assoc()) {
            $essays = $row;
        }
        $essays = array_reverse($essays);
    }
?>