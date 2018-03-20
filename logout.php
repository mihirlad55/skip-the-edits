<?php
session_start();

if(isset($_SESSION['user'])) {
  session_destroy();
  unset($_SESSION['user']);
  header("Location: index.html");
} else {
  header("Location: index.html");
}
?>
