<?php
    include_once('dbconnect.php');
    session_start();
    $essays = array();

    if (isset($_POST['initial'])) {
        $email = $conn->real_escape_string($_POST['email']);
        $pass = $conn->real_escape_string($_POST['password']);
        header('location: register.html');
    }

    if (isset($_POST['register'])) {
        $hash = password_hash($pass, PASSWORD_DEFAULT);
        $firstname = $conn->real_escape_string($_POST['firstname']);
        $lastname = $conn->real_escape_string($_POST['lastname']);
        $acctype = $conn->real_escape_string($_POST['acctype']);

        $check = "SELECT * FROM users WHERE email = '$email'";
        $result = $conn->query($check);

        if ($result->num_rows == 0) {
            if (strlen($username) > 5 and strlen($password) > 5) {
                $hash = password_hash($password, PASSWORD_DEFAULT);

                $sql = "INSERT INTO users (email, pass, firstname, lastname, acctype)
                        VALUES ('$email', '$hash', '$firstname', '$lastname', '$acctype')";
                
                if ($conn->query($sql) === true) {
                    $_SESSION['msg'] = "Welcome to the Skip the Edits, " . $firstname . "!";
                    $_SESSION['user'] = array('email' => $email, 'firstname' => $firstname, 'lastname' =>  $lastname);
                    header('location: home.php');
                } else {
                    $errors[] = "There was an error registering your account. Please try again later.";
                }
            } else {
                $errors[] = "Username and password must be at least 6 characters.";
            }
        } else {
            $errors[] = "An account has already been registered with this email.";
        }
    }

    if (isset($_POST['login'])) {
        $email = $conn->real_escape_string($_POST['email']);
        $pass = $conn->real_escape_string($_POST['password']);

        $sql = "SELECT * FROM accounts WHERE email = '$email'";
        $result = $conn->query($sql);
        $user = $result->fetch_assoc();

        if (($result->num_rows > 0) and (password_verify($pass, $user['pass']))) {
            $_SESSION['user'] = $result;
            $_SESSION['msg'] = "Welcome back, " . $_SESSION['user']['firstname'] . "!";
            header('location: home.html');
        } else {
            $errors[] = "Username or password is incorrect";
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
?>