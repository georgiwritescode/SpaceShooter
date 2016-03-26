var game = new Phaser.Game(1200, 640, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
});

var sniper;
var rocket;
var fireRate = 40;
var nextFire = 0;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#252729';
    game.load.spritesheet('sniper','resources/sniper.png',53,63,7);
    game.load.spritesheet('rocket','resources/rocket.png',26,49,3);
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //sniper sprites and animations
    sniper = game.add.sprite(600,320,'sniper');
    var walk = sniper.animations.add('walk');
    sniper.animations.play('walk',8,true);
    game.physics.enable(sniper,Phaser.Physics.ARCADE);
    sniper.anchor.set(0.5, 0.5);
    sniper.body.collideWorldBounds = true;
    sniper.body.allowRotation = false;

    //rocket
    //rocket = game.add.sprite(600,300,'rocket');
    //var fly = rocket.animations.add('fly');
    //rocket.animations.play('fly',4,true);
    //game.physics.enable(rocket,Phaser.Physics.ARCADE);
    //rocket.body.velocity.set(300,300);
    //rocket.body.collideWorldBounds = true;

    rockets = game.add.group();
    rockets.enableBody = true;
    rockets.physicsBodyType = Phaser.Physics.ARCADE;
    rockets.createMultiple(10000, 'rocket');
    rockets.setAll('checkWorldBounds', true);
    rockets.setAll('outOfBoundsKill', false);

}
function update() {
    sniper.rotation = game.physics.arcade.angleToPointer(sniper);
    if(game.input.activePointer.rightButton.isDown){
        moveToPosition();
    }else if (game.input.activePointer.leftButton.isDown)
    {
        fire();
    }
}

function fire() {
    if (game.time.now > nextFire)
    {
        nextFire = game.time.now + fireRate;
        var rocket = rockets.getFirstDead();
        rocket.reset(sniper.x - 8 , sniper.y - 8);
    }
}

function moveToPosition(){
    game.physics.arcade.moveToPointer(sniper,400);
}