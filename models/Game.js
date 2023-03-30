const { normalizeVector } = require("../helpers/normalizeVector.js");

class Game {
  constructor(roomId, START_VELOCITY) {
    // Room identifier
    this.roomId = roomId;

    // Board data
    this.boardRect;

    // Paddle data
    this.paddleHeight;

    this.leftPaddleRect = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };

    this.rightPaddleRect = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };

    // Scores
    this.scores = {
      leftScore: 0,
      rightScore: 0,
    };

    // Ball data
    this.ballDirection = normalizeVector(
      Math.floor(Math.random() * 200) / 100 - 1,
      Math.floor(Math.random() * 200) / 100 - 1
    );

    this.ballVelocity = START_VELOCITY;

    this.maxVelocity = 1;

    this.ballPosition = {
      top: 50,
      left: 50,
    };

    this.ballAxis;

    this.gameStart = false;

    this.gameLoop = null;

    this.readyPlayers = 0;
  }

  moveBall() {
    this.ballPosition = {
      top: this.ballPosition.top + this.ballDirection.y * this.ballVelocity,
      left: this.ballPosition.left + this.ballDirection.x * this.ballVelocity,
    };
  }

  get paddleYPositions() {
    return {
      left: this.leftPaddleRect.top,
      right: this.rightPaddleRect.top,
    };
  }

  // Takes data from client through socket
  // Data should be y position of both paddles
  // Returns obj, y position of both paddles
  movePaddles(data) {
    // contain left paddle within bounds
    if (this.boardRect) {
      if (data.left <= this.boardRect.top) {
        data.left = this.boardRect.top;
      } else if (data.left + this.paddleHeight >= this.boardRect.bottom) {
        data.left = this.boardRect.bottom - this.paddleHeight;
      }

      // contain right paddle within bounds
      if (data.right <= this.boardRect.top) {
        data.right = this.boardRect.top;
      } else if (data.right + this.paddleHeight >= this.boardRect.bottom) {
        data.right = this.boardRect.bottom - this.paddleHeight;
      }
    }

    this.rightPaddleRect.top = data.right;
    this.rightPaddleRect.bottom = data.right + this.paddleHeight;
    this.leftPaddleRect.top = data.left;
    this.leftPaddleRect.bottom = data.left + this.paddleHeight;
  }

  // Returns true of ball is out of vertical bounds
  verticalCollision() {
    if (this.ballPosition.top + this.ballAxis.height <= this.boardRect.top) {
      return true;
    } else if (
      this.ballPosition.top + this.ballAxis.height * 2 >=
      this.boardRect.bottom
    ) {
      return true;
    }
  }

  // Returns true of ball is out of horizontal bounds
  horizontalCollision() {
    // Handle horizontal bounds/score
    if (
      this.ballPosition.left + this.ballAxis.width * 2 <=
      this.boardRect.left
    ) {
      this.scores.rightScore += 1;
      return true;
    } else if (
      this.ballPosition.left + this.ballAxis.width * 3 >=
      this.boardRect.right
    ) {
      this.scores.leftScore += 1;
      return true;
    }
  }

  // Returns true if ball has collided with paddle
  handlePaddleCollision() {
    if (
      this.ballPosition.left + this.ballAxis.width * 2 <
        this.leftPaddleRect.right &&
      this.ballPosition.left + this.ballAxis.width > this.leftPaddleRect.left &&
      this.ballPosition.top + this.ballAxis.height <
        this.leftPaddleRect.bottom &&
      this.ballPosition.top > this.leftPaddleRect.top
    ) {
      return true;
    } else if (
      this.ballPosition.left <= this.rightPaddleRect.right &&
      this.ballPosition.left + this.ballAxis.width * 2 >=
        this.rightPaddleRect.left &&
      this.ballPosition.top + this.ballAxis.height <=
        this.rightPaddleRect.bottom &&
      this.ballPosition.top >= this.rightPaddleRect.top
    ) {
      return true;
    }
  }

  increaseSpeed(VELOCITY_INCREASE) {
    if (this.ballVelocity * VELOCITY_INCREASE < this.maxVelocity) {
      this.ballVelocity = this.ballVelocity * VELOCITY_INCREASE;
    }
  }

  // Resets the game
  reset() {
    this.ballDirection = normalizeVector(
      Math.floor(Math.random() * 200) / 100 - 1,
      Math.floor(Math.random() * 200) / 100 - 1
    );

    this.ballPosition = {
      top: 50,
      left: 50,
    };

    this.gameStart = false;

    this.readyPlayers = 0;

    this.gameLoop = null;
  }
}

module.exports = Game;
