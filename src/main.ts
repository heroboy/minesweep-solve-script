import MineSweepSolver from './MineSweepSolver.js';
import * as mop from './mop.js';
import * as liwu from './liwu.js';
//import { GM_getResourceURL } from '$';
// const url = GM_getResourceURL('minisat_static.wasm');
// console.log('myurl=', url);
mop.injectMop(async () =>
{
	const game = mop.getGame();
	if (!game) 
	{
		console.warn('not find game');
		return;
	}
	console.log('game=', game);
	const solver = new MineSweepSolver(game);
	mop.renderUI(await solver.solve());
});

let KEEP = Math.random() * 1;
let g_SkipCount = 0;
if (KEEP)
{
	liwu.injectLiWu(async () =>
	{
		const game = liwu.getGame();
		if (!game) 
		{
			console.warn('not find game');
			return;
		}
		console.log('game=', game);
		const solver = new MineSweepSolver(game);
		liwu.renderUI(await solver.solve());

		//clicks

	}, async () =>
	{
		const game = liwu.getGame();
		if (!game) 
		{
			console.warn('not find game');
			return;
		}
		//console.log('game=', game);
		const solver = new MineSweepSolver(game);
		const solveResult = await solver.solve();
		liwu.renderUI(solveResult);
		const MAX_CLICK_COUNT = 99;
		let solveCount = 0;
		const cells = Array.from(document.querySelectorAll('#game-board .cell')) as HTMLElement[];
		if (cells.length !== solveResult.length)
		{
			console.error(`error,cells.length !== solveResult.length,cells.length =${cells.length}, solveResult.length =${solveResult.length}`);
		}
		const resultPos = solveResult.map((v, i) => v === 0 ? i : -1).filter(v => v >= 0);
		for (let i = 0; i < resultPos.length; ++i)
		{
			const pos = resultPos[(i + g_SkipCount) % resultPos.length];
			++solveCount;
			console.info('click element ', cells[pos].getAttribute('data-row'), cells[pos].getAttribute('data-col'));
			cells[pos].click();
			if (solveCount >= MAX_CLICK_COUNT) break;
		}
		g_SkipCount += solveCount;
	});

}
