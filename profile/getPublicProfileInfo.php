<?php

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

    if ($_SERVER["REQUEST_METHOD"] != "GET") die("Not a GET request.");

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/dbconnect.php");

    session_start();
    $userId = $_SESSION["user"]["id"];
    session_abort();

    $queryString = "SELECT
                        Users.id,
                        CONCAT(Users.firstName, ' ', Users.lastName) As fullName,
                        Users.profession,
                        Users.twitterHandle,
                        Users.website,
                        Users.location,
                        Users.bio,
                        Users.profileViews,
                        AVG(
                            CASE UserApprovalRatings.rating
                                WHEN 'APPROVE' THEN 1
                                WHEN 'DISAPPROVE' THEN -1
                                WHEN 'NONE' THEN 0
                                ELSE 0
                            END
                        ) AS approvalRating,
                        (
                            SELECT
                                COUNT(*)
                            FROM 
                                UserApprovalRatings
                            WHERE
                                userIdRated = ${userId}
                        ) AS numberOfRatings,
                        (
                            SELECT
                                COUNT(*)
                            FROM
                                Edits
                            WHERE
                                editorId = ${userId}
                        ) AS numberOfEdits
                    FROM 
                        Users
                    LEFT JOIN
                        UserApprovalRatings
                    ON
                        UserApprovalRatings.userIdRated = Users.id
                    WHERE
                        Users.id = ${userId}
                    GROUP BY
                        Users.id";
                    	
    if (!($result = $conn->query($queryString)))
    {
        session_abort();
        die($conn->error);
    }
    
    echo(json_encode($result->fetch_assoc()));

    $queryString = "UPDATE
                        Users
                    SET 
                        profileViews = profileViews + 1
                    WHERE
                        id = ${userId}";

    if (!($result = $conn->query($queryString)))
    {
        session_abort();
        die($conn->error);
    }
?>