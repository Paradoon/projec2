//Welcome message
window.addEventListener('load', (event) => {
    alert("Complete all three levels before the timer runs out. Move with the arrows, you are the dark-grey circle and your goal is the blue portal circle. Click OK to start the game! Have fun!");
});


//Levels and maps
let levels = [];

levels[0] = {

    map: [
        [0,1,0,0,1,0,0,0,0,0,0],
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
        [0,1,0,0,1,0,0,0,0,0,0],
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
        [1,0,0,1,0,0,0,1,0,0,1],
        [1,1,0,0,1,0,1,0,0,1,0],
        [0,0,0,0,0,0,0,0,1,0,0]
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


//Game-map construction
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


//tile creation
Game.prototype.createEl = function(x, y, type) {
    let el = document.createElement('div');
    el.className = type;
    el.style.width = el.style.height = this.tileDim + 'px';
    el.style.left = x * this.tileDim + 'px';
    el.style.top = y * this.tileDim + 'px';
    return el;
}


//map creation
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


//sizing up the game-map
Game.prototype.sizeUp = function() {
    let map = this.el.querySelector('.game-map');
    map.style.height = this.map.length * this.tileDim + 'px';
    map.style.width = this.map[0].length * this.tileDim + 'px';
};


//sprite for placement on the map
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


//listens for keyboard presses to move player and check for goal position
Game.prototype.keyboardListener = function() {
    document.addEventListener('keydown', event => {
        this.movePlayer(event);
        this.checkGoal();
    });
}


//key events
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


//player movements
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


//Checks if player is on goal position and executes if so
Game.prototype.checkGoal = function() {
    let body = document.querySelector('body');
    if (this.player.y == this.goal.y && 
        this.player.x == this.goal.x) {
            body.className = 'success';
            return true;
        } else {
            body.className = '';
            return false;
        }
}


//movement with buttons
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


//gathered map logics
Game.prototype.placeLevel = function() {
    this.populateMap();
    this.sizeUp();
    this.placeSprite('goal');
    let playerSprite = this.placeSprite('player');
    this.player.el = playerSprite;
}


//Checks if player is on goal position and changes level with left key press and place new level
Game.prototype.addMazeListener = function() {
    let obj = this;
    window.addEventListener('keydown', function(e) {
        console.log(e.key)
        if (e.key == 'ArrowLeft' || 'mousedown' && obj.checkGoal()) {
           // left arrow or mousedown for mobile-device
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
        }
    });
};


//adding next level
Game.prototype.changeLevel = function() {
    this.level_idx++;
    if (this.level_idx > levels.length -1) {
        this.showCompleteMsg();
        this.level_idx = 0;
        return;
    }
    let level = levels[this.level_idx];
    this.map = level.map;
    this.theme = level.theme;
    this.player = {...level.player};
    this.goal = {...level.goal};
}


//show complete message
Game.prototype.showCompleteMsg = function() {
    window.alert('Congratulations, you completed all three levels below 20 seconds!');
    location.reload();
}


//timer
var timeleft = 20;
var downloadTimer = setInterval(function() {
    if (timeleft <= 0) {
        clearInterval(downloadTimer);
        alert("Game over! Click OK to try again.");
        location.reload();
    }
    document.getElementById("progressBar").value = 20 - timeleft;
    timeleft -= 1;
}, 1000);


//functions gathered
Game.prototype.addListeners = function() {
    this.keyboardListener();
    this.buttonListeners();
    this.addMazeListener();
}


//press play
function init() {
    let myGame = new Game('game-container-1', levels[0]);
    myGame.placeLevel();
    myGame.addListeners();
}
init();
