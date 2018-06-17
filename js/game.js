// Tiles possible values
let EMPTY = "tile",
    WALL = "wall",
    LIFE = "life",
    SHOW = "show",
    EXIT = "exit";

// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// Phaser Game configs
let config = {
    type: Phaser.AUTO, 
    parent:'gamebox',
    default_width: 1440,
    default_height: 730,
    scene: gameScene,
    backgroundColor: '#FFF'
};

function getNextStageFromServer(game){
    return $.ajax("http://api.memoria.cf/game/nextStage", {
     method: 'GET',
     crossDomain: true,
     xhrFields: { withCredentials: true },
     success : function(responseText){ 
        game.stageNumber = responseText.stageLevel;
        game.stage = responseText.map;
        alert(responseText.map);
     },

     error : function(resultat, statut, erreur){
         alert(resultat + erreur)
     }
  })
}

function getResumeGameFromServer(game){
     return $.ajax("http://api.memoria.cf/game/resume", {
     method: 'GET',
     crossDomain: true,
     xhrFields: { withCredentials: true },
     success : function(responseText){ 
        game.score = responseText.score;
        game.numberOfBonusMap = responseText.yellowBonus;
        game.numberOfBonusLife = responseText.redBonus;
        getNextStageFromServer(game)
     },

     error : function(resultat, statut, erreur){
         alert(resultat + erreur)
     }
  })
}

function sendEndStage(dataLevel){
  return $.ajax("http://api.memoria.cf/game/endStage", {
     method: 'POST',
     data: dataLevel,
     contentType:"application/json; charset=utf-8",
     crossDomain: true,
     xhrFields: { withCredentials: true }
  })
}

function getIndexOfK(arr, k) {
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].indexOf(k);
    if (index > -1) {
      return [i, index];
    }
  }
}

// handle window size/resize
function initialize(game) {
    function resize() {
        var w = window.innerWidth;
        var h = window.innerHeight - 70; // minus header
        var scale = Math.min(w / config.default_width, h / config.default_height);
        
        game.canvas.setAttribute('style',
            ' -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1);' +
            ' -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');' +
            ' transform-origin: top left;'
        );
        
        width = w / scale;
        height = h / scale;
        game.resize(width, height);
        game.scene.scenes.forEach(function (scene) {
            scene.cameras.main.setViewport(0, 0, width, height);
        });
    }
    
    window.addEventListener('resize', resize);
    if(game.isBooted) resize();
    else game.events.once('boot', resize);
}

var game = new Phaser.Game(config);
getResumeGameFromServer(game).then(() => initialize(game))


// calculate the tiles' position on the X-axis
gameScene.positionX = function(col)
{
    var offset = (config.default_width - this.options.numberOfCols*(this.options.tileSize + this.options.tileSpacing))/2;
    return col * (this.options.tileSize + this.options.tileSpacing) + this.options.tileSize / 2 + this.options.tileSpacing + offset;
}

// calculate the tiles' position on the Y-axis
gameScene.positionY = function(row)
{
    var offset = (config.default_height - this.options.numberOfRows*(this.options.tileSize + this.options.tileSpacing))/2;
    return row * (this.options.tileSize + this.options.tileSpacing) + this.options.tileSize / 2 + this.options.tileSpacing + offset;
}

gameScene.preload = function ()
{
    // Load all the assets
    this.load.image('exit', 'assets/out.png');
    this.load.image('tile', 'assets/tile.png');
    this.load.image('tile_activated', 'assets/tile_activated.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('life', 'assets/life_bonus.png');
    this.load.image('show', 'assets/map_bonus.png');
    //this.load.image('background', 'assets/background.png');
    this.load.image('life_bonus_full', 'assets/bonus_life_full.png');
    this.load.image('life_bonus_empty', 'assets/bonus_life_empty.png');
    this.load.image('map_bonus_full', 'assets/bonus_map_full.png');
    this.load.image('map_bonus_empty', 'assets/bonus_map_empty.png');
    
}

gameScene.create = function()
{
    // TODO: Get this values from the Database !
    //this.score = 0;

    //this.stageNumber = 0;

    /*let stage = [[SHOW,LIFE,EMPTY,WALL,EMPTY,EXIT,EMPTY,EMPTY],
                 [EMPTY,SHOW,EMPTY,WALL,LIFE,WALL,EMPTY,EMPTY],
                 [EMPTY,WALL,EMPTY,WALL,WALL,EMPTY,EMPTY,EMPTY],
                 [SHOW,WALL,SHOW,WALL,EMPTY,EMPTY,EMPTY,WALL],
                 [SHOW,WALL,EMPTY,WALL,EMPTY,EMPTY,WALL,EMPTY],
                 [SHOW,WALL,EMPTY,EMPTY,EMPTY,WALL,EMPTY,EMPTY],
                 [SHOW,WALL,SHOW,WALL,EMPTY,EMPTY,EMPTY,SHOW],
                 [SHOW,WALL,EMPTY,EMPTY,EMPTY,EMPTY,WALL,WALL]
                 ];*/

    //this.bestScore = 0;

    // Number of bonus needed to actualy have one
    
    this.numBonus = 5;

    // Number of seconds we show the map in seconds, showtime ;) 
    this.showTime = 3;
    
    this.numberOfYellowBonusUsed = 0;
    this.numberOfRedBonusUsed = 0;

    // variables for 1 stage
    this.totalTime = 0;
    this.field = [];
    this.cardsGroup = this.add.group();
    this.showingMap = false;
    this.stageComplete = false;
    this.hasLife = false;

    // Display options
    this.options = {
        tileSpacing : -2.5,
        numberOfRows : this.stage.length,
        numberOfCols : this.stage[0].length,
        tileSize : Math.min(config.default_width/2.5/this.stage[0].length, config.default_height/1.2/this.stage.length)
    }
    
    console.log(this.options.numberOfRows);
    console.log(this.options.numberOfCols);

    // Construct the array of tiled sprites
    for (var i = 0; i < this.options.numberOfRows; i++) {
        this.field[i] = [];
        for (var j = 0; j < this.options.numberOfCols; j++) {

            //Value of the card
            var tile_value = this.add.sprite(gameScene.positionX(j), gameScene.positionY(i), this.stage[i][j]);
            tile_value.setSize(this.options.tileSize,this.options.tileSize,true);
            tile_value.setDisplaySize(this.options.tileSize, this.options.tileSize);
            tile_value.visible = 1;
            
            // Face of the card
            var tile = this.add.sprite(gameScene.positionX(j), gameScene.positionY(i), "tile");
            tile.setSize(this.options.tileSize,this.options.tileSize,true);
            tile.setDisplaySize(this.options.tileSize, this.options.tileSize);
            tile.visible = 0;

            // Face of the card when activated
            var tile_activated = this.add.sprite(gameScene.positionX(j), gameScene.positionY(i), "tile_activated");
            tile_activated.setSize(this.options.tileSize,this.options.tileSize,true);
            tile_activated.setDisplaySize(this.options.tileSize, this.options.tileSize);
            tile_activated.visible = 0;

            this.cardsGroup.add(tile_value);
            this.cardsGroup.add(tile);
            this.cardsGroup.add(tile_activated);
            
            this.field[i][j] = {
                tile_value: tile_value,
                tile: tile,
                tile_activated: tile_activated,
                value: this.stage[i][j],
                isActivate: false
            }
        }
    }
    
    alert(this.field);
    
    // Create the labels
    this.stageText = this.add.text(15, 15, 'Stage ' + this.stageNumber, { fontSize: '64px', fill: '#000' }).setFontFamily('Montserrat');
    this.scoreText = this.add.text(15, 90, 'Score: ' + this.score, { fontSize: '32px', fill: '#000' }).setFontFamily('Montserrat');
    this.timeText = this.add.text(15, config.default_height - 50, 'Time: ' + this.totalTime + 's', { fontSize: '32px', fill: '#000' }).setFontFamily('Montserrat');
    this.lifeText = this.add.text(config.default_width - 250, 15, 'Life Bonus :', { fontSize: '32px', fill: '#000' }).setFontFamily('Montserrat');
    this.showText = this.add.text(config.default_width - 250, 150, 'Map Bonus :', { fontSize: '32px', fill: '#000' }).setFontFamily('Montserrat');
    this.showTextSpace = this.add.text(config.default_width - 250, 240, "Press SPACE to see the map", { fontSize: '12px', fill: '#000' });
    this.countdownText = this.add.text(config.default_width/2 - 40, config.default_height/2 - 40, '', { fontSize: '100px', fill: '#FFF' });
    this.winText = this.add.text(config.default_width/2 - 185, config.default_height/2 - 40, "You Win!", { fontSize: '80px', fill: '#FFF' });
    this.restartText = this.add.text(config.default_width/2 - 145, config.default_height/2 + 64, "Press SPACE for next Stage", { fontSize: '20px', fill: '#AAA' });

    // Hide not needed labels
    this.winText.visible = 0;
    this.restartText.visible = 0;
    this.countdownText.visible = 0;
    this.showTextSpace.visible = 0;

    // Timer label 
    this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: function(){this.timeText.setText('Time: ' + ++this.totalTime + ' s')},
        callbackScope: this,
        loop: true
    });

    // Create the bonus count sprites
    this.lifes_bonus = [];
    //this.numberOfBonusLife = 0;
    this.maps_bonus = [];
    //this.numberOfBonusMap = 0;
    for(var i = 0; i < 5; i++){
        this.lifes_bonus[i] = {
            full: this.add.sprite(i*40 + config.default_width - 230, 70, 'life_bonus_full'),
            empty: this.add.sprite(i*40 + config.default_width - 230, 70, 'life_bonus_empty')
        }
        this.lifes_bonus[i].full.visible = 0;

        this.maps_bonus[i] = {
            full: this.add.sprite(i*40 + config.default_width - 230, 210, 'map_bonus_full'),
            empty: this.add.sprite(i*40 + config.default_width - 230, 210, 'map_bonus_empty')
        }
        this.maps_bonus[i].full.visible = 0;
    }

    // Add the player
    let coords_player = getIndexOfK(this.field, 4)
    this.player = {
        sprite: this.add.sprite(gameScene.positionX(0), gameScene.positionY(2), 'player'),
        x: coords_player[0],
        y: coords_player[1]
    };
    this.player.sprite.setSize(this.options.tileSize, this.options.tileSize, true);
    this.player.sprite.setDisplaySize(this.options.tileSize, this.options.tileSize);
    this.player.visible = 1;

    this.canMove = false;

    // Set the keyboard listeners
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Launch the game 
    this.showMap(this.showTime);
}



gameScene.update = function ()
{
    // Handle the keyboard inputs
    if (this.canMove && !this.showingMap && !this.stageComplete) {
        if (this.cursors.left.isDown)
        {
            if (this.player.x >0){
                this.player.x = this.player.x - 1;
                this.player.sprite.x = gameScene.positionX(this.player.x);
            }
        }
        else if (this.cursors.right.isDown)
        {
            if (this.player.x < (this.options.numberOfCols-1)){
                this.player.x = this.player.x + 1;
                this.player.sprite.x = gameScene.positionX(this.player.x);
            }
        }
        else if(this.cursors.up.isDown)
        {
            if (this.player.y > 0){
                this.player.y = this.player.y - 1;
                this.player.sprite.y = gameScene.positionY(this.player.y);
            }
        }
        else if(this.cursors.down.isDown)
        {
            if (this.player.y < (this.options.numberOfRows - 1)){
                this.player.y = this.player.y + 1;
                this.player.sprite.y = gameScene.positionY(this.player.y);
            }
        }
        else
        {
            
        }
    }

    // Limit the player to one move when a key is Down
    if(this.cursors.left.isUp && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp)
        this.canMove = true;
    else
        this.canMove = false;

    // Handle the tiled value actions
    if(!this.field[this.player.y][this.player.x].isActivate){
        switch(this.field[this.player.y][this.player.x].value){
            case EMPTY:
                break;
            case LIFE:
                if(this.numberOfBonusLife < this.numBonus)
                    this.lifes_bonus[this.numberOfBonusLife++].full.visible = 1;
                break;
            case SHOW:
                if(this.numberOfBonusMap < this.numBonus)
                    this.maps_bonus[this.numberOfBonusMap++].full.visible = 1;
                break;
            case WALL:
                if(this.numberOfBonusLife == this.numBonus)
                {
                    // shake the camera
                    this.cameras.main.shake(500);
                    for(var i = 0; i < this.numBonus; i++)
                        this.lifes_bonus[i].full.visible = 0;
                    this.numberOfBonusLife = 0;
                    this.numberOfRedBonusUsed++;
                }
                else this.loose();
                break;
            case EXIT:
                this.win();
                break;
        }
    }

    // Activate the current tile
    this.field[this.player.y][this.player.x].tile_activated.visible = 1;
    this.field[this.player.y][this.player.x].isActivate = true;

    // Win page case
    if(this.stageComplete && this.spaceKey.isDown)
        this.scene.restart();

    // Bonus Map ready to use
    if(this.numberOfBonusMap == this.numBonus){
        this.showTextSpace.visible = 1;
        if(this.spaceKey.isDown){
            for(var i = 0; i < this.numBonus; i++)
                this.maps_bonus[i].full.visible = 0;
            this.numberOfBonusMap = 0;
            this.showMap(this.showTime);
            this.numberOfYellowBonusUsed++;
        }
    }

}

gameScene.win = function(){
    // TODO : Update the database
    this.stageComplete = true;
    this.winText.visible = 1;
    this.restartText.visible = 1;
    this.timerEvent.destroy();
    // Prepare the data for sending to the server
    dataEnd = {"StageClear": this.stageComplete, "temps": this.totalTime, "score": this.score, "yellowBonusTot": this.numberOfBonusMap, "redBonusTot": this.numberOfBonusLife, "yellowBonusUsed": 0, "redBonusUsed": 0}
    dataEnd = JSON.stringify(dataEnd)
    sendEndStage(dataEnd).then(() => getNextStageFromServer(this))
    
}

gameScene.loose = function(){
    this.stageComplete = false;
    // shake the camera
    this.cameras.main.shake(500);

    // fade camera
    this.time.delayedCall(250, function() {
        this.cameras.main.fade(250);
    }, [], this);

    // Prepare the data for sending to the server
    dataEnd = {"StageClear": this.stageComplete, "temps": this.totalTime, "score": this.score, "yellowBonusTot": this.numberOfBonusMap, "redBonusTot": this.numberOfBonusLife, "yellowBonusUsed": 0, "redBonusUsed": 0}
    dataEnd = JSON.stringify(dataEnd)
    sendEndStage(dataEnd).then(() => getNextStageFromServer(this).then(() => this.time.delayedCall(500, function() {
        this.scene.restart();
    }, [], this)));
    // restart game
    
}

gameScene.showMap = function(seconds){
    this.showingMap = true;
    this.timerEvent.paused = true;

    for (var i = this.field.length - 1; i >= 0; i--) {
        for (var j = this.field[i].length - 1; j >= 0; j--) {
            this.field[i][j].tile.visible = 0;
        }
    }
    
    var countdown = seconds;
    this.countdownText.setText(countdown); 
    this.countdownText.visible = 1; 

    this.time.addEvent({
        delay: 1000,
        callback: function(){this.countdownText.setText(--countdown)},
        callbackScope: this,
        repeat: seconds - 1
    });

    this.time.delayedCall(seconds*1000, function() {
        for (var i = this.field.length - 1; i >= 0; i--) {
            for (var j = this.field[i].length - 1; j >= 0; j--) {
                this.field[i][j].tile.visible = 1;
            }
        }
        this.countdownText.visible = 0;
        this.showingMap = false;
        this.timerEvent.paused = false;
    }, [], this);
    this.showTextSpace.visible = 0;
}

