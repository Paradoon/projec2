window.addEventListener('load', (event) => {
    alert("Complete all three levels before the timer runs out. Move with the arrows. Click OK to start the game! Have fun!");
});

let levels = [];

levels[0] = {

    map: [
        [1,1,0,0,1,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,0],
        [0,0,0,1,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,1,1,1,1,1],
        [0,1,0,1,0,0,0,0,0,0,0],
        [0,1,0,1,1,1,1,1,1,1,0],
        [0,1,0,1,0,0,0,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,0],
        [0,1,1,1,0,0,0,1,0,0,0],
        [0,1,0,0,0,1,0,0,0,1,0]
    ],
    player: {
        x:0,
        y:10
    },
    goal: {
        x:2,
        y:10
    },
    theme: 'default',
};

levels[1] = {

    map: [
        [1,1,0,0,1,0,0,0,0,0,0],
        [1,0,0,0,0,0,1,0,0,1,0],
        [0,0,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,1,0,0,0,0],
        [0,1,0,1,0,1,1,0,1,1,1],
        [0,1,0,1,0,0,0,0,0,0,0],
        [0,1,0,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,0,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,0],
        [1,0,0,1,0,0,0,1,0,0,0],
        [0,0,0,1,0,1,0,0,0,1,0]
    ],
    theme: 'sandland',
    player: {
        x:10,
        y:0
    },
    goal: {
        x:0,
        y:10
    },
};

levels[2] = {

    map: [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1,0,0,0],
        [0,0,1,0,1,0,1,0,1,0,0],
        [0,1,0,0,0,1,0,0,0,1,0],
        [0,0,1,0,0,0,0,0,1,0,0],
        [0,0,0,1,0,0,0,1,0,0,0],
        [0,1,0,0,1,0,1,0,0,1,0],
        [0,0,1,0,0,1,0,0,1,0,0],
        [0,0,0,1,0,0,0,1,0,0,0],
        [1,0,0,0,1,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0]
    ],
    player: {
        x:10,
        y:0
    },
    goal: {
        x:0,
        y:10
    },
    theme: 'loveland'
};

function Game(id, level) {
    this.el = document.getElementById(id);
    this.level_idx = 0;
    this.tileTypes = ['floor', 'wall'];
    this.tileDim = 32;
    this.map = level.map;
    this.theme = level.theme;
    this.player = {...level.player};
    this.goal = {...level.goal};
}

Game.prototype.createEl = function(x, y, type) {
    let el = document.createElement('div');
    el.className = type;
    el.style.width = el.style.height = this.tileDim + 'px';
    el.style.left = x * this.tileDim + 'px';
    el.style.top = y * this.tileDim + 'px';
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
        this.checkGoal();
    });
}

Game.prototype.movePlayer = function(event) {
    event.preventDefault();
    if (event.keyCode < 37 || event.keyCode > 40) {
        return;
    }

    switch (event.keyCode) {
        case 37:
        this.moveLeft();
            //move player left
            break;
        case 38: 
        this.moveUp();
            //move player up
            break;
        case 39:
        this.moveRight();
            //move player right
            break;
        case 40:
        this.moveDown();
            //move player down
        break;
    }
}

Game.prototype.moveUp = function() {
    if (this.player.y == 0) {
        return;
    }

    let nextTile = this.map[this.player.y-1][this.player.x];
    if (nextTile == 1) {
        return;
    }

    this.player.y -=1;
    this.updateVert();
}

Game.prototype.moveDown = function() {
    if (this.player.y == this.map.length - 1) {
        return;
    }

    let nextTile = this.map[this.player.y+1][this.player.x];
    if (nextTile == 1) {
        return;
    }

    this.player.y +=1;
    this.updateVert();
}

Game.prototype.moveLeft = function() {
    if (this.player.x == 0) {
        return;
    }

    let nextTile = this.map[this.player.y][this.player.x - 1];
    if (nextTile == 1) {
        return;
    }

    this.player.x -=1;
    this.updateHoriz();
}

Game.prototype.moveRight = function() {
    if (this.player.x == this.map[this.player.y].length - 1) {
        return;
    }

    let nextTile = this.map[this.player.y][this.player.x + 1];
    if (nextTile == 1) {
        return;
    }

    this.player.x +=1;
    this.updateHoriz();
}

Game.prototype.updateHoriz = function(sprite) {
    this.player.el.style.left = this.player.x * this.tileDim + 'px';
};

Game.prototype.updateVert = function() {
    this.player.el.style.top = this.player.y * this.tileDim + 'px';
};

Game.prototype.checkGoal = function(instrux_msg, goal_msg) {
    let body = document.querySelector('body');
    if (this.player.y == this.goal.y && 
        this.player.x == this.goal.x) {
            body.className = 'success';
        } else {
            body.className = '';
        }
}

Game.prototype.buttonListeners = function(instrux_msg, goal_msg) {
    let up = document.getElementById('up');
    let left = document.getElementById('left');
    let down = document.getElementById('down');
    let right = document.getElementById('right');

    let obj = this;

    up.addEventListener('mousedown', function() {
        obj.moveUp();
        obj.checkGoal(instrux_msg, goal_msg);
    });

    down.addEventListener('mousedown', function() {
        obj.moveDown();
        obj.checkGoal(instrux_msg, goal_msg);
    });

    left.addEventListener('mousedown', function() {
        obj.moveLeft();
        obj.checkGoal(instrux_msg, goal_msg);
    });

    right.addEventListener('mousedown', function() {
        obj.moveRight();
        obj.checkGoal(instrux_msg, goal_msg);
    });
}

Game.prototype.placeLevel = function() {
    this.populateMap();
    this.sizeUp();
    this.placeSprite('goal');
    let playerSprite = this.placeSprite('player');
    this.player.el = playerSprite;
}

Game.prototype.addMazeListener = function() {
    let map = this.el.querySelector('.game-map');
    let obj = this;
    map.addEventListener('mousedown', function(e) {
        if (obj.player.y != obj.goal.y ||
            obj.player.x != obj.goal.x) {
                return;
            }
            obj.changeLevel();
            let layers = obj.el.querySelectorAll('.layer');
            for (layer of layers) {
                layer.innerHTML = '';
            }
            obj.placeLevel();
            obj.checkGoal();
    });
};

Game.prototype.changeLevel = function() {
    this.level_idx++;
    if (this.level_idx > levels.length -1) {
        this.level_idx = 0;
    }
    let level = levels[this.level_idx];
    this.map = level.map;
    this.theme = level.theme;
    this.player = {...level.player};
    this.goal = {...level.goal};
}

//timer
var timeleft = 20;
var downloadTimer = setInterval(function() {
    if (timeleft <= 0) {
        clearInterval(downloadTimer);
        alert("Game over!");
        location.reload();
    }
    document.getElementById("progressBar").value = 20 - timeleft;
    timeleft -= 1;
}, 1000);

//add interval for blinking bg color when time closes finish
//add complete message
//add change level on left key down
//change player design
// change goal design

Game.prototype.addListeners = function() {
    this.keyboardListener();
    this.buttonListeners();
    this.addMazeListener();
}

function init() {
    let myGame = new Game('game-container-1', levels[0]);
    myGame.placeLevel();
    myGame.addListeners();
}
init();
