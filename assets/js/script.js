//Welcome message
window.addEventListener('load', (event) => {
    alert("Complete all three levels before the timer runs out. Move with the arrows, you are the dark-grey circle and your goal is the blue portal circle. Click OK to start the game! Have fun!");
});


//Levels and maps (1 is wall and 0 is floor)
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
    //DOM connection
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


//movement with buttons (mobile)
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

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function isMobileAndTablet() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

//Checks if player is on goal position and changes level with left key press and place new level
Game.prototype.addMazeListener = function() {
    let obj = this;
    const isMobileAndTabletScreen = isMobileAndTablet();

    if(isMobileAndTabletScreen) {
        // Mobile, Tab
        window.addEventListener('mousedown', function(e) {
            const isLeftArrowPressed = e.target.id == 'left';
            if (isLeftArrowPressed && obj.checkGoal()) {
            // left arrow
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

    } else {
        // Desktop
        window.addEventListener('keydown', function(e) {
            console.log(e.key)
            const isLeftArrowPressed = e.key == 'ArrowLeft';
            if (isLeftArrowPressed && obj.checkGoal()) {
            // left arrow
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
    }
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


//timer and fail message
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


//listeners gathered
Game.prototype.addListeners = function() {
    this.keyboardListener();
    this.buttonListeners();
    this.addMazeListener();
}


//start game with game-container, placeLevel and listeners
function init() {
    let myGame = new Game('game-container-1', levels[0]);
    myGame.placeLevel();
    myGame.addListeners();
}
init();
