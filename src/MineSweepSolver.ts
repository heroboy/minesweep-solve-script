import Logic from 'logic-solver-plus';

export default class MineSweepSolver
{
	width: number;
	height: number;
	cells: number[];
	constructor(game: IGame)
	{
		this.width = game.width;
		this.height = game.height;
		this.cells = game.cells.slice();
	}

	solveAB()
	{
		const result = Array.from({ length: this.width * this.height }, () => -1);
		const length = this.width * this.height;
		//flag, mark mine
		for (let i = 0; i < length; ++i)
		{
			if (this.cells[i] > 0)
			{
				const unknownPos: number[] = [];
				for (let next of this.adjancent8(i))
				{
					if (this.cells[next] === -1)
					{
						unknownPos.push(next);
					}
				}
				if (unknownPos.length === this.cells[i])
				{
					for (const next of unknownPos)
					{
						result[next] = 1;//mine
					}
				}
			}
		}
		//mark safe
		for (let i = 0; i < length; ++i)
		{
			if (this.cells[i] > 0)
			{
				const unknownPos: number[] = [];
				let flags = 0;
				for (let next of this.adjancent8(i))
				{
					if (result[next] === 1)
					{
						flags++;
					}
					else if (this.cells[next] === -1)
					{
						unknownPos.push(next);
					}
				}
				if (flags === this.cells[i])
				{
					for (let next of unknownPos)
					{
						result[next] = 0;
					}
				}
			}
		}
		return result;
	}

	computeNodeGroups(): NodeGroup[]
	{
		const ret: NodeGroup[] = [];
		const length = this.width * this.height;
		const processed: Record<number, Node> = Object.create(null);
		for (let i = 0; i < length; ++i)
		{
			if (processed[i]) continue;
			if (this.cells[i] <= 0) continue;
			const g = new NodeGroup();
			ret.push(g);
			const start = new Node(i, this.cells[i]);
			const stack: Node[] = [start];
			while (stack.length > 0)
			{
				const n = stack.pop()!;
				if (processed[n.pos]) continue;
				processed[n.pos] = n;

				if (n.isRevealed)
				{
					if (g.revealedNodes.indexOf(n) !== -1) throw new Error('assert error');
					g.revealedNodes.push(n);
					for (let next of this.adjancent8(n.pos))
					{
						if (this.cells[next] === -1)
						{
							let n2: Node;
							if (processed[next])
							{
								n2 = processed[next];
							}
							else
							{
								n2 = new Node(next, this.cells[next]);
								stack.push(n2);
							}
							n.adjacentNodes.push(n2);
						}
					}
				}
				else
				{
					if (g.unknownNodes.indexOf(n) !== -1) throw new Error('assert error');
					g.unknownNodes.push(n);
					for (let next of this.adjancent8(n.pos))
					{
						if (this.cells[next] > 0)
						{
							let n2: Node;
							if (processed[next])
							{
								n2 = processed[next];
							}
							else
							{
								n2 = new Node(next, this.cells[next]);
								stack.push(n2);
							}
							n.adjacentNodes.push(n2);
						}
					}
				}
			}
		}
		return ret;
	}

	private computeRulesFromGroup(g: NodeGroup)
	{
		const rules: Logic.Formula[] = [];
		const C: any[] = [];
		for (let i = 0; i <= 8; ++i)
		{
			C[i] = Logic.constantBits(i);
		}
		for (let i = 0; i < g.revealedNodes.length; ++i)
		{
			const n = g.revealedNodes[i];
			if (!(n.adjacentNodes.length >= n.value))
				throw new Error('assert failed.' + `node adjacent nodes:${n.adjacentNodes.length}, node value:${n.value}`);
			if (!(n.value >= 1 && n.value <= 8))
				throw new Error('assert failed.');
			rules.push(Logic.equalBits(Logic.sum(...n.adjacentNodes.map(x => x.name)), C[n.value]));
		}
		return rules;
	}

	async solve()
	{
		const length = this.width * this.height;
		const result: number[] = Array.from({ length }, () => -1);
		const groups = this.computeNodeGroups();
		for (const g of groups)
		{
			const solver = new Logic.Solver();
			await solver.initialize();
			solver.require(...this.computeRulesFromGroup(g));
			for (const node of g.unknownNodes)
			{
				if (result[node.pos] !== -1) continue;
				if (solver.solveAssuming(node.name) == null)
				{
					result[node.pos] = 0;
				}
				else if (solver.solveAssuming('-' + node.name) == null)
				{
					result[node.pos] = 1;
				}
			}
		}
		return result;
	}

	*adjancent8(pos: number)
	{
		const { width, height } = this;

		var x = pos % width;
		var y = (pos / width) | 0;
		//fast path
		if (x > 0 && x < width - 1 && y > 0 && y < height - 1)
		{
			yield pos - width - 1;
			yield pos - width;
			yield pos - width + 1;
			yield pos - 1;
			yield pos + 1;
			yield pos + width - 1;
			yield pos + width;
			yield pos + width + 1;

		}
		else
		{
			if (x > 0)
			{
				yield y * width + x - 1;
				if (y > 0)
					yield (y - 1) * width + x - 1;
				if (y < height - 1)
					yield (y + 1) * width + x - 1;
			}
			if (x < width - 1)
			{
				yield y * width + x + 1;
				if (y > 0)
					yield (y - 1) * width + x + 1;
				if (y < height - 1)
					yield (y + 1) * width + x + 1;
			}
			if (y > 0)
				yield (y - 1) * width + x;
			if (y < height - 1)
				yield (y + 1) * width + x;
		}
	}
}

class Node
{
	name: string;
	pos: number;
	value: number;
	//isRevealed?'未知节点':'已知节点'
	adjacentNodes: Node[] = [];
	constructor(pos: number, value: number)
	{
		this.pos = pos;
		this.value = value;
		this.name = Node.makeNodeName(pos);
	}

	get isRevealed()
	{
		return this.value >= 0;
	}

	static makeNodeName(pos: number)
	{
		return `Node` + pos;
	}
}

class NodeGroup
{
	unknownNodes: Node[] = [];
	revealedNodes: Node[] = [];
}