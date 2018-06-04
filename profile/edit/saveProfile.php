<?php

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/logincheck.php");

    if ($_SERVER["REQUEST_METHOD"] != "POST") die("Not a POST request.");

    require_once("${_SERVER['DOCUMENT_ROOT']}/php/dbconnect.php");

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    $userId = $_SESSION["user"]["id"];
    session_abort();

    $firstName = $conn->real_escape_string($_POST["firstName"]);
    $lastName = $conn->real_escape_string($_POST["lastName"]);
    $profession = $conn->real_escape_string($_POST["profession"]);
    $location = $conn->real_escape_string($_POST["location"]);
    $twitterHandle = $conn->real_escape_string($_POST["twitterHandle"]);
    $website = $conn->real_escape_string($_POST["website"]);
    $bio = $conn->real_escape_string($_POST["bio"]);

    function fixImageOrientation($image, $filePath)
    {
        $exif = exif_read_data($filePath);
        
        if (!empty($exif["Orientation"]))
        {
            switch($exif["Orientation"])
            {
                case 3:
                    $image = imagerotate($image, 180, 0);
                    break;
                case 6:
                    $image = imagerotate($image, -90, 0);
                    break;
                case 8:
                    $image = imagerotate($image, 90, 0);
                    break;
            }
            return $image;
        }
        return $image;
    }
    
    $image = $_FILES["file"];
        
    if ($_FILES['file']['tmp_name'] != '') {
        if ($image["type"] == "image/jpeg" || $image["type"] == "image/tif") {
            $fixedImage = fixImageOrientation(imagecreatefromstring(file_get_contents($image["tmp_name"])), $image["tmp_name"]);
        } else {
            $fixedImage = imagecreatefromstring(file_get_contents($image["tmp_name"]));
        }

        $validTypes = [ "image/jpeg", "image/png", "image/gif" ];
        $ext = str_replace("image/", "", $image["type"]);
        $newFilePath = "${_SERVER['DOCUMENT_ROOT']}/img/profile/" . $userId . ".png";    
        

        if (file_exists($newFilePath)) {
            unlink($newFilePath);
        }
    
        if (in_array($image["type"], $validTypes) && intval($image["size"]) < 2000000) {
            imagejpeg($fixedImage, $newFilePath);
        } else {
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            $_SESSION['msg'] = "File Too Large!";
            session_write_close();
            die("File too Large!");
        }
    }

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
                    	
    if (!($result = $conn->query($queryString)))
    {
        session_abort();
        die($conn->error);
    }

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['msg'] = "Profile Saved!";
    session_write_close();

    header("Location: /profile?id=${userId}");

?>