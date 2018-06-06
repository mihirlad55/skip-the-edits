<?php

//=============================================================================
// READ A .DOCX FILE AND RETURN THE TEXT WITHIN THE FILE
//=============================================================================
function readDocx($filename)
{
    // Open the document archive and set it equal to $zip
    $zip = zip_open($filename);
    // Initialize the $content variable
    $content = "";
    
    // If the zip does not exist, return false
    if (!$zip || is_numeric($zip)) {
        return false;
    }

    // While there are more files within the zip, read the next line
    while ($zip_entry = zip_read($zip)) {
        // If the current entry is not openable
        if (zip_entry_open($zip, $zip_entry) == false) {
            // Skip the rest of the code in the loop and return to begining
            continue;
        }
        // If the current file within the zip isn't word/document.xml
        if (zip_entry_name($zip_entry) != "word/document.xml") {
            // Skip the rest of the code in the loop and return to begining
            continue;
        }

        // Read the content within the file and add it to the $content string
        $content .= zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));
        
        // Close the zip entry
        zip_entry_close($zip_entry);
    }
    
    // Close the zip archive
    zip_close($zip);
    
    // Remove these tags within the document
    $content = str_replace('</w:r></w:p></w:tc><w:tc>', " ", $content);
    // Replace these tags with newline characters
    $content = str_replace("</w:r></w:p>", "\r\n", $content);
    // Return the document content without the XML tags
    return strip_tags($content);
}


//=============================================================================
// READ A .DOC FILE AND RETURN THE TEXT WITHIN THE FILE
//=============================================================================
function readDoc($filename)
{
    // Open the file for editing and set the handle to $fileHandle
    $fileHandle = fopen($filename, "r");
    // Read the next line of the file and set it to $line
    $line = @fread($fileHandle, filesize($filename));
    // Split the document into multiple lines every time the /r char is found
    $lines = explode(chr(0x0D), $line);
    // Set $content to an empty string
    $content = "";

    // For each line in the document...
    foreach ($lines as $thisline) {
        // Get the index position of the nul character in the line
        $pos = strpos($thisline, chr(0x00));

        // If the character doesn't exist or the length of the line is 0
        if (($pos !== false) || strlen($thisline) == 0) {
        } else {
            // Else add this line to the $outtext variable
            $outtext .= $thisline . " ";
        }
        
        // Return the text with only these characters present:
        return preg_replace("/[^a-zA-Z0-9\s\,\.\-\n\r\t@\/\_\(\)]/", "", $outtext);
    }
}
