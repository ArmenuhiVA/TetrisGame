export class Game {
    static points = {
        "1": 40,
        "2": 100,
        "3": 300,
        "4": 1200
    };
    score = 0;
    lines = 19;
    playField =this.createPlayField();
    activePiece = this.createPiece();
    nextPiece = this.createPiece();
    get level(){
        return Math.floor(this.lines * 0.1)
    }
    getState(){
        const playField = this.createPlayField();
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;
        for (let y = 0; y < this.playField.length; y++) {
            playField[y] = [];
             for (let x = 0; x < this.playField[y].length; x++) {
                playField[y][x] = this.playField[y][x];
                 
             }
         }
         for (let y = 0; y < blocks.length; y++) {
             for (let x = 0; x < blocks[y].length; x++) {
                if(blocks[y][x]){
                    playField[pieceY + y][pieceX + x] = blocks[y][x];
                }
             }
         }
        return{
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playField
        }
    }
    createPlayField(){
        let playField = [];
        for (let y = 0; y < 20; y++) {
           playField[y] = [];
            for (let x = 0; x < 10; x++) {
               playField[y][x] = 0;
                
            }
        }
        return playField;
    }
    createPiece(){
        const index = Math.floor(Math.random() * 7);
        const type = "IJLOSTZ"[index];
        const piece = {};
        switch (type){
            case "I":
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ];
                break;
            case "J":
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2],
                  ];
                  break;
            case "L":
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0],
                  ];
                  break;
            case "O":
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0],
                  ];
                  break;
            case "S":
                piece.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0],
                  ];
                  break;
            case "T":
                piece.blocks = [
                    [0, 6, 0],
                    [6, 6, 6],
                    [0, 0, 0],
                  ];
                  break;
            case "Z":
                piece.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7],
                  ];
                  break;  
            default:
                throw new Error("Unknown shape");  
        }
        piece.x = Math.floor((10 - piece.blocks[0].length)/2);
        piece.y = -1;
        return piece;
        
    }
    movePieceLeft(){
        this.activePiece.x --;
        if(this.hasCollision()){
            this.activePiece.x ++;
        }
    }
    movePieceRight(){
        this.activePiece.x ++;
        if(this.hasCollision()){
            this.activePiece.x --;
        }
    }
    movePieceDown(){
        this.activePiece.y += 1;

        if(this.hasCollision()){
            this.activePiece.y -= 1;
            this.lockPiece();
            const clearedLines = this.clearLines();
            this.updateScore(clearedLines);
            this.updatePieces();
        }
    }
    rotatePiece(){
      this.rotateBlocks();
      if(this.hasCollision()){
        this.rotateBlocks(false);
      }
    }
    rotateBlocks(clockwise = true){
        let blocks = this.activePiece.blocks;
        let length = blocks.length;
        let x = Math.floor(length/2);
        let y = length-1;

        for(let i = 0; i < x; i++){
            for (let j = i; j < y-i; j++) {
                const temp = blocks[i][j];
                if(clockwise){
                    blocks[i][j] = blocks[y-j][i];
                    blocks[y-j][i] = blocks[y-i][y-j];
                    blocks[y-i][y-j] = blocks[j][y-i];
                    blocks[j][y-i] = temp
                }else{
                    blocks[i][j] = blocks[j][y-i];
                    blocks[j][y-i] = blocks[y-i][y-j];
                    blocks[y-i][y-j] = blocks[y-j][i];
                    blocks[y-j][i] = temp
                }
              
            }
        }
    }
    hasCollision(){
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if(blocks[y][x] &&
                   ((this.playField[pieceY + y] === undefined || 
                    this.playField[pieceY + y][pieceX + x] === undefined) ||
                    this.playField[pieceY + y][pieceX + x] !== 0)){
                    return true
                }
            }
        }
        return false
    }
    lockPiece(){
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if(blocks[y][x]){
                  this.playField[pieceY+y][pieceX+x] = blocks[y][x];
                }
            }
        }
    }
    clearLines(){
        const columns = 10;
        const rows = 20;
        let lines = [];

        for (let y = rows-1; y >= 0; y--) {
            let numberOfBlocks = 0;
            for (let x = 0; x < columns; x++) {
                if(this.playField[y][x]){
                    numberOfBlocks++;
                }
            }
            if(numberOfBlocks === 0){
                break;
            }else if(numberOfBlocks < columns){
                continue;
            }else if(numberOfBlocks === columns){
                lines.unshift(y)
            }
        }
       for(let index of lines){
        this.playField.splice(index, 1);
        this.playField.unshift(new Array(columns).fill(0));
       }
       return lines.length;
    }
    updateScore(clearedLines){
       if(clearedLines > 0){
             this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
       }
    }
    updatePieces(){
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }
}