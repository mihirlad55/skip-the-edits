<?php

require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    die("Not a POST Request!");
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$editorId = $_SESSION["user"]["id"];
session_abort();

$changes = json_decode($_POST["changes"], true);
$essayId = $_POST["essayId"];

require_once("../php/dbconnect.php");

$message = $conn->real_escape_string($_POST["message"]);
    
$queryString = "INSERT INTO Edits (essayId, editorId) 
    VALUES (${essayId}, ${editorId})";

if (!$conn->query($queryString)) {
    die($conn->error());
}

$editId = $conn->insert_id;

foreach ($changes as $change) {
    $change['type'] = strtoupper($change['type']);
    
    $editorId = $conn->real_escape_string($editorId);
    $essayId = $conn->real_escape_string($essayId);
    $change['type'] = $conn->real_escape_string($change['type']);
    $change['startOffset'] = $conn->real_escape_string($change['startOffset']);
    $change['endOffset'] = $conn->real_escape_string($change['endOffset']);
    $change['comment'] = $conn->real_escape_string($change['comment']);

    
    $queryString = "INSERT INTO 
                        Changes (
                            editId,
                            type,
                            startOffset,
                            endOffset,
                            comment
                        )
                    VALUES (
                            ${editId},
                            '${change['type']}',
                            ${change['startOffset']},
                            ${change['endOffset']},
                            '${change['comment']}'
                    )";

    if (!$conn->query($queryString)) {
        die($conn->error());
    }
}

$queryString = "INSERT INTO 
                    EditMessages (editId, message)
                VALUES (${editId}, '${message}')";
    
if (!$conn->query($queryString)) {
    die($conn->error());
}
