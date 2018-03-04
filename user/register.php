<?php
session_start();

if(isset($_SESSION['user'])) {
  header("Location:homepage.php");
}

include_once 'dbconnect.php';

$error = false;

//check if form has been submitted
if(isset($_POST['signup'])) {
  $username = mysqli_real_escape_string($con, $_POST['username']);
  $email = mysqli_real_escape_string($con, $_POST['email']);
  $password = mysqli_real_escape_string($con, $_POST['password']);
  $epassword = md5($password);
  $cpassword = mysqli_real_escape_string($con, $_POST['cpassword']);
  $ecpassword = md5($cpassword);

  if (!preg_match("/^[a-zA-Z ]+$/",$username)) {
    $error = true;
    $username_error = "Username must contain only letters";
  }

  if(!filter_var($email,FILTER_VALIDATE_EMAIL)) {
    $error = true;
    $email_error = "Please enter Valid Email Adress";
  }
  if(strlen($password) < 6) {
    $error = true;
    $password_error = "Password must be minimum of 6 characters";
  }
  if($epassword != $ecpassword) {
    $error = true;
    $ecpassword_error = "Password's don't match";
  }
  if (!$error) {
    if(mysqli_query($con, "INSERT INTO users(username,email,password) VALUES( '".$username."','".$email."','".$epassword."')")) {
      $successmsg = "Successfully Registered! <a href='login.php'>Click here to login</a>";
    } else {
      $errormsg = "Error in registering...Please try again later!";
    }
  }
}
?>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Skip the Edits</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <head>
  <body>
    <form role="form" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" name="register">
      <label>Username</label> <br>
      <input type="text" name="username" placeholder="Your Username" required/>
      <span class="text-danger"><?php if (isset($username_error)) echo $username_error; ?></span>
      <br><br>
      <label>Email</label> <br>
      <input type="email" name="email" placeholder="Your Email" required/>
      <span class="text-danger"><?php if (isset($email_error)) echo $email_error; ?></span>
      <br><br>
      <label>Password</label> <br>
      <input type="password" name="password" placeholder="Your Password" required/>
      <span class="text-danger"><?php if (isset($password_error)) echo $password_error; ?></span>
      <br><br>
      <label>Confirm Password</label> <br>
      <input type="password" name="cpassword" placeholder="Confirm Password" required/>
      <span class="text-danger"><?php if (isset($ecpassword_error)) echo $ecpassword_error; ?></span>
      <br><br>
      <input type="submit" name="signup" value="Sign Up" class="btn btn-primary" />
    </form>
    <span class="text-success"><?php if(isset($successmsg)) { echo $successmsg; } ?></span>
    <span class="text-danger"><?php if(isset($errormsg)) { echo $errormsg; } ?></span>
    <p>Already Registered? <a href="login.php">Login Here</a></p>
  </body>
</html>
