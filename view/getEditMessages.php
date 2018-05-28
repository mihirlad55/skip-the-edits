<?php

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET Request!");
    
    require_once("../php/dbconnect.php");
    
    $essayId = $conn->real_escape_string($_GET["id"]);
    
    session_start();
    $userId = $_SESSION["user"]["id"];
    session_abort();
    
    $query = "
            SELECT
            	EditMessages.id, 
            	EditMessages.editId, 
                Edits.editorId, 
                EditMessages.message,
                SUM(
            		CASE MessageRatings.rating 
            			WHEN 'LIKE' THEN 1
            			WHEN 'DISLIKE' THEN -1
            			WHEN 'NONE' THEN 0
                        ELSE 0
            		END
            	) AS ratingTotal,
                IF(MessageRatings.userId = $userId, MessageRatings.rating, 'NONE') AS ratingUser,
                CONCAT(Users.firstName, ' ', Users.lastName) As editorFullName,
                Users.profession,
                AVG(
            		CASE UserApprovalRatings.rating
            			WHEN 'APPROVE' THEN 1
                        WHEN 'DISAPPROVE' THEN -1
                        WHEN 'NONE' THEN 0
                        ELSE 0
            		END
                ) AS approvalRating
            FROM 
            	Edits
            INNER JOIN
            	EditMessages
            ON
            	EditMessages.editId = Edits.id
            LEFT JOIN
                MessageRatings
            ON
            	MessageRatings.messageId = EditMessages.id
            INNER JOIN
                Users
            ON
            	Edits.editorId = Users.id
            LEFT JOIN
                UserApprovalRatings
            ON
            	UserApprovalRatings.userIdRated = Edits.editorId
            WHERE
                Edits.essayId = $essayId
			GROUP BY
				EditMessages.id";
    
    $result;
    
    if ( !($result = $conn->query($query)) ) die($conn->error());
    
    $editMessages = Array();
    
    while ($row = $result->fetch_assoc())
    {
        $row["id"] = intval($row["id"]);
        $row["editorId"] = intval($row["editorId"]);
        $row["editId"] = intval($row["editId"]);
        $row["ratingTotal"] = intval($row["ratingTotal"]);
        $row["approvalRating"] = intval($row["approvalRating"]);
        array_push($editMessages, $row);
    }
    
    echo(json_encode($editMessages));
?>