<?php

//===========================================================================
// FIX ORIENTATION OF IMAGE BASED ON EXIF DATA
//===========================================================================
function fixImageOrientation($image, $filePath)
{
    // Read the EXIF data from the image with the file path $filePath
    $exif = exif_read_data($filePath);
    
    // If EXIF data exists for the image...
    if (!empty($exif["Orientation"])) {
        // Go through possible cases of image orientation; rotate accordingly
        switch ($exif["Orientation"]) {
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
        // Return the rotated image to the function caller
        return $image;
    }
    // Return the rotated image to the function caller
    return $image;
}
