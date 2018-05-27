<script>
    function closemodal() {
        document.getElementById("modal").style.display = "none";
    }
</script>
<div id="modal">
    <div id="popup">
        <a id="close" onclick="closemodal()">&times;</a>
        <div id="popuptext">
            <p style="font-size:1rem; font-weight:bold; padding-top:1.875rem">Alert</p>
            <p id="alert"><?php echo $_SESSION['msg'] ?></p>
        </div>
    </div>
</div>