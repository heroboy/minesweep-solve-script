import MineSweepSolver from './MineSweepSolver';
import * as mop from './mop';
import * as liwu from './liwu';
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