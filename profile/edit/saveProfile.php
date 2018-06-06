<?php

// Execute logincheck.php to check if user is logged in
require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");


// Check if REQUEST_METHOD is POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    // Kill script and print error
    die("Not a POST request.");
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


// Escape special characters from POST variables and assign to new variables
$firstName = $conn->real_escape_string($_POST["firstName"]);
$lastName = $conn->real_escape_string($_POST["lastName"]);
$profession = $conn->real_escape_string($_POST["profession"]);
$location = $conn->real_escape_string($_POST["location"]);
$twitterHandle = $conn->real_escape_string($_POST["twitterHandle"]);
$website = $conn->real_escape_string($_POST["website"]);
$bio = $conn->real_escape_string($_POST["bio"]);


// Include function for fixing image orientation
require_once('fixImageOrientation.php');

// Set file object to $image variable
$image = $_FILES["file"];

// If a file was uploaded...
if ($_FILES['file']['tmp_name'] != '') {
    // If image type is jpeg or tif...
    if ($image["type"] == "image/jpeg" || $image["type"] == "image/tif") {
        // Extract image data into $fileData
        $fileData = file_get_contents($image["tmp_name"]);
        // Create image object from file data
        $imageObj = imagecreatefromstring($fileData);
        // Fix image orientation and set it to $fixedImage
        $fixedImage = fixImageOrientation($imgObj, $image["tmp_name"]);
    } else {
        // Set $fixedImage to imageObject from file
        $fixedImage = imagecreatefromstring(file_get_contents($image["tmp_name"]));
    }

    // Array of valid image types
    $validTypes = [ "image/jpeg", "image/png", "image/gif" ];
    // Get extension of file
    $ext = str_replace("image/", "", $image["type"]);
    // Set new file path with .png extension and userId as the filename
    $newFilePath = "${_SERVER['DOCUMENT_ROOT']}/img/profile/" . $userId . ".png";
    
    // If file already exists with this path, delete it
    if (file_exists($newFilePath)) {
        unlink($newFilePath);
    }

    // Check if type of image uploaded matches one of valid types; check size
    if (in_array($image["type"], $validTypes) && intval($image["size"]) < 2000000) {
        // Create image at $newFilePath
        imagejpeg($fixedImage, $newFilePath);
    } else {
        // If a session has not been started, start a session
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        // Set msg of $_SESSION variable to error message
        $_SESSION['msg'] = "File Too Large!";
        
        // Save session variables and close it
        session_write_close();

        // Kill the script and print error message
        die("File too Large!");
    }
}

/*
 * Update the Users table and set the new information in the row where the user
 * ID matches the logged in user's ID
 */
$queryString = "UPDATE
                    Users 
                SET
                    firstName = '${firstName}',
                    lastName = '${lastName}',
                    profession = '${profession}',
                    location = '${location}',
                    website = '${website}',
                    twitterHandle = '${twitterHandle}',
                    bio = '${bio}'
                WHERE 
                    id = ${userId}";

// Try querying the database and assigning the result to $result
if (!($result = $conn->query($queryString))) {
    // Stop the session
    session_abort();
    // Kill the script and print the error
    die($conn->error);
}

// If a session has not been started, start a session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set the msg SESSION varaible
$_SESSION['msg'] = "Profile Saved!";

// Save the SESSION variables and close the session
session_write_close();

// Redirect the user to his/her profile page
header("Location: /profile?id=${userId}");
