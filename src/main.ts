import MineSweepSolver from './MineSweepSolver';
import * as mop from './mop';
import * as liwu from './liwu';
import { GM_getResourceURL } from '$';
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

let KEEP = Math.random() * 0;
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
		console.log('game=', game);
		const solver = new MineSweepSolver(game);
		const solveResult = await solver.solve();
		liwu.renderUI(solveResult);
		const MAX_CLICK_COUNT = 10;
		let solveCount = 0;
		const cells = Array.from(document.querySelectorAll('#game-board .cell')) as HTMLElement[];
		if (cells.length !== solveResult.length)
		{
			console.error(`error,cells.length !== solveResult.length,cells.length =${cells.length}, solveResult.length =${solveResult.length}`);
		}
		for (let i = 0; i < solveResult.length; ++i)
		{
			if (solveResult[i] === 0)
			{
				++solveCount;
				console.info('click element ', cells[i].getAttribute('data-row'), cells[i].getAttribute('data-col'));
				cells[i].click();
				if (solveCount >= MAX_CLICK_COUNT) break;
			}
		}
	});

}
