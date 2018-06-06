<?php

// Execute logincheck.php to check if user is logged in
require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

// Check if REQUEST_METHOD is GET
if ($_SERVER["REQUEST_METHOD"] != "GET") {
    // Kill script and print error
    die("Not a GET request.");
}

// Connect to the MySQL database
require_once("${_SERVER['DOCUMENT_ROOT']}/php/dbconnect.php");

// If a session has not been started, start a session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Get ID of logged on user from $_SESSION variable
$userId = $_SESSION["user"]["id"];
// Stop the session
session_abort();

/*
 * Create MySQL query that gets user's userId, profession, twitterhandle,
 * website, location, bio, profileViews, approval rating, and number of ratings
 * where the user's ID matches the logged in user's IDand returns it as a
 * single row
 */
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

// Try querying the database and assigning the result to $result
if (!($result = $conn->query($queryString))) {
    // Kill the script, and print the error
    die($conn->error);
}

// Print out the JSON encoded $result associative row
echo(json_encode($result->fetch_assoc()));

/*
 * Create a MySQL query string that updates the number of profile views for the
 * user in the Users table where the row ID matches the user's ID
 */
$queryString = "UPDATE
                    Users
                SET 
                    profileViews = profileViews + 1
                WHERE
                    id = ${userId}";

// Try querying the database and assigning the result to $result
if (!($result = $conn->query($queryString))) {
    // Kill the script, and print the error
    die($conn->error);
}
