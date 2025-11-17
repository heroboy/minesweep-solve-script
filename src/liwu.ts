export function injectLiWu(onClickSolve: () => void, onClickSolve2: () => void)
{
	if (location.hostname.toLowerCase() !== 'www.253874.net') return false;
	const tag = document.querySelector('.game-info');
	if (!tag) return false;
	const div = document.createElement('div');
	div.innerHTML = '<button class="btn-solve">solve</button><button class="btn-solve-reveal">solve&reveal</button>';
	tag.insertAdjacentElement('afterend', div);
	div.querySelector('.btn-solve')?.addEventListener('click', () => { onClickSolve(); });
	div.querySelector('.btn-solve-reveal')?.addEventListener('click', () => { onClickSolve2(); });
	return true;
}

export function getGame(): IGame | null
{
	const width = 24;
	const height = 18;
	const cells = Array.from(document.querySelectorAll('#game-board .cell'));
	if (cells.length !== width * height)
	{
		console.warn(`get game null, cells.length=${cells.length}, should be ${width * height}`);
		return null;
	}
	const data = Array.from({ length: width * height }, () => -1);
	for (let i = 0; i < width * height; ++i)
	{
		if (cells[i].classList.contains('revealed'))
		{
			const text = cells[i].textContent.trim();
			let v: number;
			if (text === '')
				v = 0;
			else
				v = parseInt(text);
			if (v >= 0 && v <= 8)
				data[i] = v;
			else
				return null;

		}
	}
	// const board = document.getElementById('game-board') as HTMLDivElement;
	// if (board)
	// {
	// 	new Overlay(board);
	// }
	return { width, height, cells: data };
}

export function renderUI(data: number[])
{
	const board = document.getElementById('game-board') as HTMLDivElement;
	if (!board) return;
	//const cells = Array.from(board.querySelectorAll('.cell')) as HTMLDivElement[];
	const overlay = new Overlay(board);
	for (let i = 0; i < overlay.cells.length; i++)
	{
		if (data[i] === 0 || data[i] === 1)
		{
			const color = data[i] === 0 ? 'green' : 'red';
			overlay.setDot(i, color);
		}
	}
}


export class Overlay
{
	cells: HTMLDivElement[] = [];
	constructor(board: HTMLDivElement)
	{
		const parent = board.parentElement!;
		const oldoverlay = parent.querySelector('._overlay') as HTMLDivElement;
		if (oldoverlay) oldoverlay.remove();
		parent.style.position = 'relative';
		const overlay = document.createElement('div');
		overlay.className = '_overlay';
		overlay.style = `position:absolute;left:${board.offsetLeft}px;top:${board.offsetTop}px;display:grid;`
			+ `grid-template-columns:repeat(24,30px);grid-template-rows:repeat(18,30px);border: 2px solid rgba(0,0,0,0);pointer-events:none;`
			;
		for (let i = 0; i < 24 * 18; ++i)
		{
			const cell = document.createElement('div');
			cell.style = `width:30px;height:30px;position:relative;`;
			overlay.appendChild(cell);
			this.cells.push(cell);
		}

		parent.appendChild(overlay);
	}
	clear()
	{
		this.cells.forEach(c => c.innerHTML = '');
	}

	setDot(pos: number, color: string)
	{
		const style = `position:absolute;width:0px;height:0px;left:1px;top:1px;border-radius:50%;border:2px solid ${color}`;
		const div = document.createElement('div');
		div.className = '_overlay_dot';
		div.style = style;
		this.cells[pos].querySelector('._overlay_dot')?.remove();
		this.cells[pos].appendChild(div);
	}
}