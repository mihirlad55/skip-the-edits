<?php
function readDocx($filename)
{
    $zip = zip_open($filename);
    $content = "";
    
    if (!$zip || is_numeric($zip)) return false;
    
    while ($zip_entry = zip_read($zip))
    {
        if (zip_entry_open($zip, $zip_entry) == false) continue;
        if (zip_entry_name($zip_entry) != "word/document.xml") continue;
        
        $content .= zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));
        
        zip_entry_close($zip_entry);
    }
    
    zip_close($zip);
    
    $content = str_replace('</w:r></w:p></w:tc><w:tc>', " ", $content);
    $content = str_replace("</w:r></w:p>", "\r\n", $content);
    return strip_tags($content);

}

function readDoc($filename)
{
    $fileHandle = fopen($filename, "r");
    $line = @fread($fileHandle, filesize($filename));
    $lines = explode(chr(0x0D), $line);
    $content = "";
    
    foreach($lines as $thisline)
    {
        $pos = strpos($thisline, chr(0x00));
        
        if ( ($pos !== false) || strlen($thisline) == 0)
        { }
        else
        {
            $outtext .= $thisline . " ";
        }
        
        return preg_replace("/[^a-zA-Z0-9\s\,\.\-\n\r\t@\/\_\(\)]/", "", $outtext);
    }
}

?>