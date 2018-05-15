<link href="modal.css" type="text/css" rel="stylesheet">
<script>
    function closemodal() {
        document.getElementById("modal").style.display = "none";
    }
</script>
<div id="modal">
    <div id="popup">
        <a id="close" onclick="closemodal()">&times;</a>
        <p style="font-weight:bold; padding-top:30px">Alert</p>
        <p id="alert" style="font-size:14px"><?php echo $_SESSION['msg'] ?></p>
    </div>
</div>