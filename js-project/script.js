class Game2048 {
    constructor() {
        this.grid = document.querySelector('.grid');
        this.startButton = document.getElementById('startButton');
        this.gameContainer = document.getElementById('gameContainer');
        this.coverScreen = document.getElementById('coverScreen');
        this.result = document.getElementById('result');
        this.overText = document.getElementById('overText');
        this.scoreElement = document.getElementById('score');

        this.matrix = [];
        this.score = 0;
        this.rows = 4;
        this.columns = 4;
        
        this.isSwiped = false;
        this.touchY = 0;
        this.initialY = 0;
        this.touchX = 0;
        this.initialX = 0;
        this.swipeDirection = '';
        this.rectLeft = 0;
        this.rectTop = 0;

        this.init();
    }

    init() {
        this.startButton.addEventListener('click', () => {
            this.startGame();
            this.swipeDirection = '';
        });

        document.addEventListener('keyup', (e) => this.handleKeyPress(e));
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const gridContainer = document.querySelector('.grid');

        gridContainer.addEventListener('touchstart', (event) => {
            this.isSwiped = true;
            this.getXY(event);
            this.initialX = this.touchX;
            this.initialY = this.touchY;
        });

        gridContainer.addEventListener('touchmove', (event) => {
            if (this.isSwiped) {
                this.getXY(event);
                let diffX = this.touchX - this.initialX;
                let diffY = this.touchY - this.initialY;
                
                if (Math.abs(diffY) > Math.abs(diffX)) {
                    this.swipeDirection = diffY > 0 ? 'down' : 'up';
                } else {
                    this.swipeDirection = diffX > 0 ? 'right' : 'left';
                }
            }
        });

        gridContainer.addEventListener('touchend', () => {
            this.isSwiped = false;
            const swipeCalls = {
                up: () => this.slideUp(),
                down: () => this.slideDown(),
                left: () => this.slideLeft(),
                right: () => this.slideRight()
            };
            
            if (this.swipeDirection && swipeCalls[this.swipeDirection]) {
                swipeCalls[this.swipeDirection]();
                this.scoreElement.innerText = this.score;
            }
        });
    }

    getXY(e) {
        const rect = document.querySelector('.grid').getBoundingClientRect();
        this.rectLeft = rect.left;
        this.rectTop = rect.top;
        this.touchX = e.touches[0].pageX - this.rectLeft;
        this.touchY = e.touches[0].pageY - this.rectTop;
    }

    createGrid() {
        const gridContainer = document.querySelector('.grid');
        gridContainer.innerHTML = '';
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const boxDiv = document.createElement("div");
                boxDiv.className = "bg-[#cdc1b5] rounded flex items-center justify-center font-bold text-2xl md:text-3xl aspect-square transition-all duration-200";
                boxDiv.setAttribute("data-position", `${i}_${j}`);
                gridContainer.appendChild(boxDiv);
            }
        }
    }

    adjacentCheck(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] == arr[i + 1]) {
                return true;
            }
        }
        return false;
    }

    possibleMovesCheck() {
        // Check rows
        for (let i in this.matrix) {
            if (this.adjacentCheck(this.matrix[i])) {
                return true;
            }
            
            // Check columns
            let colarr = [];
            for (let j = 0; j < this.columns; j++) {
                colarr.push(this.matrix[i][j]);
            }
            if (this.adjacentCheck(colarr)) {
                return true;
            }
        }
        return false;
    }

    randomPosition(arr) {
        return Math.floor(Math.random() * arr.length);
    }

    hasEmptyBox() {
        for (let r in this.matrix) {
            for (let c in this.matrix[r]) {
                if (this.matrix[r][c] == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    gameOverCheck() {
        if (!this.possibleMovesCheck()) {
            this.coverScreen.classList.remove("hidden");
            this.gameContainer.classList.add("hidden");
            this.overText.classList.remove("hidden");
            this.result.innerText = `Final score: ${this.score}`;
            this.startButton.innerText = "Restart Game";
        }
    }

    generateTwo() {
        if (this.hasEmptyBox()) {
            let randomRow = this.randomPosition(this.matrix);
            let randomCol = this.randomPosition(this.matrix[this.randomPosition(this.matrix)]);
            
            if (this.matrix[randomRow][randomCol] == 0) {
                this.matrix[randomRow][randomCol] = 2;
                this.updateBox(randomRow, randomCol, 2);
            } else {
                this.generateTwo();
            }
        } else {
            this.gameOverCheck();
        }
    }

    generateFour() {
        if (this.hasEmptyBox()) {
            let randomRow = this.randomPosition(this.matrix);
            let randomCol = this.randomPosition(this.matrix[this.randomPosition(this.matrix)]);
            
            if (this.matrix[randomRow][randomCol] == 0) {
                this.matrix[randomRow][randomCol] = 4;
                this.updateBox(randomRow, randomCol, 4);
            } else {
                this.generateFour();
            }
        } else {
            this.gameOverCheck();
        }
    }

    updateBox(row, col, value) {
        const element = document.querySelector(`[data-position='${row}_${col}']`);
        element.innerHTML = value;
        element.className = `rounded flex items-center justify-center font-bold text-2xl md:text-3xl aspect-square transition-all duration-200 ${this.getBoxClass(value)}`;
    }

    getBoxClass(value) {
        const classes = {
            2: 'bg-[#eee4da] text-[#727371]',
            4: 'bg-[#eee1c9] text-[#727371]',
            8: 'bg-[#f3b27a] text-white',
            16: 'bg-[#f69664] text-white',
            32: 'bg-[#f77c5f] text-white',
            64: 'bg-[#f75f3b] text-white',
            128: 'bg-[#edd073] text-white',
            256: 'bg-[#edcc63] text-white',
            512: 'bg-[#edc651] text-white',
            1024: 'bg-[#eec744] text-white',
            2048: 'bg-[#ecc230] text-white'
        };
        return classes[value] || 'bg-[#cdc1b5]';
    }

    removeZero(arr) {
        return arr.filter(num => num);
    }

    checker(arr, reverseArr = false) {
        arr = reverseArr ? this.removeZero(arr).reverse() : this.removeZero(arr);

        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] == arr[i + 1]) {
                arr[i] += arr[i + 1];
                arr[i + 1] = 0;
                this.score += arr[i];
            }
        }

        arr = reverseArr ? this.removeZero(arr).reverse() : this.removeZero(arr);

        let missingCount = 4 - arr.length;
        while (missingCount > 0) {
            if (reverseArr) {
                arr.unshift(0);
            } else {
                arr.push(0);
            }
            missingCount -= 1;
        }
        return arr;
    }

    slideDown() {
        for (let i = 0; i < this.columns; i++) {
            let num = [];
            for (let j = 0; j < this.rows; j++) {
                num.push(this.matrix[j][i]);
            }
            num = this.checker(num, true);
            for (let j = 0; j < this.rows; j++) {
                this.matrix[j][i] = num[j];
                this.updateBox(j, i, this.matrix[j][i]);
            }
        }

        let decision = Math.random() > 0.5 ? 1 : 0;
        if (decision) {
            setTimeout(() => this.generateFour(), 200);
        } else {
            setTimeout(() => this.generateTwo(), 200);
        }
    }

    slideUp() {
        for (let i = 0; i < this.columns; i++) {
            let num = [];
            for (let j = 0; j < this.rows; j++) {
                num.push(this.matrix[j][i]);
            }
            num = this.checker(num);
            for (let j = 0; j < this.rows; j++) {
                this.matrix[j][i] = num[j];
                this.updateBox(j, i, this.matrix[j][i]);
            }
        }

        let decision = Math.random() > 0.5 ? 1 : 0;
        if (decision) {
            setTimeout(() => this.generateFour(), 200);
        } else {
            setTimeout(() => this.generateTwo(), 200);
        }
    }

    slideRight() {
        for (let i = 0; i < this.rows; i++) {
            let num = [];
            for (let j = 0; j < this.columns; j++) {
                num.push(this.matrix[i][j]);
            }
            num = this.checker(num, true);
            for (let j = 0; j < this.columns; j++) {
                this.matrix[i][j] = num[j];
                this.updateBox(i, j, this.matrix[i][j]);
            }
        }

        let decision = Math.random() > 0.5 ? 1 : 0;
        if (decision) {
            setTimeout(() => this.generateFour(), 200);
        } else {
            setTimeout(() => this.generateTwo(), 200);
        }
    }

    slideLeft() {
        for (let i = 0; i < this.rows; i++) {
            let num = [];
            for (let j = 0; j < this.columns; j++) {
                num.push(this.matrix[i][j]);
            }
            num = this.checker(num);
            for (let j = 0; j < this.columns; j++) {
                this.matrix[i][j] = num[j];
                this.updateBox(i, j, this.matrix[i][j]);
            }
        }

        let decision = Math.random() > 0.5 ? 1 : 0;
        if (decision) {
            setTimeout(() => this.generateFour(), 200);
        } else {
            setTimeout(() => this.generateTwo(), 200);
        }
    }

    handleKeyPress(e) {
        if (e.code == "ArrowLeft") {
            this.slideLeft();
        } else if (e.code == "ArrowRight") {
            this.slideRight();
        } else if (e.code == "ArrowUp") {
            this.slideUp();
        } else if (e.code == "ArrowDown") {
            this.slideDown();
        }
        this.scoreElement.innerText = this.score;
    }

    startGame() {
        this.score = 0;
        this.scoreElement.innerText = this.score;
        this.matrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        
        this.gameContainer.classList.remove("hidden");
        this.coverScreen.classList.add("hidden");
        this.overText.classList.add("hidden");
        
        this.createGrid();
        this.generateTwo();
        this.generateTwo();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});