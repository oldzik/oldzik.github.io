let round = 1;
const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
const winSetups = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]

];
const game = {
    mode: "",
    firstChar: "",
    secChar: "",
};
const fields = [...document.querySelectorAll('.field')];
const withComp = document.getElementById("onePlayer");
const withOther = document.getElementById("twoPlayers");
const playersChoice = document.getElementById("playersChoice");
const O = document.getElementById("circle");
const X = document.getElementById("cross");
const charChoice = document.getElementById("charChoice");
const playAgain = document.getElementById("again");
const resultComm = document.getElementById("winnerComm")

withComp.addEventListener('click', function () {
    playersChoice.innerText = "Grasz z komputerem";
    game.mode = "one";
    disablePlayers();
})

withOther.addEventListener('click', function () {
    playersChoice.innerText = "Grasz z drugim graczem";
    game.mode = "two";
    disablePlayers();
})

O.addEventListener('click', function () {
    charChoice.innerText = "Grasz O, a przeciwnik X";
    game.firstChar = "O";
    game.secChar = "X";
    disableChars();
})

X.addEventListener('click', function () {
    charChoice.innerText = "Grasz X, a przeciwnik O";
    game.firstChar = "X";
    game.secChar = "O";
    disableChars();
})

function disablePlayers() {
    withComp.disabled = true;
    withOther.disabled = true;
}

function disableChars() {
    O.disabled = true;
    X.disabled = true;
}

function flattenBoard() {
    return board.reduce(function (a, b) {
        return a.concat(b);
    });
}

playAgain.addEventListener('click', resetGame);

fields.forEach(field => field.addEventListener('click', choose));

function choose(event) {

    if (game.mode == "" || game.firstChar == "") return;
    if (game.mode == "one") {
        const row = event.target.getAttribute("data-row");
        const col = event.target.getAttribute("data-column");
        if (board[row][col] !== "") return;
        event.target.innerText = game.firstChar;
        board[row][col] = game.firstChar;
        round++;
        check();
        if (round < 10 && resultComm.innerText === "") {
            aiMove();
            round++;
            check();
        }
    } else {
        const row = event.target.getAttribute("data-row");
        const col = event.target.getAttribute("data-column");
        const turn = round % 2 === 0 ? game.secChar : game.firstChar;
        if (board[row][col] !== "") return;
        event.target.innerText = turn;
        board[row][col] = turn;
        round++;
        check();
    }
    //remis
    if (round == 10 && resultComm.innerText === "") {
        resultComm.innerText = "REMIS!"
        finishGame();
    }
}

function aiMove() {
    let flattened = flattenBoard();
    let available = [];
    flattened.forEach((element, index) => {
        if (element === "") {
            available.push(index);
        }
    });
    const aiChoice = available[Math.floor(Math.random() * available.length)];
    fields[aiChoice].innerText = game.secChar;
    board[Math.floor(aiChoice / 3)][aiChoice % 3] = game.secChar;
}

function check() {
    let flattened = flattenBoard();
    let moves = {
        X: [],
        O: []
    };
    //Wprowadzam indeksy wybranych pól do tablic X i O, jeśli field === "", to nie wprowadzam nic.
    flattened.forEach((field, index) => moves[field] ? moves[field].push(index) : null);
    winSetups.forEach(winSetup => {
        if (winSetup.every(value => moves.X.indexOf(value) !== -1)) {
            win("X");
            finishGame();
        }
        if (winSetup.every(value => moves.O.indexOf(value) !== -1)) {
            win("O");
            finishGame();
        }
    });
}

function win(char) {
    if (char === game.firstChar) {
        resultComm.innerText = "WYGRAŁEŚ!";
    }
    if (char === game.secChar) {
        resultComm.innerText = "Niestety, przegrałeś :(";
    }
}

function finishGame() {
    game.mode = "";
    game.firstChar = "";
    game.secChar = "";
}

function resetGame() {
    finishGame();
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            board[i][j] = "";
        }
    }
    round = 1;
    fields.forEach(field => field.innerText = "");
    playersChoice.innerText = "";
    charChoice.innerText = "";
    resultComm.innerText = "";
    withComp.disabled = false;
    withOther.disabled = false;
    O.disabled = false;
    X.disabled = false;
}