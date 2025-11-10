import Logic, { type Solution } from 'logic-solver-plus';
const solver = new Logic.Solver();
await solver.initialize();

//solver.require(Logic.sum('a', 'b', 'c', 'd'));

solver.require(Logic.equalBits(Logic.sum('a', 'b', 'c', 'd'), Logic.constantBits(2)));

for (const sol of solveAll(solver))
{
	console.log(sol.getTrueVars());
}

function solveAll(s: Logic.Solver)
{
	let ret: Solution[] = [];
	while (true)
	{
		const sol = s.solveAssuming('-a');
		if (!sol) break;
		ret.push(sol);
		s.forbid(sol.getFormula());
	}
	return ret;
}