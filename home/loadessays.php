<?php foreach ($essays as $essay): ?>
    <a class="content tile" href="../edit?id=<?php echo $essay['id'] ?>">

        <p><?php echo $essay['title'] ?></p>
    </a>
<?php endforeach ?>