interface IGame
{
	width:number;
	height:number;
	//-1: unrevealed, 0-8: number of adjacent mines
	cells:number[];
}

interface ISolveResult
{
	//-1 or null: unknown, 0: safe, 1: mine
	data:(number|null)[];
}