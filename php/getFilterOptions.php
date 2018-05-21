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
		
		$subjectList = array();
		$teacherList = array();
		
		//send command query to sql to retreive posts and store the announcemetns in the result variable
		sendQuery("SELECT subjectOf FROM " . DB_NAME . ".postsTable ORDER BY subjectOf ASC");
		
		$resultNum = 1;
		$subjectList = array("School");
		//fetch an associative array from the result and insert each row into the postList array
		while ($row = $result->fetch_assoc())
		{
		    if (!in_array($row["subjectOf"], $subjectList))
		    {
                $subjectList[$resultNum] = $row["subjectOf"];
			    $resultNum++;
		    }
		}
			
		sendQuery("SELECT teacherName FROM " . DB_NAME . ".postsTable ORDER BY teacherName ASC");
		$resultNum = 0;
		
		while ($row = $result->fetch_assoc())
		{
			if (!in_array($row["teacherName"], $teacherList))
			{
	            $teacherList[$resultNum] = $row["teacherName"];
	            $resultNum++;
			}
		}
		  
			
		//send the array back to the requester
		$filterList = array();
		$filterList[0] = json_encode($subjectList);
		$filterList[1] = json_encode($teacherList);
		
		echo json_encode($filterList);
	}
    else
    {

    }
?>