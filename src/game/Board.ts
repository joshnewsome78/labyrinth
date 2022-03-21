
class Cell {
    public Bottom:boolean = true;
    public Right:boolean = true;
    public Top:boolean = true;
    public Left:boolean = true;
}

export default class Board {

    public boardWidth:number = 8;
    public boardHeight:number = 8;

    public boardArray:Cell[][] = [];

    public static GenerateRandomBoard(aspectRatio:number):Board {

        let result = new Board();
        result.boardHeight = Math.floor(result.boardWidth/aspectRatio)
        for(var row = 0; row < result.boardHeight; row++) {
            result.boardArray.push([]);
            for(var column=0; column < result.boardWidth; column++) {
                result.boardArray[row].push(new Cell());
            }
        }
        result.divideBoard(0, 0, result.boardWidth, result.boardHeight);

        let escape = Math.floor(Math.random() * result.boardWidth);
        result.boardArray[result.boardHeight-1][escape].Bottom = false;

        return result;
    }

    private divideBoard(row:number, column:number, width:number, height:number) {
        enum orientationEnum {
            Horizontal = 0,
            Vertical = 1
        }

        if(width <= 1 && height <= 1) {
            return;
        }

        let orientation:orientationEnum = Math.floor(Math.random()*2);

        if(width <= 1 || width < height) {
            orientation = orientationEnum.Horizontal;
        }
        else if(height <= 1 || height < width ) {
            orientation = orientationEnum.Vertical;
        }

        let getWidthOrHeight = ():number => orientation === orientationEnum.Horizontal ? height : width;
        let getLineLength = ():number => orientation === orientationEnum.Horizontal ? width : height;

        let position = Math.floor(Math.random() * (getWidthOrHeight()-1))+1;
        let openPosition = Math.floor(Math.random() * getLineLength());

        if(orientation === orientationEnum.Horizontal) {
            this.boardArray[row+position-1][column+openPosition].Bottom = false;
            if(row < this.boardHeight-1) this.boardArray[row+position][column+openPosition].Top = false;
        }
        else {
            this.boardArray[row+openPosition][column+position-1].Right = false;
            if(column < this.boardWidth-1 )this.boardArray[row+openPosition][column+position].Left = false;
        }


        this.divideBoard(row, column,
            orientation === orientationEnum.Horizontal ? width : position,
            orientation === orientationEnum.Vertical ? height: position);
    
        this.divideBoard(
            orientation === orientationEnum.Horizontal ? row + position : row,
            orientation === orientationEnum.Vertical ? column + position : column,
            orientation === orientationEnum.Horizontal ? width : width - position,
            orientation === orientationEnum.Vertical ? height: height - position);

    } 
}


