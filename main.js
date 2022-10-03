const player = function(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;

  return {
    getName,
    getMarker,
  };
};

const celdBoard = function(i) {
  let value = undefined;

  const getIndexRow = () => Math.floor(i/3);
  const getIndexColumn = () => i % 3;
  const isInFirstDiagonal = () => (i === 0) || (i === 4) || (i === 8);
  const isInSecondDiagonal = () => (i === 2) || (i === 4) || (i === 6);
  const contains = function(v) {
    return v === value;
  };
  const getValue = function() {
    return value;
  }; //debug
  const setValue = (newValue) => {
    value = newValue;
  };
  const isEmpty = function() {
    return value === undefined;
  };
  const reset = function() {
    value = undefined;
  };

  return {
    getIndexRow,
    getIndexColumn,
    isInFirstDiagonal,
    isInSecondDiagonal,
    contains,
    getValue,
    setValue,
    isEmpty,
    reset,
  };
};

const celdCollection = function() {
  const celds = [];

  const add = function(celd) {
    celds.push(celd);
  };
  const isFullOf = function(marker) {
    return celds.every(celd => celd.contains(marker));
  };
  const show = function() {
    return celds.map(celd => celd.getValue());
  }; // debug

  return {
    add,
    isFullOf,
    show,
  };
};

const gameBoard = (function() {
  board = [];
  rows = [celdCollection(), celdCollection(), celdCollection()];
  columns = [celdCollection(), celdCollection(), celdCollection()];
  firstDiagonal = celdCollection();
  secondDiagonal = celdCollection();
  /*create celds*/
  for(let i = 0; i < 9; i++) {
    let newCeld = celdBoard(i);
    board.push(newCeld);
  };
  /*assign celds*/
  board.forEach(celd => {
    rows[celd.getIndexRow()].add(celd);
    columns[celd.getIndexColumn()].add(celd);
    if(celd.isInFirstDiagonal()) {
      firstDiagonal.add(celd);
    };
    if(celd.isInSecondDiagonal()) {
      secondDiagonal.add(celd);
    };
  });

  const isEmpty = function(index) {
    return board[index].isEmpty();
  }; 
  const isTie = function() {
    return board.every(celd => !celd.isEmpty());
  };
  const isWin = function(index, marker) {
    let celd = board[index];

    if(rows[celd.getIndexRow()].isFullOf(marker) || columns[celd.getIndexColumn()].isFullOf(marker)) {
      return true;
    };
    if(celd.isInFirstDiagonal() && firstDiagonal.isFullOf(marker)) {
      return true;
    };
    if(celd.isInSecondDiagonal() && secondDiagonal.isFullOf(marker)) {
      return true;
    };

    return false;
  };
  const setMovement = function(index, marker) {
    if (!isEmpty(index)) return false;
    board[index].setValue(marker);
    return true;
  };
  const show = function() {
    console.log(board.map(celd => celd.getValue()));
    rows.forEach(row => {
      console.log(row.show());
    });
  }; // debug
  const reset = function() {
    board.forEach(celd => celd.reset());
  };

  return {
    rows,
    reset,
    setMovement,
    isTie,
    isWin,
    show,
  };
})();

const displayController = (function() {
  const boardElement = document.querySelector('.board');
  const celdsElement = Array.from(document.querySelectorAll('.celd'));
  const img = {
    'X' : 'img/simbolo-x.png',
    'O' : 'img/simbolo-o.png',
  };

  let player1 = player('Juan', 'X');
  let player2 = player('Pedro', 'O');  
  let currentPlayer = player1;

  const changePlayer = function() {
    if(currentPlayer === player1) {
      currentPlayer = player2;
    }else{
      currentPlayer = player1;
    };
  };
  const showMovement = function(celd, marker) {
    celd.style.backgroundImage = `url(${img[marker]})`;
  };
  const clear = function() {
    celdsElement.forEach(celd => {
      celd.style.backgroundImage = 'none';
    });
  };
  const analizeState = function(index, marker) {
    if(gameBoard.isTie()) {
      console.log('Empate wei');
      gameBoard.reset();
      clear();
    };
    if(gameBoard.isWin(index, marker)) {
      console.log(`Ganó ${marker} wei`);
      gameBoard.reset();
      clear();
    };
  };
  const setMovement = function(celd, index) {
    let marker = currentPlayer.getMarker();
    let couldMove = gameBoard.setMovement(index, marker);
    if(!couldMove) return;
    showMovement(celd, marker);
    analizeState(index, marker);
    changePlayer();
  };
  const init = function() {
    boardElement.addEventListener('click', e => {
      const celd = e.target;
      const index = e.target.dataset.id;
      if(index === undefined) return;
      displayController.setMovement(celd, index);
    });
  };

  return {
    init,
    setMovement,
  };
})();

displayController.init()







