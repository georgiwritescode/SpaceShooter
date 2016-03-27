var game = new Phaser.Game(1200, 640, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
});

var sniper;
var rockets;
var fireRate = 100;
var nextFire = 0;
var tween;

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
    sniper.body.allowRotation = true;



    rockets = game.add.group();
    rockets.enableBody = true;
    rockets.physicsBodyType = Phaser.Physics.ARCADE;

    rockets.createMultiple(10000, 'rocket');
    rockets.setAll('checkWorldBounds', true);
    rockets.setAll('outOfBoundsKill', true);
    //rockets.checkWorldBounds = true;
    //rockets.body.collideWorldBounds = true;
}
function update() {
    // add math.pi/2 so the front follows the mouse pointer
    sniper.rotation = game.physics.arcade.angleToPointer(sniper) + Math.PI/2;
    if(game.input.activePointer.rightButton.isDown){
        moveToPosition();
    }else if (game.input.activePointer.leftButton.isDown){
        fire();
    }
}

function fire() {

    if (game.time.now > nextFire && rockets.countDead() > 0){
        nextFire = game.time.now + fireRate;
        var rocket = rockets.getFirstDead();
        rocket.reset(sniper.x - 8 , sniper.y - 8);
        game.physics.arcade.moveToPointer(rocket, 300);
    }

    console.log('shooting')
}

function moveToPosition(){
   // var pos = game.physics.arcade.moveToPointer(sniper,100);
    //game.physics.moveToXY(this.game.activePointer = game.width);
   // game.physics.activePointer.circle.contains(sniper.x,sniper.y);
    var pos = game.input.activePointer.position;
    tween = this.game.add.tween(sniper).to({
        x: pos.x,
        y: pos.y
    }, 1000, Phaser.Easing.Linear.None, true);

}