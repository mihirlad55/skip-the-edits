<?php
    include_once('dbconnect.php');
    session_start();
    $errors = array();
    $essays = array();
    $logemail = '';

    if (isset($_POST['initial'])) {
        $email = $conn->real_escape_string($_POST['email']);
        $pass = $conn->real_escape_string($_POST['password']);
        $cpass = $conn->real_escape_string($_POST['cpassword']);
        $hash = password_hash($pass, PASSWORD_DEFAULT);    
        $_SESSION['email'] = $email;
        $_SESSION['hash'] = $hash;

        $check = "SELECT * FROM Users WHERE email = '$email'";
        $result = $conn->query($check);

        if ($result->num_rows == 0) {
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                if (strlen($pass) > 5) {
                    if ($pass == $cpass) {
                        header('location: ../register/register.html');
                    } else {
                        $errors[] = "Passwords do not match.";
                    }
                } else {
                    $errors[] = "Password must be at least 6 characters.";
                }
            } else {
                $errors[] = "Please enter a valid email address.";
            }
        } else {
            $errors[] = "An account has already been registered with this email.";
        }
    }

    if (isset($_POST['register'])) {
        $email = $_SESSION['email'];
        $hash =  $_SESSION['hash'];
        
        $firstname = $conn->real_escape_string($_POST['firstname']);
        $lastname = $conn->real_escape_string($_POST['lastname']);
        $acctype = $conn->real_escape_string($_POST['acctype']);

        $sql = "INSERT INTO Users (email, password, firstName, lastName, accountType)
                VALUES ('$email', '$hash', '$firstname', '$lastname', '$acctype')";

        if ($conn->query($sql) === true) {
            $_SESSION['user'] = array('email' => $email, 'password' => $hash, 'firstName' => $firstname,
                                    'lastName' => $lastname, 'accountType' => $acctype);
            $_SESSION['msg'] = "Welcome to the Skip the Edits, " . $firstname . "!";

            header('location: ../home/home.html');
        } else {
            $errors[] = "There was an error registering your account. Please try again later.";
        }
    }

    if (isset($_POST['login'])) {
        $email = $conn->real_escape_string($_POST['email']);
        $GLOBALS['logemail'] = $email;
        $pass = $conn->real_escape_string($_POST['password']);

        $sql = "SELECT * FROM Users WHERE email = '$email'";
        $result = $conn->query($sql);
        $user = $result->fetch_assoc();

        if (($result->num_rows > 0) and (password_verify($pass, $user['password']))) {
            $_SESSION['user'] = array('id' => $user['id'], 'firstName' => $user['firstName'], 'lastName' => $user['lastName'],
                                        'accountType' => $user['accountType']);
            $_SESSION['msg'] = "Welcome back, " . $_SESSION['user']['firstName'] . "!";
            header('location: ../home/home.html');
        } else {
            $errors[] = "Email or password is incorrect.";
        }
    }

    if (isset($_POST['retrieveessays'])) {
        $sql = "SELECT * FROM Essays";
        $result = $conn->query($sql);

        while ($row = $result->fetch_assoc()) {
            $essays[] = $row;
        }
        $essays = array_reverse($essays);
    }

    if (isset($_GET['logout'])) {
        session_destroy();
        header('location: login.html');
    }
?>