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
/*
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
});
*/