<?php foreach ($essays as $essay): ?>
    <a class="content tile" href="../edit?id=<?php echo $essay['id'] ?>">
        <p class="essayname"><?php echo $essay['title'] ?></p>
        <div class="preview">
            <?php echo file_get_contents('../files/' . $essay['id'] . '.txt', true) ?>
        </div>
    </a>
<?php endforeach ?>