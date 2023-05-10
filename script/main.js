const game = document.getElementById('game');
const mess = document.getElementById('message');

const windowSize = 700;

const players = {
    fire: undefined,
    water: undefined
};

let obstacle;

let last = 1;

let file = {
    obstacles: [
        {
            start: [0, 0],
            end: [700, 1]
        },
        {
            start: [0, 699],
            end: [700, 700]
        },
        {
            start: [0, 0],
            end: [1, 700]
        },
        {
            start: [699, 0],
            end: [700, 700]
        },
        {
            start: [350, 170],
            end: [700, 175]
        },
        {
            start: [0, 350],
            end: [300, 355]
        },
        {
            start: [400, 350],
            end: [700, 355]
        },
        {
            start: [0, 525],
            end: [350, 530]
        }
    ],
    water: [
    ],
    fire: [
        {
            start: [250, 345],
            end: [300, 350]
        },
    ],
    buttons: [
        {
            start: [40, 345],
            end: [80, 350]
        },
        {
            start: [140, 520],
            end: [180, 525]
        }
    ],
    gates: [
        {
            start: [200, 355],
            end: [220, 525]
        }
    ],
    win: [
        {
            start: [40, 520],
            end: [120, 525]
        }
    ]
}

let file2 = {
    obstacles: [
        {
            start: [0, 0],
            end: [700, 1]
        },
        {
            start: [0, 699],
            end: [700, 700]
        },
        {
            start: [0, 0],
            end: [1, 700]
        },
        {
            start: [699, 0],
            end: [700, 700]
        },
        {
            start: [0, 150],
            end: [300, 170]
        },
        {
            start: [400, 150],
            end: [700, 170]
        },
        {
            start: [200, 250],
            end: [500, 260]
        },
        {
            start: [400, 350],
            end: [700, 355]
        },
        {
            start: [0, 350],
            end: [300, 355]
        },
        {
            start: [0, 355],
            end: [300, 700]
        },
        {
            start: [400, 355],
            end: [450, 455]
        },
        {
            start: [400, 565],
            end: [450, 700]
        },
        {
            start: [0, 355],
            end: [300, 700]
        }
    ],
    water: [
        {
            start: [220, 245],
            end: [260, 250]
        }
    ],
    fire: [
        {
            start: [440, 245],
            end: [480, 250]
        }
    ],
    buttons: [
    ],
    gates: [
    ],
    win: [
        {
            start: [525, 695],
            end: [625, 700]
        }
    ]
}

function screenUpdate(input) {
    mess.innerHTML = '';
    if (input == 0)
        input = last;
    clearInterval(interval);
    if (input == 1) {
        clearMap();
        game.innerHTML = '';
        createMap(file);
        players.fire = createPlayer(20, 610, [37, 38, 39, 40], 0);
        players.water = createPlayer(640, 50, [65, 87, 68, 83], 1);
        game.append(players.fire.object, players.water.object);
        document.onkeydown = document.onkeyup = function(e) {
            e = e || event;
    
            player1Enter = players.fire.inputs.indexOf(e.keyCode);
            player2Enter = players.water.inputs.indexOf(e.keyCode);
    
    
            if (player1Enter != -1)
                players.fire.activeInputs[player1Enter] = e.type == 'keydown';
    
            if (player2Enter != -1)
                players.water.activeInputs[player2Enter] = e.type == 'keydown';
        }
        
    } else if (input == 2) {
        clearMap();
        game.innerHTML = '';
        createMap(file2);
        players.fire = createPlayer(20, 50, [37, 38, 39, 40], 0);
        players.water = createPlayer(640, 50, [65, 87, 68, 83], 1);
        game.append(players.fire.object, players.water.object);
        document.onkeydown = document.onkeyup = function(e) {
            e = e || event;
    
            player1Enter = players.fire.inputs.indexOf(e.keyCode);
            player2Enter = players.water.inputs.indexOf(e.keyCode);
    
    
            if (player1Enter != -1)
                players.fire.activeInputs[player1Enter] = e.type == 'keydown';
    
            if (player2Enter != -1)
                players.water.activeInputs[player2Enter] = e.type == 'keydown';
        }
    }
    last = input;
    interval = setInterval(() => {
        if (onFire(players.water) || onWater(players.fire)) {
            clearInterval(interval);
            mess.innerHTML = "You've lost";
            return;
        }
        if (won(players.fire) && won(players.water)) {
            clearInterval(interval);
            mess.innerHTML = "You've won";
            return;
        }
        (players.fire.activeInputs[0] && checkPostion(players.fire.posX - 1, players.fire.posY)) && players.fire.posX--;
        (players.fire.activeInputs[2] && checkPostion(players.fire.posX + 1, players.fire.posY)) && players.fire.posX++;
        (players.water.activeInputs[0] && checkPostion(players.water.posX - 1, players.water.posY)) && players.water.posX--;
        (players.water.activeInputs[2] && checkPostion(players.water.posX + 1, players.water.posY)) && players.water.posX++;
        
        (players.fire.activeInputs[1] && onGround(players.fire)) && jump(players.fire);
        (players.water.activeInputs[1] && onGround(players.water)) && jump(players.water);

        (!onGround(players.fire) && !players.fire.jumped) && fall(players.fire);
        (!onGround(players.water) && !players.water.jumped) && fall(players.water);

        let x = players.fire.posX;

        x = (x < 0) * 0 + (x > windowSize - 40) * (windowSize - 40) + (x >= 0 && x <= windowSize - 40) * x;

        players.fire.object.style.left = `${x}px`;

        x = players.water.posX;
        
        x = (x < 0) * 0 + (x > windowSize - 40 ) * (windowSize - 40) + (x >= 0 && x <= windowSize - 40) * x;

        players.water.object.style.left = `${x}px`;
    }, 5)
}

let map = {};

function won(player) {
    let x = player.posX,
        y= player.posY;
    for (let i = 0; i < 39; i++) {
        if (map[[i + x, y]] == 6 || map[[i + x, y + 39]] == 6 || map[[x, y + i]] == 6 || map[[x + 39, y + i]] == 6)
            return true;
    }

    return false;
}

function clearMap() {
    for (let x = 0; x <= windowSize; x++)
        for (let y = 0; y <= windowSize; y++)
            map[[x, y]] = 0;
}

function createMap(file) {
    clearMap();
    file.obstacles.forEach( (elem) => {
        createObstacle(elem, 'obstacle');
        for (let x = elem.start[0]; x <= elem.end[0]; x++) {
            for (let y = elem.start[1]; y <= elem.end[1];y ++) {
                if (map[[x, y]] == 0)
                map[[x, y]] = 1;
            }
        }
    });
    file.fire.forEach( (elem) => {
        createObstacle(elem, 'fire');
        for (let x = elem.start[0]; x <= elem.end[0]; x++) {
            for (let y = elem.start[1]; y <= elem.end[1];y ++) {
                if (map[[x, y]] == 0)
                map[[x, y]] = 2;
            }
        }
    });
    file.water.forEach( (elem) => {
        createObstacle(elem, 'water');
        for (let x = elem.start[0]; x <= elem.end[0]; x++) {
            for (let y = elem.start[1]; y <= elem.end[1];y ++) {
                if (map[[x, y]] == 0)
                    map[[x, y]] = 3;
            }
        }
    });
    file.buttons.forEach( (elem) => {
        createObstacle(elem, 'buttons');
        for (let x = elem.start[0]; x <= elem.end[0]; x++) {
            for (let y = elem.start[1]; y <= elem.end[1];y ++) {
                if (map[[x, y]] == 0)
                map[[x, y]] = 4;
            }
        }
    });
    file.gates.forEach( (elem) => {
        createObstacle(elem, 'gates');
        for (let x = elem.start[0]; x <= elem.end[0]; x++) {
            for (let y = elem.start[1]; y <= elem.end[1];y ++) {
                if (map[[x, y]] == 0)
                map[[x, y]] = 5;
            }
        }
    });
    file.win.forEach( (elem) => {
        createObstacle(elem, 'win');
        for (let x = elem.start[0]; x <= elem.end[0]; x++) {
            for (let y = elem.start[1]; y <= elem.end[1];y ++) {
                if (map[[x, y]] == 0)
                map[[x, y]] = 6;
            }
        }
    });
}

function createObstacle(obs, type) {
    const obst = document.createElement('div');
    obst.classList.add(type);
    obst.style.width = `${obs.end[0] - obs.start[0]}px`;
    obst.style.height = `${obs.end[1] - obs.start[1]}px`;
    obst.style.left = `${obs.start[0]}px`;
    obst.style.top = `${obs.start[1]}px`;
    if (type == 'gates')
        obstacle = obst;
    game.append(obst);
}

function jump(player) {
    if (player.jumped || player.falling)
        return;

    let i = 0;
    player.jumped = true;
    let Interval = setInterval(() => {
        if (++i >= 180 || headHit(player)) {
            player.jumped = false;
            player.falling = true;
            clearInterval(Interval);
            return;
        }

        player.object.style.top = `${--player.posY}px`;
    }, 1);
}

function fall(player) {
    player.falling = true;
    let interval_ = setInterval(() => {
        if (onGround(player) || player.posY == 0) 
        {
            player.falling = false;
            clearInterval(interval_);
            return;
        }
        player.object.style.top = `${++player.posY}px`
    }, 100);
}

function onGround(player) {
    for (let i = 0; i < 40; i++) {
        if (map[[player.posX + i, player.posY + 40]] == 1) {
            player.falling = false;
            return true;
        }
    }

    return false;
}

function headHit(player) {
    if (player.posY == 0)
        return true;
    for (let i = 0; i < 40; i++) {
        if (map[[player.posX + i, player.posY]] == 1)
            return true;
    }

    return false;
}

function onFire(player) {
    let x = player.posX,
        y= player.posY;
    for (let i = 0; i < 39; i++) {
        if (map[[i + x, y]] == 2 || map[[i + x, y + 39]] == 2 || map[[x, y + i]] == 2 || map[[x + 39, y + i]] == 2)
            return true;
    }

    return false;
}

function onButton(player) {
    let x = player.posX,
        y = player.posY;
for (let i = 0; i < 39; i++) {
    if (map[[i + x, y]] == 4 || map[[i + x, y + 39]] == 4 || map[[x, y + i]] == 4 || map[[x + 39, y + i]] == 4) {
        obstacle.style.display = 'none';
        return true;
    }
    obstacle.style.display = 'block';
}

return false;
}

function onWater(player) {
    let x = player.posX,
        y= player.posY;
    for (let i = 0; i < 39; i++) {
        if (map[[i + x, y]] == 3 || map[[i + x, y + 39]] == 3 || map[[x, y + i]] == 3 || map[[x + 39, y + i]] == 3)
            return true;
    }

    return false;
}

function createPlayer(coordX, coordY, inputs_, t) {
    const object       = document.createElement('div');
    object.classList.add('player');
    object.style.left = `${coordX}px`;
    object.style.top = `${coordY}px`;

    const inputs       = [...inputs_];
    const activeInputs = [false, false, false, false];
    const posX         = coordX;
    const posY         = coordY;
    const jumped       = false;
    const falling      = true;

    if (t == 0)
        object.classList.add('firep');
    else if (t== 1)
        object.classList.add('waterp');

    return {object, inputs, activeInputs, posX, posY, jumped, falling};
}

function checkPostion(x, y) {
    for (let i = 0; i < 39; i++) {
        if (map[[i + x, y]] == 1 || map[[i + x, y + 39]] == 1 || map[[x, y + i]] == 1 || map[[x + 39, y + i]] == 1)
            return false;
        
        if (!onButton(players.fire) && !onButton(players.water) )
            if (map[[i + x, y]] == 5 || map[[i + x, y + 39]] == 5 || map[[x, y + i]] == 5 || map[[x + 39, y + i]] == 5)
                return false;
    }

    return true;
}

let interval;

function setup () {
    game.style.width  = `${windowSize}px`;
    game.style.height = `${windowSize}px`;
    game.style.border = '1px solid #000'
    game.style.position = 'relative';
}

function move(player) {
    
}


setup();