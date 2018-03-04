<?php
session_start();
include_once 'dbconnect.php';
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Skip the Edits</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  </head>
  <body>
    <nav class="navbar navbar-default" role="navigation">
      <?php if (isset($_SESSION['user'])) { ?>
      <li><p>Signed in as <?php echo $_SESSION['user']; ?></p></li>
      <li><a href="logout.php">Log Out</a></li>
    <?php } else { ?>
      <li><a href="login.php">Login</a></li>
      <li><a href="register.php">Sign up</a></li>
    <?php } ?>
  <body>
</html>
