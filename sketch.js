// Canvas constamts
let CANVAS_WIDTH = 512;
let CANVAS_HEIGHT = 480;

// Court constants
let COURT_ORIGIN_X = 0;
let COURT_ORIGIN_Y = 0;
let COURT_WIDTH = 512;
let COURT_HEIGHT = 480;
let COURT_IMAGE_X = 177;
let COURT_IMAGE_Y = 0;
let COURT_IMAGE_WIDTH = 236;
let TOP_LIMIT = 50;
let BOTTOM_LIMIT = 450;

// Billy sprites constants
let BILLY_START_X = 400;
let BILLY_START_Y = 400;
let BILLY_WIDTH = 40;
let BILLY_HEIGHT = 40;
let BILLY_IMAGE_STANDING_X = 5;
let BILLY_IMAGE_STANDING_Y = 87;
let BILLY_IMAGE_WALKING_0_X = 5;
let BILLY_IMAGE_WALKING_1_X = 36;
let BILLY_IMAGE_WALKING_2_X = 103;
let BILLY_IMAGE_WALKING_Y = 118;
let BILLY_IMAGE_WIDTH = 20;
let BILLY_IMAGE_HEIGHT = 20;

// Billy state constants
let BILLY_STANDING = 0;
let BILLY_WALKING_1 = 1;
let BILLY_WALKING_2 = 2;
let BILLY_WALKING_3 = 3;
let BILLY_HITTING_1 = 4;
let BILLY_HITTING_2 = 5;
let BILLY_HITTING_3 = 6;
let BILLY_HITTING_4 = 7;
let BILLY_SPEED = 10;

let billyWalkingState = 0;
let billyState;
let billyX = BILLY_START_X;
let billyY = BILLY_START_Y;
let billyFlipped = false;
let isServing = true;

// Enemy state constants
let ENEMY_START_X = 260;
let ENEMY_START_Y = 100;
let ENEMY_IMAGE_STANDING_X = 1;
let ENEMY_IMAGE_STANDING_Y = 55;
let ENEMY_STANDING = 0;
let ENEMY_WALKING_1 = 1;
let ENEMY_WALKING_2 = 2;
let ENEMY_WALKING_3 = 3;
let ENEMY_HITTING_1 = 4;
let ENEMY_HITTING_2 = 5;
let ENEMY_HITTING_3 = 6;
let ENEMY_HITTING_4 = 7;
let ENEMY_SPEED = 5;

let enemyWalkingState = 0;
let enemyState;
let enemyX = ENEMY_START_X;
let enemyY = ENEMY_START_Y;
let enemyFlipped = false;
let isEnemyServing = false;

// Ball constants
let loadBall = false;
let ballX = billyX;
let ballY = billyY;
let BALL_INITIAL_WIDTH = 20;
let BALL_INITIAL_HEIGHT = 20;
let BALL_SCALE_FACTOR = 0.05;
let standardSpeed = 10;
let ballSpeedX = 0;
let ballSpeedY = 0;
let ballHeight = BALL_INITIAL_HEIGHT;
let ballWidth = BALL_INITIAL_WIDTH;
let shadowOffsetY = 20; 
let ballAngle = 0;
let songPlayed = true;

function preload() {
  gameAssets = loadImage('assets/TennisChump3.png');
  gameAssetsWithoutBackground = loadImage('assets/TennisChump3NoBackground.png');
  soundFormats('mp3', 'ogg');
  tennisBallSound = loadSound('assets/tennis_ball.ogg');
  impactSound = loadSound('assets/impact.ogg');
  windSound = loadSound('assets/wind_trimmed.ogg');
  backgroundMusic = loadSound('assets/Vibe Mountain - Operatic 3.mp3')
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  angleMode(DEGREES);
  backgroundMusic.loop();
  backgroundMusic.setVolume(0.5);
  gameAssets.loadPixels();
  billyState = BILLY_STANDING;
  enemyState = ENEMY_STANDING;
  frameRate(20);
}

function draw() {
  game();
}

function game() {
  // Load tennis court
  image(gameAssets, COURT_ORIGIN_X, COURT_ORIGIN_Y, COURT_WIDTH, COURT_HEIGHT,
    COURT_IMAGE_X, COURT_IMAGE_Y, COURT_IMAGE_WIDTH);

  // Load character in tennis court
  handleBillyMovement();
  handleBallMovement();
  handleEnemyMovement();
  drawEnemy();
  drawBilly();
  if (ballSpeedY !== 0) {
    drawBall();
  }
}

function keyPressed() {
  gameKeyPressed();
}

function gameKeyPressed() {
  if (keyCode === 32) {
    if (isServing) {
      ballX = billyX;
      ballY = billyY;
      ballSpeedY = -standardSpeed / 2;
    }
    if (billyState >= BILLY_HITTING_1) {
      return;
    } else if (!isServing) {
      windSound.play();
      billyState = BILLY_HITTING_1;
      handleBallCollision();
    }
  }
}

function animateBillyHitting() {
  if (ballX <= billyX) {
    scale(-1, 1);
  }
  if (billyState === BILLY_HITTING_1) {
    billyState = BILLY_HITTING_2;
    image(gameAssets, 0, 10, BILLY_WIDTH + 15, BILLY_HEIGHT + 15,
      BILLY_IMAGE_WALKING_0_X, BILLY_IMAGE_WALKING_Y + 95, BILLY_IMAGE_WIDTH + 10,
      BILLY_IMAGE_HEIGHT + 10);
  } else if (billyState === BILLY_HITTING_2) {
    billyState = BILLY_HITTING_3;
    image(gameAssets, -10, 10, BILLY_WIDTH + 15, BILLY_HEIGHT + 15,
      BILLY_IMAGE_WALKING_0_X + 26, BILLY_IMAGE_WALKING_Y + 95, BILLY_IMAGE_WIDTH + 10,
      BILLY_IMAGE_HEIGHT + 10);
  } else if (billyState === BILLY_HITTING_3) {
    billyState = BILLY_HITTING_4;
    image(gameAssets, -8, 5, BILLY_WIDTH + 24, BILLY_HEIGHT + 24,
      BILLY_IMAGE_WALKING_0_X + 57, BILLY_IMAGE_WALKING_Y + 90, BILLY_IMAGE_WIDTH + 15,
      BILLY_IMAGE_HEIGHT + 15);
  } else if (billyState === BILLY_HITTING_4) {
    billyState = BILLY_STANDING;
    image(gameAssets, -8, 5, BILLY_WIDTH + 24, BILLY_HEIGHT + 24,
      BILLY_IMAGE_WALKING_0_X + 89, BILLY_IMAGE_WALKING_Y + 90, BILLY_IMAGE_WIDTH + 15,
      BILLY_IMAGE_HEIGHT + 15);
  }
}

function animateEnemyHitting() {
  if (ballX >= enemyX) {
    scale(-1, 1);
  }
  if (enemyState === ENEMY_HITTING_1) {
    windSound.play();
    enemyState = ENEMY_HITTING_2;
    image(gameAssets, 0, 10, BILLY_WIDTH + 15, BILLY_HEIGHT + 15,
      BILLY_IMAGE_WALKING_0_X - 3, BILLY_IMAGE_WALKING_Y + 63, BILLY_IMAGE_WIDTH + 10,
      BILLY_IMAGE_HEIGHT + 10);
  } else if (enemyState === ENEMY_HITTING_2) {
    enemyState = ENEMY_HITTING_3;
    image(gameAssets, -10, 10, BILLY_WIDTH + 15, BILLY_HEIGHT + 15,
      BILLY_IMAGE_WALKING_0_X + 23, BILLY_IMAGE_WALKING_Y + 63, BILLY_IMAGE_WIDTH + 10,
      BILLY_IMAGE_HEIGHT + 10);
  } else if (enemyState === ENEMY_HITTING_3) {
    enemyState = ENEMY_HITTING_4;
    image(gameAssets, -8, 5, BILLY_WIDTH + 24, BILLY_HEIGHT + 24,
      BILLY_IMAGE_WALKING_0_X + 54, BILLY_IMAGE_WALKING_Y + 54, BILLY_IMAGE_WIDTH + 15,
      BILLY_IMAGE_HEIGHT + 15);
  } else if (enemyState === ENEMY_HITTING_4) {
    enemyState = BILLY_STANDING;
    image(gameAssets, -8, 5, BILLY_WIDTH + 24, BILLY_HEIGHT + 24,
      BILLY_IMAGE_WALKING_0_X + 86, BILLY_IMAGE_WALKING_Y + 54, BILLY_IMAGE_WIDTH + 15,
      BILLY_IMAGE_HEIGHT + 15);
  }
}

function drawBilly() {
  push();
  translate(billyX, billyY);
  imageMode(CENTER);
  if (!billyFlipped && billyState !== BILLY_STANDING && billyState <= BILLY_HITTING_1) {
    scale(-1, 1);
  }
  // Moving
  if (billyState === BILLY_STANDING) {
    image(gameAssets, 0, 7, BILLY_WIDTH + 10, BILLY_HEIGHT + 10,
      BILLY_IMAGE_STANDING_X, BILLY_IMAGE_STANDING_Y, BILLY_IMAGE_WIDTH + 6,
      BILLY_IMAGE_HEIGHT + 6);
  } else if (billyState === BILLY_WALKING_1) {
    image(gameAssets, -3, 0, BILLY_WIDTH, BILLY_HEIGHT,
      BILLY_IMAGE_WALKING_1_X, BILLY_IMAGE_WALKING_Y, BILLY_IMAGE_WIDTH,
      BILLY_IMAGE_HEIGHT);
  } else if (billyState === BILLY_WALKING_2) {
    image(gameAssets, 0, 0, BILLY_WIDTH, BILLY_HEIGHT,
      BILLY_IMAGE_WALKING_0_X, BILLY_IMAGE_WALKING_Y, BILLY_IMAGE_WIDTH,
      BILLY_IMAGE_HEIGHT);
  } else if (billyState === BILLY_WALKING_3) {
    image(gameAssets, 0, 0, BILLY_WIDTH, BILLY_HEIGHT,
      BILLY_IMAGE_WALKING_2_X, BILLY_IMAGE_WALKING_Y, BILLY_IMAGE_WIDTH,
      BILLY_IMAGE_HEIGHT);
  } else if (billyState === BILLY_HITTING_1 || billyState === BILLY_HITTING_2 || billyState === BILLY_HITTING_3 || billyState === BILLY_HITTING_4) {
    animateBillyHitting();
  }
  pop();
}

function drawEnemy() {
  push();
  translate(enemyX, enemyY);
  imageMode(CENTER);
  if (!enemyFlipped && enemyState !== ENEMY_STANDING && enemyState <= ENEMY_HITTING_1) {
    scale(-1, 1);
  }
  // Moving
  if (enemyState === ENEMY_STANDING) {
    image(gameAssets, 0, 3, BILLY_WIDTH + 2, BILLY_HEIGHT + 2,
      ENEMY_IMAGE_STANDING_X, ENEMY_IMAGE_STANDING_Y, BILLY_IMAGE_WIDTH + 3,
      BILLY_IMAGE_HEIGHT + 3);
  } else if (enemyState === ENEMY_WALKING_1) {
    image(gameAssets, -3, 0, BILLY_WIDTH, BILLY_HEIGHT,
      BILLY_IMAGE_WALKING_1_X, BILLY_IMAGE_WALKING_Y, BILLY_IMAGE_WIDTH,
      BILLY_IMAGE_HEIGHT);
  } else if (enemyState === ENEMY_WALKING_2) {
    image(gameAssets, 0, 0, BILLY_WIDTH, BILLY_HEIGHT,
      BILLY_IMAGE_WALKING_0_X, BILLY_IMAGE_WALKING_Y, BILLY_IMAGE_WIDTH,
      BILLY_IMAGE_HEIGHT);
  } else if (enemyState === ENEMY_WALKING_3) {
    image(gameAssets, 0, 0, BILLY_WIDTH, BILLY_HEIGHT,
      BILLY_IMAGE_WALKING_2_X, BILLY_IMAGE_WALKING_Y, BILLY_IMAGE_WIDTH,
      BILLY_IMAGE_HEIGHT);
  } else if (enemyState === ENEMY_HITTING_1 || enemyState === ENEMY_HITTING_2 || enemyState === ENEMY_HITTING_3 || enemyState === ENEMY_HITTING_4) {
    animateEnemyHitting();
  }
  pop();
}

function drawBall() {
  if (ballSpeedY < 0) {
    if (ballY < 375 && ballY > 300) {
      ballWidth += Math.floor(BALL_INITIAL_WIDTH * BALL_SCALE_FACTOR);
      ballHeight += Math.floor(BALL_INITIAL_HEIGHT * BALL_SCALE_FACTOR);
      shadowOffsetY += 5;
    }
    else if (ballY <= 300 && ballY > 200) {
      songPlayed = false;
      ballWidth -= Math.floor(BALL_INITIAL_WIDTH * BALL_SCALE_FACTOR);
      ballHeight -= Math.floor(BALL_INITIAL_HEIGHT * BALL_SCALE_FACTOR);
      shadowOffsetY -= 5;
    }
    else if (ballY <= 200 && ballY > 150) {
      if (!songPlayed) {
        songPlayed = true;
        tennisBallSound.play();
      }
      ballWidth += Math.floor(BALL_INITIAL_WIDTH * BALL_SCALE_FACTOR);
      ballHeight += Math.floor(BALL_INITIAL_HEIGHT * BALL_SCALE_FACTOR);
      shadowOffsetY += 5;
    }
    else if (ballY <= 150 && ballY > 125) {
      ballWidth -= Math.floor(BALL_INITIAL_WIDTH * BALL_SCALE_FACTOR);
      ballHeight -= Math.floor(BALL_INITIAL_HEIGHT * BALL_SCALE_FACTOR);
      shadowOffsetY += 5;
    } else {
      ballWidth = BALL_INITIAL_WIDTH;
      ballHeight = BALL_INITIAL_HEIGHT;
      shadowOffsetY = 20;
    }
  }
  else if (ballSpeedY > 0) {
    if (ballY >= 125 && ballY < 200) {
      ballWidth += Math.floor(BALL_INITIAL_WIDTH * BALL_SCALE_FACTOR);
      ballHeight += Math.floor(BALL_INITIAL_HEIGHT * BALL_SCALE_FACTOR);
      shadowOffsetY += 5;
    }
    else if (ballY >= 200 && ballY < 300) {
      songPlayed = false;
      ballWidth -= Math.floor(BALL_INITIAL_WIDTH * BALL_SCALE_FACTOR);
      ballHeight -= Math.floor(BALL_INITIAL_HEIGHT * BALL_SCALE_FACTOR);
      shadowOffsetY -= 5;
    }
    else if (ballY >= 300 && ballY < 350) {
      if (!songPlayed) {
        songPlayed = true;
        tennisBallSound.play();
      }
      ballWidth += Math.floor(BALL_INITIAL_WIDTH * BALL_SCALE_FACTOR);
      ballHeight += Math.floor(BALL_INITIAL_HEIGHT * BALL_SCALE_FACTOR);
      shadowOffsetY += 5;
    }
    else if (ballY >= 350 && ballY < 375) {
      ballWidth -= Math.floor(BALL_INITIAL_WIDTH * BALL_SCALE_FACTOR);
      ballHeight -= Math.floor(BALL_INITIAL_HEIGHT * BALL_SCALE_FACTOR);
      shadowOffsetY -= 5;
    } else {
      ballWidth = BALL_INITIAL_WIDTH;
      ballHeight = BALL_INITIAL_HEIGHT;
      shadowOffsetY = 20;
    }
  }

  push();
  imageMode(CENTER);
  let black = color(0, 0, 0, 127);
  noStroke();
  fill(black);
  circle(ballX, ballY + shadowOffsetY, ballWidth / 1.5);
  // translate(ballX, ballY);
  // rotate(ballAngle);
  // if (ballSpeedY !== 0) {
  //   ballAngle = (ballAngle + 45) % 360 
  // }
  image(gameAssets, ballX, ballY, ballWidth, ballHeight,
    BILLY_IMAGE_WALKING_0_X + 140, BILLY_IMAGE_WALKING_Y - 20, 12,
    12);
  pop();
}

function handleBillyMovement() {
  if (billyState >= BILLY_HITTING_1) {
    return;
  }
  if (keyIsDown(LEFT_ARROW)) {
    billyFlipped = true;
    billyX -= BILLY_SPEED;
    if (billyState === BILLY_WALKING_1) {
      billyState = BILLY_WALKING_2;
    }
    else if (billyState === BILLY_WALKING_2) {
      if (billyWalkingState === 0) {
        billyWalkingState = 1;
        billyState = BILLY_WALKING_3;
      } else {
        billyWalkingLeftState = 0;
        billyState = BILLY_WALKING_1;
      }
    }
    else {
      billyState = BILLY_WALKING_2;
    }
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    billyFlipped = false;
    billyX += BILLY_SPEED;
    if (billyState === BILLY_WALKING_1) {
      billyState = BILLY_WALKING_2;
    }
    else if (billyState === BILLY_WALKING_2) {
      if (billyWalkingState === 0) {
        billyWalkingState = 1;
        billyState = BILLY_WALKING_3;
      } else {
        billyWalkingLeftState = 0;
        billyState = BILLY_WALKING_1;
      }
    }
    else {
      billyState = BILLY_WALKING_2;
    }
  }
  else {
    billyState = BILLY_STANDING;
  }
}

function handleEnemyMovement() {
  if (enemyState >= ENEMY_HITTING_1) {
    return;
  }

  if (!isServing && ballSpeedY < 0 && ballY < billyY - 125) {
    if (ballY <= enemyY + 25) {
      enemyState = ENEMY_HITTING_1;
    } else if (ballX + 10 < enemyX) {
      animateEnemyMovingLeft();
    } else if (ballX - 10 > enemyX) {
      animateEnemyMovingRight();
    } else {
      enemyState = ENEMY_STANDING;
    }
  } else {
    if (enemyX > COURT_HEIGHT / 2) {
      animateEnemyMovingLeft();
    } else if (enemyX < COURT_HEIGHT / 2) {
      animateEnemyMovingRight();
    } else {
      enemyState = ENEMY_STANDING;
    }
  }
}

function animateEnemyMovingLeft() {
  if (enemyState === ENEMY_HITTING_1) {
    return;
  }
  enemyFlipped = true;
  enemyX -= ENEMY_SPEED;
  if (enemyState === BILLY_WALKING_1) {
    enemyState = BILLY_WALKING_2;
  }
  else if (enemyState === BILLY_WALKING_2) {
    if (enemyWalkingState === 0) {
      enemyWalkingState = 1;
      enemyState = BILLY_WALKING_3;
    } else {
      enemyWalkingLeftState = 0;
      enemyState = BILLY_WALKING_1;
    }
  }
  else {
    enemyState = BILLY_WALKING_2;
  }
}

function animateEnemyMovingRight() {
  if (enemyState === ENEMY_HITTING_1) {
    return;
  }

  enemyFlipped = false;
  enemyX += ENEMY_SPEED;
  if (enemyState === BILLY_WALKING_1) {
    enemyState = BILLY_WALKING_2;
  }
  else if (enemyState === BILLY_WALKING_2) {
    if (enemyWalkingState === 0) {
      enemyWalkingState = 1;
      enemyState = BILLY_WALKING_3;
    } else {
      enemyWalkingLeftState = 0;
      enemyState = BILLY_WALKING_1;
    }
  }
  else {
    enemyState = BILLY_WALKING_2;
  }
}

function handleBallMovement() {
  // Come back if it reaches certain point on top
  if (ballY <= enemyY + 25) {
    let newSpeedY = handleYDirection();
    if (newSpeedY !== ballSpeedY) {
      // impactSound.play();
      ballSpeedX = handleXDirection();
      ballSpeedY = newSpeedY;
    }
  }
  if (isServing) {
    if (ballY <= billyY - 60) {
      ballSpeedY = standardSpeed / 2;
      isServing = false;
    }
  }
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY >= BOTTOM_LIMIT || ballY <= TOP_LIMIT) {
    isServing = true;
    ballSpeedX = 0;
    ballSpeedY = 0;
    ballX = billyX;
    ballY = billyY;
    ballWidth = BALL_INITIAL_WIDTH;
    ballHeight = BALL_INITIAL_HEIGHT;
  }
}

function handleBallCollision() {
  if (ballY >= billyY - 25 && ballY <= billyY + 10 && ballX >= billyX - 25 && ballX <= billyX + 25) {
    // impactSound.play();
    ballSpeedY = -standardSpeed;
    ballSpeedX = handleXDirection();
  }
}

function handleXDirection() {
  let min = 0;
  let max = 0;
  if (ballX <= COURT_WIDTH / 2) {
    min = 0;
    max = 7;
  }
  else if (ballX > COURT_WIDTH / 2) {
    min = -7;
    max = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleYDirection() {
  if (ballY <= enemyY + 25 && ballY >= enemyY - 10 && ballX >= enemyX - 25 && ballX <= enemyX + 25) {
    return standardSpeed;
  } else {
    return -standardSpeed;
  }
}