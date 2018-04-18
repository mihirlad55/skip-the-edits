<?php
    $_POST['retrieveessays'] = 1;
    include_once('../server.php');
?>
<html lang="en">
<head>
    <meta enctype="utf-8">
    <meta name="viewport" content="device=device-width, intial-scale=1.0">
    <title>Edit an Essay</title>
    <link href="../default.css" rel="stylesheet"/>
    <link href="home.css" rel="stylesheet"/>
</head>
<body>
    <header id="header-main">
        <img class="navbar-icon" src="../img/logo-nb.png" id="logo"/>
        <a class="navbar-icon" id="iconAvatar" href="../..">
            <img src="../img/avatar.png" />
        </a>
        <a class="navbar-icon" id="iconNotification">
            <img src="../img/notification.png"/>
        </a>
        <a class="navbar-icon" id="iconUpload" href="../../upload">
            <img src="../img/upload.png"/>
        <a/>
        <a class="navbar-icon" id="iconHome" href="../../home">
            <img src="../img/home.png"/>
        </a>
    </header>
    <header id="header-secondary">
        <h1>Edit an Essay</h1>
        <h2><?php echo count($essays) . " Essays found" ?></h2>
    </header>
    <div>
        
    </div>
</body>
</html>