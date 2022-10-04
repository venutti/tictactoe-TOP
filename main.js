const celdBoard = function(i) {
  let value = undefined;

  const getIndexRow = () => Math.floor(i/3);
  const getIndexColumn = () => i % 3;
  const isInFirstDiagonal = () => (i === 0) || (i === 4) || (i === 8);
  const isInSecondDiagonal = () => (i === 2) || (i === 4) || (i === 6);
  const contains = function(v) {
    return v === value;
  };
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

  return {
    add,
    isFullOf,
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
  const IAselection1 = function() {
    const undefArray = [];
    board.forEach((celd, i) => {
      if(celd.isEmpty()) {
        undefArray.push(i);
      }
    });
    return undefArray[Math.floor(Math.random() * undefArray.length)];
  };
  const reset = function() {
    board.forEach(celd => celd.reset());
  };

  return {
    rows,
    reset,
    setMovement,
    isTie,
    isWin,
    IAselection1,
  };
})();

const displayController = (function() {
  const boardElement = document.querySelector('.board');
  const celdsElement = Array.from(document.querySelectorAll('.celd'));
  const turnElement = document.querySelector('.turn');
  const overlayElement = document.querySelector('.overlay');
  const gameResultElement = document.querySelector('.game-result');
  const scoreXelement = document.querySelector('.X');
  const scoreOelement = document.querySelector('.O');
  const scores = {
    'X': 0,
    'O': 0,
  };

  let player1 = 'X';
  let player2 = 'O';
  let currentPlayer = player1;

  const showBoard = function() {
    scoreXelement.textContent = scores.X;
    scoreOelement.textContent = scores.O;
    boardElement.classList.add('active');
  };
  const hideBoard = function() {
    boardElement.classList.remove('active');
  };
  const showModal = function(msj) {
    gameResultElement.textContent = msj;
    overlayElement.classList.add('active');
    gameResultElement.classList.add('active');
  };
  const hideModal = function() {
    gameResultElement.textContent = '';
    overlayElement.classList.remove('active');
    gameResultElement.classList.remove('active');
  }
  const changePlayer = function() {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    turnElement.textContent = `Turno de ${currentPlayer}`;
  };
  const showMovement = function(index) {
    const celd = celdsElement[index];
    celd.classList.add('active');
    celd.textContent = currentPlayer;
  };
  const clear = function() {
    celdsElement.forEach(celd => {
      celd.classList.remove('active');
      celd.textContent = '';
    });
    hideBoard();
    gameBoard.reset();
  };
  const resolveTie = function() {
    clear();
    showModal('¡Empate!');
  };
  const resolveWin = function() {
    scores[currentPlayer]++;
    clear();
    showModal(`¡Ha ganado ${currentPlayer}!`);
  };
  const analizeState = function(index) {
    console.log(index, currentPlayer)
    if(gameBoard.isWin(index, currentPlayer)) {
      resolveWin();
      return;
    };
    if(gameBoard.isTie()) {
      resolveTie();
      return;
    };
  };
  const setMovement = function(index) {
    let couldMove = gameBoard.setMovement(index, currentPlayer);
    if(!couldMove) return;
    showMovement(index);
    analizeState(index);
    changePlayer();
  };
  const setIaMovement = function(iaLevel) {
    if(iaLevel === 0) return;
    if(iaLevel === 1) {
      setMovement(gameBoard.IAselection1());
    }
  };
  const init = function(iaLevel) {
    showBoard();
    boardElement.addEventListener('click', e => {
      const index = e.target.dataset.id;
      if(index === undefined) return;
      displayController.setMovement(index);
      displayController.setIaMovement(iaLevel);
    });
    overlayElement.addEventListener('click', () => {
      hideModal();
      showBoard();
    });
    gameResultElement.addEventListener('click', () => {
      hideModal();
      showBoard();
    });
  };

  return {
    init,
    setMovement,
    setIaMovement,
  };
})();

const selectionLayout = document.querySelector('.selection');
const principalLayout = document.querySelector('.principal');
const selections = Array.from(document.querySelectorAll('.selection-item'));
selections.forEach(selection => {
  selection.addEventListener('click', () => {
    const ia = +selection.dataset.ia;
    displayController.init(ia);
    selectionLayout.classList.toggle('hide');
    principalLayout.classList.toggle('hide');
  });
});








