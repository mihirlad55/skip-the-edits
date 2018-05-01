<?php foreach ($essays as $essay): ?>
    <a class="content tile" href="../view/view.html?id=<?php echo $essay['id'] ?>">

        <p><?php echo $essay['title'] ?></p>
    </a>
<?php endforeach ?>