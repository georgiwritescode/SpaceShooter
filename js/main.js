var game = new Phaser.Game(1200, 640, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
});

var sniper,
    rocket,
    explosion,
    startBtn;
//rockets need re-working
//if scoreboard is needed
//for faster rocket launch chang the following
var fireRate = 300;
var nextFire = 10;
var playing = false;
var explpode = false;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#252729';
    game.load.spritesheet('sniper','resources/sniper.png',53,63,7);
    game.load.spritesheet('rocket','resources/rocket.png',26,49,3);
    game.load.spritesheet('boom','resources/explosion.png',155.15, 128);
    game.load.image('startBtn','resources/start-game-button.png', 328, 59);
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
    rockets.createMultiple(1000, 'rocket');
    //rockets.callAll('events.onOutOfBounds.add','events.onOutOfBounds', makeBoom);
    rockets.callAll('anchor.setTo','anchor', 0.5,1.0);
    rockets.setAll('checkWorldBounds', true);

    //load start button sprite sheet
    startBtn = game.add.button(game.world.width*0.5, game.world.height*0.5, 'startBtn', startGame, this, 1, 0, 2);
    startBtn.anchor.set(0.5);

    //explosions
     explosions = game.add.group();
     explosions.createMultiple(1000, 'boom');
     explosions.physicsBodyType = Phaser.Physics.ARCADE;
}

function update() {

    // add math.pi/2 so the front follows the mouse pointer
    //otherwise it's a bit sideways
    sniper.rotation = game.physics.arcade.angleToPointer(sniper) + Math.PI/2;

    //disabled the right-click popUp menu in the html file
    //body oncontextmenu="return false"
    if(game.input.activePointer.rightButton.isDown){
        moveToPosition();

    }else if(game.input.activePointer.leftButton.isDown && playing === true){
        fire();
       // game.physics.arcade.overlap(rockets, makeBoom, null, this);
    }
}

function fire(rocket) {

    if (game.time.now > nextFire && rockets.countDead() > 0){
        nextFire = game.time.now + fireRate;
        rocket = rockets.getFirstDead();
        //var rocket = rockets.getFirstExists(false);
        rocket.reset(sniper.x, sniper.y);

        //declare tweens on scope in order to avoid bugs,
        //and rockets moving with the player
        var tween;
        var pos = game.input.activePointer.position;
        tween = this.game.add.tween(rocket).to({
            x: pos.x,
            y: pos.y
        }, 100, Phaser.Easing.Linear.None, true);
        //console.log(tween);
        makeBoom(rocket);
    }
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

function makeBoom(input){

    //var clickCoord = game.input.activePointer.position;
    //console.log('boom');
    //console.log(clickCoord);
   // input.kill();


    //var explosion = explosions.getFirstExists(false);
    //explosion.reset(game.input.activePointer.position);
    //explosion.play('boom', 30, false, true);
    if(explpode === true) {
        input.kill();
        //explpode = true;
        console.log('should be deleted')
    }
    console.log('BOOM');

}

function startGame() {
    startBtn.destroy();
    playing = true;
}
