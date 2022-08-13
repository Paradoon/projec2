let levels = [];
levels[0] = {

    map: [
        [1,1,0,0,1,0,0,0],
        [1,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,0,0],
        [0,0,0,1,0,0,0,0],
        [0,1,0,1,0,0,0,0],
        [0,1,0,1,0,0,0,0],
        [0,1,0,1,0,0,0,0]
    ],
    player: {
        x:0,
        y:6
    },
    goal: {
        x:7,
        y:0
    },
    theme: 'default'
};

function Game(id, level) {
    this.el = document.getElementById(id);
    this.tileTypes = ['floor', 'wall'];
    this.tileDim = 32;
    this.map = level.map;
    this.theme = level.theme;
    this.player = {...level.player};
    this.goal = {...level.goal};
    this.player.el = null;
}

Game.prototype.createEl = function(x, y, type) {
    let el = document.createElement('div');
    el.className = type;
    el.style.width = el.style.height = this.tileDim + 'px';
    el.style.left = x*this.tileDim + 'px';
    el.style.top = y*this.tileDim + 'px';
    return el;
}

Game.prototype.populateMap = function() {
    this.el.className = 'game-container' + this.theme;
    let tiles = document.getElementById('tiles');
    for (var y = 0; y < this.map.length; ++y) {
        for (var x = 0; x < this.map[y].length; ++x) {
            let tileCode = this.map[y][x];
            let tileType = this.tileTypes[tileCode];
            let tile = this.createEl(x, y, tileType);
            tiles.appendChild(tile);
        }
    }
}

Game.prototype.sizeUp = function() {
    let map = this.el.querySelector('.game-map');
    map.style.height = this.map.length * this.tileDim + 'px';
    map.style.width = this.map[0].length * this.tileDim + 'px';
};

Game.prototype.placeSprite = function(type) {
    let x = this[type].x
    let y = this[type].y
    let sprite = this.createEl(x, y, type);
    sprite.id = type;
    sprite.style.borderRadius = this.tileDim + 'px';
    let layer = this.el.querySelector('#sprites');
    layer.appendChild(sprite);
    return sprite;
}

Game.prototype.keyboardListener = function() {
    document.addEventListener('keydown', event => {
        this.movePlayer(event);
    });
}

Game.prototype.movePlayer = function(event) {
    event.preventDefault();
    if (event.keyCode < 37 || event.keyCode > 40) {
        return;
    }

    switch (event.keyCode) {
        case 37:
            //move player left
            break;
        case 38: 
            //move player up
            break;
        case 39:
            //move player right
            break;
        case 40:
            //move player down
        break;
    }
}

function init() {
    let myGame = new Game('game-container-1', levels[0]);
    myGame.populateMap();
    myGame.sizeUp();
    myGame.placeSprite('goal');
    myGame.placeSprite('player');
    let playerSprite = myGame.placeSprite('player');
    myGame.player.el = playerSprite;
    myGame.keyboardListener();
}
init();
