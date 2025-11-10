export default class IntSet
{
	data: boolean[];
	constructor(length: number)
	{
		this.data = Array.from({ length }, () => false);
	}

	add(i: number)
	{
		this.data[i] = true;
	}

	has(i: number)
	{
		return this.data[i] === true;
	}

	delete(i: number)
	{
		this.data[i] = false;
	}
	
	*[Symbol.iterator]()
	{
		for (let i = 0; i < this.data.length; ++i)
		{
			if (this.data[i]) yield i;
		}
	}
}