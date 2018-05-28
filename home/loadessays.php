<?php foreach ($essays as $essay): ?>
    <div class="content tile">
        <?php if ($essay['editorType'] == 'premium'): ?>
            <img src="../img/star.png" class="premium">
        <?php endif ?>
        <p class="essayname"><?php echo $essay['title'] ?></p>
        <div class="preview">
            <?php echo file_get_contents('../files/' . $essay['id'] . '.txt', true) ?>
        </div>
        <div class="desc">
            <p class="essaytitle"><?php echo $essay['title'] ?></p>
            <p class=""><?php echo $essay['instructions'] ?></p>
            <div class="buttonbar">
                <a href="../view?id=<?php echo $essay['id'] ?>">View</a>
                <a href="../edit?id=<?php echo $essay['id'] ?>">Edit</a>
            </div>
        </div>
    </div>
<?php endforeach ?>