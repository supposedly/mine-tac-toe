const PLAYER_COUNT = 2;
const BOARD_WIDTH = 16;
const BOARD_HEIGHT = 16;
const MINE_COUNT = 20;

const Clicks = Object.freeze({
  LEFT: 1,
  RIGHT: 2,
});


class Tile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x * 32, 64 + y * 32, texture);
    this.setOrigin(0, 0).setInteractive();
    this._state = -10;
    this._isFlagged = false;
    this._flaggedBy = null;
    this.boardX = x;
    this.boardY = y;
    this.on('pointerdown', () => { if (this.isCovered()) this.setTint(0x777777); });
    this.on('pointerup', this.changeState);
  }

  // eslint-disable-next-line class-methods-use-this
  _playerToKey(currentPlayer) {
    return currentPlayer === 0 ? 'x' : 'o';
  }

  changeState(data) {
    this.clearTint();
    let changeTurn = true;
    switch (data.buttons) {
      case Clicks.LEFT:
        this.scene.uncover(this);
        break;
      case Clicks.RIGHT:
        if (!this.isFlagged()) {
          this.scene.flag(this);
        } else if (this._flaggedBy === this.scene.currentPlayer) {
          this.unflag();
        } else {
          changeTurn = false;
        }
        break;
      default:
        return;
    }
    if (changeTurn) {
      this.scene.changeTurn();
    }
  }

  setState(num) {
    this._state = num;
    this.setTexture(num < 0 ? 'covered-tile' : num.toString());
  }

  isCovered() {
    return this._state < 0;
  }

  isFlagged(currentPlayer = null) {
    if (!this.isCovered()) {
      return false;
    }
    return this._isFlagged && (currentPlayer === null || this._flaggedBy === currentPlayer);
  }

  flaggedBy() {
    return this._flaggedBy;
  }

  uncover() {
    if (!this.isCovered()) {
      return;
    }
    this._state = -this._state;
    if (this._state === 10) {
      this._state = 0;
    }
    this.setTexture(this._state.toString());
  }

  flag(currentPlayer) {
    if (!this.isCovered() || this.isFlagged()) {
      return;
    }
    this.setTexture(`${this._playerToKey(currentPlayer)}-flagged-tile`);
    this._isFlagged = true;
    this._flaggedBy = currentPlayer;
  }

  unflag() {
    if (!this.isCovered()) {
      return;
    }
    this.setTexture('covered-tile');
    this._isFlagged = false;
    this._flaggedBy = null;
  }
}

class Scene extends Phaser.Scene {
  constructor(...args) {
    super(...args);

    this.clickedYet = false;
    this.currentPlayer = 0;
    /*
    this.initialTime = null;
    this.timeText = null;
    */

    this.playerCount = PLAYER_COUNT;
    this.mineCount = MINE_COUNT;
    this.boardHeight = BOARD_HEIGHT;
    this.boardWidth = BOARD_WIDTH;
  }

  preload() {
    this.board = new Array(this.boardHeight)
      .fill(null)
      .map(
        () => new Array(this.boardWidth).fill(-10),
      );

    this.load.image('covered-tile', 'assets/covered-tile.png');
    this.load.image('x-flagged-tile', 'assets/x-flagged-tile.png');
    this.load.image('o-flagged-tile', 'assets/o-flagged-tile.png');
    this.load.image('0', 'assets/0.png');
    this.load.image('1', 'assets/1.png');
    this.load.image('2', 'assets/2.png');
    this.load.image('3', 'assets/3.png');
    this.load.image('4', 'assets/4.png');
    this.load.image('5', 'assets/5.png');
    this.load.image('6', 'assets/6.png');
    this.load.image('7', 'assets/7.png');
    this.load.image('8', 'assets/8.png');
    this.load.image('9', 'assets/bomb.png');
  }

  create() {
    /* this.timeText = this.add.text(0, 0).setOrigin(0, 0).setText('000'); */
    this.input.mouse.disableContextMenu();
    for (let y = 0; y < this.boardHeight; y++) {
      for (let x = 0; x < this.boardWidth; x++) {
        this.board[y][x] = this.add.existing(new Tile(this, x, y, 'covered-tile'));
      }
    }
  }

  /*
  update(time, delta) {
    if (!this.clickedYet) {
      return;
    }
    if (this.initialTime === null) {
      this.initialTime = time / 1000;
    }
    this.timeText.setText(
      Math.floor(time / 1000 - this.initialTime)
        .toLocaleString('en', {
          maximumFractionDigits: 0,
          minimumIntegerDigits: 3,
        }),
    );
  }
  */

  changeTurn() {
    this.currentPlayer = (this.currentPlayer + 1) % 2;
  }

  flag(tile) {
    if (!tile.isCovered() || tile.isFlagged()) {
      return;
    }
    let valid = false;
    this.iterateMooreNeighborhood(
      tile.boardX,
      tile.boardY,
      (neighbor) => {
        valid = valid || (neighbor._state > 0 || neighbor.isFlagged(this.currentPlayer));
      },
    );
    if (valid) {
      tile.flag(this.currentPlayer);
    }
  }

  uncover(tile) {
    if (!tile.isCovered() || tile.isFlagged()) {
      return;
    }
    if (!this.clickedYet) {
      this.clickedYet = true;
      this.populate(tile.boardX, tile.boardY);
    }
    const oldState = tile._state;
    tile.uncover();
    if (oldState === -10) {
      this.iterateMooreNeighborhood(tile.boardX, tile.boardY, this.uncover.bind(this));
    }
  }

  populate(avoidX, avoidY) {
    for (let count = 0; count < this.mineCount; count++) {
      let x; let
        y;
      do {
        x = Math.floor(Math.random() * this.boardWidth);
        y = Math.floor(Math.random() * this.boardHeight);
      } while (
        Math.abs(x - avoidX) <= 1
              || Math.abs(y - avoidY) <= 1
              || this.board[y][x]._state === -9
      );
      this.board[y][x].setState(-9);
    }
    this.board.forEach(arr => arr.forEach(
      (tile) => {
        if (Math.abs(tile._state) !== 9) {
          tile.setState(-this.countBombNeighbors(tile.boardX, tile.boardY) || -10);
        }
      },
    ));
  }

  countBombNeighbors(x, y) {
    let total = 0;
    this.iterateMooreNeighborhood(
      x, y, (neighbor) => { total += (Math.abs(neighbor._state) === 9); }
    );
    return total;
  }

  iterateMooreNeighborhood(x, y, callback) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      if (y + yOffset < 0 || y + yOffset >= this.boardHeight) {
        continue;
      }
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        if (
          x + xOffset < 0
          || x + xOffset >= this.boardWidth
          || (yOffset === 0 && xOffset === 0)
        ) {
          continue;
        }
        callback(this.board[y + yOffset][x + xOffset]);
      }
    }
  }
}


new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  scene: Scene,
});
