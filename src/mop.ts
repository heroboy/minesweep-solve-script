
export function injectMop(onClickSolve: () => void)
{
	if (location.hostname.toLowerCase() !== 'mop.com') return false;
	const main = document.querySelector('.main-content') as HTMLDivElement;
	if (main)
	{
		main.style.flexDirection = 'column';
		const div = document.createElement('div');
		div.innerHTML = '<button>solve</button>';
		main.prepend(div);
		const button = div.querySelector('button') as HTMLButtonElement;
		button.addEventListener('click', () => onClickSolve());
	}
	return false;
}

export function getGame(): IGame | null
{
	const board = document.getElementById('board') as HTMLDivElement;
	if (!board) return null;
	//width and height
	const parseRepeat = (s: string): number =>
	{
		if (!s) return 0;
		const m = s.match(/repeat\(([0-9]+),.*\)/);
		if (m)
		{
			const i = parseInt(m[1]);
			if (i > 0) return i;
		}
		return 0;
	};

	const width = parseRepeat(board.style.gridTemplateColumns);
	const height = parseRepeat(board.style.gridTemplateRows);
	const cells = Array.from(board.querySelectorAll('.cell')) as HTMLDivElement[];
	if (!(cells.length === width * height))
	{
		console.warn(`not find board, cells.length=${cells.length}, width=${width}, height=${height}`);
		return null;
	}
	const result = Array.from({ length: width * height }, () => -1);
	for (let i = 0; i < cells.length; i++)
	{
		const cell = cells[i];
		if (cell.classList.contains('revealed'))
		{
			let text = cell.innerText.trim();
			if (text === '') result[i] = 0;
			else result[i] = parseInt(text);
			if (!(result[i] >= 0 && result[i] <= 8))
			{
				console.warn(`invalid cell value, cell=${cell.innerHTML}, value=${result[i]}`);
				return null;
			}
		}
	}
	return { width, height, cells: result };
}

export function renderUI(data: number[])
{
	const board = document.getElementById('board') as HTMLDivElement;
	if (!board) return;
	const cells = Array.from(board.querySelectorAll('.cell')) as HTMLDivElement[];
	const overlay = new Overlay(board);
	for (let i = 0; i < cells.length; i++)
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
	cells: HTMLDivElement[];
	constructor(board: HTMLDivElement)
	{
		this.cells = [];
		const p = board.parentElement!;
		p.style.position = 'relative';
		const oldoverlay = p.querySelector('._overlay');
		oldoverlay?.remove();

		const length = board.querySelectorAll('.cell').length;
		const overlay = document.createElement('div');
		overlay.className = '_overlay';
		overlay.style = `position:absolute;border:3px solid rgba(0,0,0,0);left:${board.offsetLeft}px;top:${board.offsetTop}px;box-sizing: border-box;gap:1px;`
			+ `display:grid;grid-template-columns:${board.style.gridTemplateColumns};grid-template-rows:${board.style.gridTemplateRows};`
			+ `pointer-events:none;`;
		for (let i = 0; i < length; ++i)
		{
			let cc = document.createElement('div');
			cc.style = `width:20px;height:20px;position:relative`;
			overlay.appendChild(cc);
			this.cells.push(cc);
		}
		p.appendChild(overlay);
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