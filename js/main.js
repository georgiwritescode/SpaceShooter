var game = new Phaser.Game(1200, 640, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
});

var sniper;
var rockets;
var fireRate = 100;
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

    //create the animation
    var walk = sniper.animations.add('walk');
    sniper.animations.play('walk',8,true);

    //enable physics
    game.physics.enable(sniper,Phaser.Physics.ARCADE);
    sniper.anchor.set(0.5, 0.5);

    //collisions
    sniper.body.collideWorldBounds = true;
    sniper.body.allowRotation = true;

    //rockets
    rockets = game.add.group();
    rockets.enableBody = true;
    rockets.physicsBodyType = Phaser.Physics.ARCADE;

    rockets.createMultiple(10000, 'rocket');
    rockets.setAll('checkWorldBounds', true);
    rockets.setAll('outOfBoundsKill', true);

}
function update() {
    // add math.pi/2 so the front follows the mouse pointer
    //otherwise it's a bit sideways
    sniper.rotation = game.physics.arcade.angleToPointer(sniper) + Math.PI/2;

     //disabled the right-click popUp menu in the html file
    //body oncontextmenu="return false"
    if(game.input.activePointer.rightButton.isDown){
        moveToPosition();
    }else if (game.input.activePointer.leftButton.isDown){

       // console.log(pos.x,pos.y);
        fire();
    }
}

function fire() {
    // countDead() and getFirstDead are nice to have since the game might be expanded
    if (game.time.now > nextFire && rockets.countDead() > 0){
        nextFire = game.time.now + fireRate;
        var rocket = rockets.getFirstDead();
        rocket.reset(sniper.x - 8 , sniper.y - 8);

        //declare tweens on scope in order to avoid bugs,
        //and rockets moving with the player
        var tween;
        var pos = game.input.activePointer.position;
        tween = this.game.add.tween(rocket).to({
            x: pos.x,
            y: pos.y
        }, 1000, Phaser.Easing.Linear.None, true);
    }

    //does not work
    /*if(tween.pos.x === target.targetX && tween.pos.y === target.targetY ){
        console.log('boom');
    }*/
    //just control msg to check if all is ok
    console.log('shooting');

}

function moveToPosition(){
    var tween;
    //moveToXY only sets the vector but does not stop the sprite when needed
    //and without the tween the player overshoots the arriving point
    var pos = game.input.activePointer.position;

    tween = this.game.add.tween(sniper).to({
        x: pos.x,
        y: pos.y
    }, 1000, Phaser.Easing.Linear.None, true);
}