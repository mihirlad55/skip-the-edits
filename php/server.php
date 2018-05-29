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

        $check = "SELECT * FROM Users WHERE email = '$email'";
        $result = $conn->query($check);

        if ($result->num_rows == 0) {
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $_SESSION['email'] = $email;
                $_SESSION['hash'] = $hash;
                header('location: ../register/');
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
            unset($_SESSION['email']);
            unset($_SESSION['hash']);
            $_SESSION['success'] = "Account succesfully registered. Login to continue.";
            header('location: ../login/');
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
            header('location: ../home/?sort=newest');
        } else {
            $errors[] = "Email or password is incorrect.";
        }
    }

    if (isset($_GET['sort'])) {
        if ($_GET['sort'] == 'newest') {
            $sql = "SELECT * FROM Essays";
        } else if ($_GET['sort'] == 'premium') {
            $sql = "SELECT * FROM Essays WHERE editorType='premium'";
        } else if ($_GET['sort'] == 'free') {
            $sql = "SELECT * FROM Essays WHERE editorType='free'";
        }
        
        $result = $conn->query($sql);

        while ($row = $result->fetch_assoc()) {
            $essays[] = $row;
        }
        $essays = array_reverse($essays);
    }

    if (isset($_GET['logout'])) {
        session_destroy();
        header('location: ../login/');
    }
?>