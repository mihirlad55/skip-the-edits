<?php session_start(); ?>
<?php
  if (isset($_SESSION['user'])) { //Checking whether session is already there or not. If true, header will redirect to homepage directly
    header("Loaction:homepage.php");
  }

  include_once 'dbconnect.php';

  if (isset($_POST['login'])) { //Checks whether user clicked login
    $username = $conn->real_escape_string($_POST['username']);
    $password = $conn->real_escape_string($_POST['password']);

    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

      if ($row = mysqli_fetch_array($result)) {
        $_SESSION['user'] = $username;
        echo '<script type="text/javascript"> window.open("homepage.php","_self");</script>'; //Redirects to dashboard.php is successful
      } else {
        $errormsg = "Invalid Username or Password";
      }kfadsjflak;sdf


      dsafkjadsflkjadf
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
    <form role="form" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" name="login">
      <label>Username</label> <br>
      <input type="text" name="username" placeholder="Your Username" required/>
      <br><br>
      <label>Password</label> <br>
      <input type="password" name="password" placeholder="Your Password" required/>
      <br><br>
      <input type="submit" name="login" value="Login" class="btn btn-primary" />
    </form>
    <span class="text-danger"><?php if(isset($errormsg)) { echo $errormsg; } ?></span>
    <p>New User? <a href="register.php">Sign up here</a></p>
  </body>
</html>
