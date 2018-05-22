<?php

    function sendQuery($queryString, $showError = true)
    {
    	global $conn, $result;
    	if ($result = $conn->query($queryString))
        {
        	return true;
        }
        else
        {
        	if ($showError) die("Error: " . $conn->error);	
        }
    }
    

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
    
    
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        
		
        $image = $_FILES["profilePicture"];
        
        if ($image["type"] == "image/jpeg" || $image["type"] == "image/tif")
        {
            $fixedImage = fixImageOrientation(imagecreatefromstring(file_get_contents($image["tmp_name"])), $image["tmp_name"]);
        }
        else
        {
            $fixedImage = imagecreatefromstring(file_get_contents($image["tmp_name"]));
        }


        session_start();
        if ($_SESSION["isTeacher"])
        {
            $validTypes = [ "image/jpeg", "image/png", "image/gif" ];
            $ext = str_replace("image/", "", $image["type"]);
            $userID = $_SESSION["userID"];
            $newFilePath = "/home/ec2-user/environment/skip-the-edits/img/profilePictures/" . $userID . ".jpeg";
            $_SESSION["profilePicturePath"] = $userID . ".jpeg";
    
            session_write_close();
            
            if ($image != null)
            {
    
             /*   $newImgPath = getRandomString();
                
                if (!file_exists("/home/ubuntu/workspace/profilePictures/" . $username . "." . $ext ))
                {
                    $newImgPath = getRandomString();
                }
                
                sendQuery("UPDATE " . DB_NAME . ".users SET profilePicturePath='" . $newImgPath . "." . $ext . "' WHERE username='" . $username . "'");
        
            */
                if (file_exists($newFilePath))
                {
                    unlink($newFilePath);
                }
            
                if (in_array($image["type"], $validTypes) && intval($image["size"]) < 2000000)
                {
                    imagejpeg($fixedImage, $newFilePath);
                }
            }
            else
            {
                imagejpeg(imagecreatefromstring(file_get_contents("/images/defaultprofilepicture.png")), $newFilePath);
            }
        }
        else
        {
            echo "Error";
        }
    }
?>