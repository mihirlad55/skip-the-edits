<?php

$conn;
$result;


function sendQuery($queryString, $showError = true)
{
	global $conn, $result;
	if ($result =$conn->query($queryString))
    {
    	return true;
    }
    else
    {
    	if ($showError) die("Error: " . $conn->error);	
    }
}

	//if the script is called by a get request, then continue
	 if ($_SERVER['REQUEST_METHOD'] === 'GET')
    {
    	session_start();
    	if ($_SESSION["isTeacher"])
    	{
    		session_write_close();
			//create constant variables to hold the details of the sql server and credentials
			define("DB_NAME", "id69779_posts");
			define("DB_USER", "id69779_root");
			define("DB_HOST", "localhost");
			define("DB_PASSWORD", "145willow21");
			
			//connect to the sql databse
			$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
			
			//if connection fails, exit and send error message
			if ($conn->connect_error) {
				die("Could not connect: " . $conn->connect_error);
			}
			
			sendQuery("SET time_zone = '-05:00'");
			session_start();
			$userID = $_SESSION["userID"];
			session_write_close();
			sendQuery("SELECT * FROM " . DB_NAME . ".presetTable WHERE userID=$userID");
			
			$postList = array();
			
			//send command query to sql to retreive posts and store the announcemetns in the result variable
	
			session_start();
			$resultNum = 0;
			//fetch an associative array from the result and insert each row into the postList array
			while ($row = $result->fetch_assoc())
			{
		    	$postList[$resultNum] = $row;
				$resultNum = $resultNum + 1;
			}
			
			//send the array back to the requester
			echo json_encode($postList);
    	}
	}
    else
    {

    }

?>