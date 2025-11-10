
let accessToken = localStorage.getItem('accessToken');

document.addEventListener('DOMContentLoaded', function ()
{
	// ===== 登录功能相关代码 =====
	const loginUrl = API.USER.LOGIN;
	const tokenUrl = API.USER.CHECK_TOKEN;
	const userInfoUrl = API.USER.GET_USER_INFO;
	const gameRecordsUrl = API.GAME.GAME_RECORDS;
	const gameCreateUrl = API.GAME.GAME_CREATE;
	const friendArticleHtml = 'saolei.html';
	const registerHtml = 'register.html';

	// 加密常量和函数
	const constant = {
		cryptojs_key: 'sarasarasarasara'
	};

	// 添加提示样式
	const style = document.createElement('style');
	style.textContent = `
            .hint-cell {
                animation: pulse 1.5s infinite;
                box-shadow: 0 0 5px #ffcc00;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
        `;
	document.head.appendChild(style);

	function encrypt(plaintText)
	{
		let options = {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		};
		let key = CryptoJS.enc.Utf8.parse(constant.cryptojs_key);
		let encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
		return encryptedData.toString().replace(/\//g, "_").replace(/\+/g, "-");
	}

	// 显示登录弹窗
	function showLoginModal()
	{
		document.getElementById('login-modal').style.display = 'block';
	}

	// 隐藏登录弹窗
	function hideLoginModal()
	{
		document.getElementById('login-modal').style.display = 'none';
		document.getElementById('username').value = '';
		document.getElementById('password').value = '';
		document.getElementById('login-error').textContent = '';
	}

	// 登录函数
	async function login()
	{
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		const rememberMe = document.getElementById('remember-me').checked;
		const errorElement = document.getElementById('login-error');

		if (!username || !password)
		{
			errorElement.textContent = '请输入账号和密码';
			return;
		}

		try
		{
			const encryptedPassword = encrypt(password);
			const queryString = `?account=${encodeURIComponent(username)}&password=${encodeURIComponent(encryptedPassword)}`;
			const fullUrl = loginUrl + queryString;

			const response = await fetch(fullUrl, { method: "POST" });

			if (!response.ok)
			{
				throw new Error("登录失败");
			}

			const result = await response.json();

			if (result.data && result.data.accessToken)
			{
				const accessToken = result.data.accessToken;
				localStorage.setItem("accessToken", accessToken);

				// 如果选择了"记住我"，可以存储用户名
				if (rememberMe)
				{
					localStorage.setItem("rememberedUsername", username);
				} else
				{
					localStorage.removeItem("rememberedUsername");
				}

				// 更新UI显示已登录状态
				updateLoginStatus({ username });

				// 隐藏登录弹窗
				hideLoginModal();
			} else
			{
				errorElement.textContent = "登录失败，请检查账号和密码";
			}
		} catch (error)
		{
			errorElement.textContent = "登录失败，请重试";
			console.error("登录错误:", error);
		}
	}

	// 检查token是否过期
	function isTokenExpired()
	{
		const timestamp = localStorage.getItem("tokenTimestamp");
		if (!timestamp) return true;

		// 假设token有效期为24小时
		const tokenAge = Date.now() - parseInt(timestamp);
		return tokenAge > 24 * 60 * 60 * 1000; // 24小时
	}

	// 清除用户token相关信息
	function clearUserToken()
	{
		localStorage.removeItem("accessToken");
		localStorage.removeItem("tokenTimestamp");
		localStorage.removeItem("userInfo");
	}

	// 更新登录状态UI
	function updateLoginStatus(userInfo)
	{
		const loginContainer = document.getElementById('login-container');
		const userContainer = document.getElementById('user-container');

		if (userInfo)
		{
			// 已登录状态
			loginContainer.style.display = 'none';
			userContainer.style.display = 'flex';

			// 显示用户名
			const username = userInfo.username || userInfo.account || "用户";
			document.getElementById('user-name').textContent = username;

			// 显示用户头像
			const userAvatar = document.getElementById('user-avatar');
			if (userInfo.avatar)
			{
				userAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
			} else
			{
				// 使用默认头像或首字母作为头像
				userAvatar.textContent = username.charAt(0).toUpperCase();
				userAvatar.style.backgroundColor = getRandomColor(username);
			}
		} else
		{
			// 未登录状态
			loginContainer.style.display = 'flex';
			userContainer.style.display = 'none';
		}
	}

	// 生成基于用户名的随机颜色（保持一致性）
	function getRandomColor(username)
	{
		let hash = 0;
		for (let i = 0; i < username.length; i++)
		{
			hash = username.charCodeAt(i) + ((hash << 5) - hash);
		}

		const hue = hash % 360;
		return `hsl(${hue}, 70%, 60%)`;
	}

	// 检查登录状态
	async function checkLoginStatus()
	{
		const token = localStorage.getItem("accessToken");
		// 如果没有token，直接视为未登录
		if (!token)
		{
			clearUserToken();
			updateLoginStatus(null);
			return;
		}


		// 先尝试使用缓存的用户信息快速显示
		try
		{
			const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
			if (cachedUserInfo)
			{
				// 先用缓存数据更新UI，提高用户体验
				updateLoginStatus(cachedUserInfo);
			}
		} catch (e)
		{
			console.error("解析缓存用户信息失败:", e);
		}

		try
		{
			const response = await fetch(userInfoUrl, {
				method: 'GET',
				headers: {
					'Authorization': token
				}
			});

			const result = await response.json();
			if (result.code === 200 && result.data)
			{
				// 保存用户信息
				const userInfo = result.data;
				localStorage.setItem("userInfo", JSON.stringify(userInfo));
				localStorage.setItem("tokenTimestamp", Date.now().toString());

				// 更新UI显示已登录状态
				updateLoginStatus(userInfo);
			} else
			{
				// Token无效，清除存储
				clearUserToken();
				updateLoginStatus(null);
			}
		} catch (error)
		{
			console.error("检查登录状态错误:", error);

			// 网络错误时，如果有token，尝试使用缓存的用户信息
			if (token)
			{
				try
				{
					const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
					if (cachedUserInfo)
					{
						updateLoginStatus(cachedUserInfo);
					} else
					{
						// 没有缓存的用户信息，使用记住的用户名
						const username = localStorage.getItem("rememberedUsername");
						if (username)
						{
							updateLoginStatus({ username });
						} else
						{
							updateLoginStatus(null);
						}
					}
				} catch (e)
				{
					// 解析缓存用户信息失败
					const username = localStorage.getItem("rememberedUsername");
					if (username)
					{
						updateLoginStatus({ username });
					} else
					{
						updateLoginStatus(null);
					}
				}
			} else
			{
				updateLoginStatus(null);
			}
		}
	}

	// 登出函数
	function logout()
	{
		clearUserToken();
		localStorage.removeItem("rememberedUsername");
		updateLoginStatus(null);
	}

	// 添加事件监听器
	document.getElementById('login-btn').addEventListener('click', showLoginModal);
	document.getElementById('cancel-login-btn').addEventListener('click', hideLoginModal);
	document.getElementById('login-submit-btn').addEventListener('click', login);
	document.getElementById('logout-btn').addEventListener('click', logout);
	document.getElementById('register-redirect-btn').addEventListener('click', function ()
	{
		window.location.href = registerHtml;
	});
	document.getElementById('forgot-password-link').addEventListener('click', function ()
	{
		alert("忘记密码功能暂未实现");
	});

	// 页面加载时检查登录状态
	checkLoginStatus();




	// 游戏配置
	const config = {
		beginner: { rows: 9, cols: 9, mines: 10 },
		intermediate: { rows: 16, cols: 16, mines: 40 },
		expert: { rows: 16, cols: 30, mines: 99 },
		custom: { rows: 30, cols: 30, mines: 150 }, // 添加自定义配置
		current: 'intermediate' // 默认难度
	};

	let gameState = {
		board: [],
		minesLeft: 0,
		timer: 0,
		timerInterval: null,
		gameOver: false,
		firstClick: true,
		clicks: 0, // 新增：记录左键点击次数
		startTime: 0 // 新增：记录游戏开始时间
	};

	// 在initGame中添加
	function initGame()
	{
		const { rows, cols, mines } = config[config.current];
		gameState.board = createBoard(rows, cols);
		gameState.minesLeft = mines;
		gameState.timer = 0;
		gameState.gameOver = false;
		gameState.firstClick = true;
		gameState.clicks = 0; // 重置点击次数
		gameState.startTime = 0; // 重置开始时间

		updateMineCounter();
		updateTimer();
		renderBoard();

		document.getElementById('face-button').textContent = '😊';
		document.getElementById('result-modal').style.display = 'none'; // 隐藏结果弹窗

	}

	// 添加新函数：显示开局提示
	function showStartingHint()
	{
		// 只有在第一次点击前显示提示
		if (!gameState.firstClick) return;

		const { rows, cols } = config[config.current];

		// 随机选择一个安全的起始点击位置
		// 避免边缘位置，从中间区域随机选择
		const marginSize = Math.min(3, Math.floor(rows / 4), Math.floor(cols / 4)); // 边缘安全距离
		const recommendedRow = marginSize + Math.floor(Math.random() * (rows - 2 * marginSize));
		const recommendedCol = marginSize + Math.floor(Math.random() * (cols - 2 * marginSize));

		// 获取推荐单元格
		const cells = document.querySelectorAll('.cell');
		const cellIndex = recommendedRow * cols + recommendedCol;
		const recommendedCell = cells[cellIndex];

		if (recommendedCell)
		{
			// 添加提示样式
			recommendedCell.classList.add('hint-cell');

			// 添加点击标记到单元格内部
			const clickMark = document.createElement('div');
			clickMark.className = 'click-mark';
			clickMark.innerHTML = '👆'; // 使用手指表情符号作为点击标记
			clickMark.style.position = 'absolute';
			clickMark.style.top = '50%';
			clickMark.style.left = '50%';
			clickMark.style.transform = 'translate(-50%, -50%)';
			clickMark.style.fontSize = '12px';
			clickMark.style.zIndex = '10';
			clickMark.style.animation = 'pulse 1.5s infinite';

			// 将点击标记添加到单元格
			recommendedCell.style.position = 'relative';
			recommendedCell.appendChild(clickMark);

			// 5秒后自动移除提示
			setTimeout(() =>
			{
				recommendedCell.classList.remove('hint-cell');
				if (clickMark.parentNode)
				{
					clickMark.parentNode.removeChild(clickMark);
				}
			}, 5000);
		}
	}

	// 创建游戏板
	function createBoard(rows, cols)
	{
		const board = [];
		for (let i = 0; i < rows; i++)
		{
			const row = [];
			for (let j = 0; j < cols; j++)
			{
				row.push({
					isMine: false,
					isRevealed: false,
					isFlagged: false,
					adjacentMines: 0
				});
			}
			board.push(row);
		}
		return board;
	}

	// 放置地雷
	function placeMines(board, rows, cols, mines, firstRow, firstCol)
	{
		let minesPlaced = 0;
		while (minesPlaced < mines)
		{
			const row = Math.floor(Math.random() * rows);
			const col = Math.floor(Math.random() * cols);

			// 确保第一次点击的位置及其周围没有地雷
			if (!board[row][col].isMine &&
				(Math.abs(row - firstRow) > 1 || Math.abs(col - firstCol) > 1))
			{
				board[row][col].isMine = true;
				minesPlaced++;
			}
		}

		// 计算每个格子周围的地雷数
		for (let i = 0; i < rows; i++)
		{
			for (let j = 0; j < cols; j++)
			{
				if (!board[i][j].isMine)
				{
					board[i][j].adjacentMines = countAdjacentMines(board, i, j, rows, cols);
				}
			}
		}
	}

	// 计算周围地雷数
	function countAdjacentMines(board, row, col, rows, cols)
	{
		let count = 0;
		for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++)
		{
			for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++)
			{
				if (board[i][j].isMine)
				{
					count++;
				}
			}
		}
		return count;
	}

	// 修改 renderBoard 函数，移除固定位置的提示
	function renderBoard()
	{
		const boardElement = document.getElementById('board');
		boardElement.innerHTML = '';

		const { rows, cols } = config[config.current];
		boardElement.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
		boardElement.style.gridTemplateRows = `repeat(${rows}, 20px)`;

		for (let i = 0; i < rows; i++)
		{
			for (let j = 0; j < cols; j++)
			{
				const cell = document.createElement('div');
				cell.className = 'cell';
				cell.dataset.row = i;
				cell.dataset.col = j;

				const cellData = gameState.board[i][j];

				if (cellData.isRevealed)
				{
					cell.classList.add('revealed');
					if (cellData.isMine)
					{
						cell.classList.add('mine');
					} else if (cellData.adjacentMines > 0)
					{
						cell.textContent = cellData.adjacentMines;
						cell.dataset.value = cellData.adjacentMines;
					}
				} else if (cellData.isFlagged)
				{
					cell.classList.add('flagged');
				}

				// 移除固定位置的提示
				// 不再在这里添加hint-cell类，而是在showStartingHint中随机添加

				cell.addEventListener('click', handleCellClick);
				cell.addEventListener('contextmenu', handleCellRightClick);

				boardElement.appendChild(cell);
			}
		}

		// 如果是第一次点击，显示随机位置的提示
		if (gameState.firstClick)
		{
			showStartingHint();
		}
	}


	// 处理单元格点击
	function handleCellClick(event)
	{
		if (gameState.gameOver) return;

		const row = parseInt(event.target.dataset.row);
		const col = parseInt(event.target.dataset.col);
		const cell = gameState.board[row][col];

		if (cell.isFlagged) return;

		// 如果点击的是已经打开的数字格子
		if (cell.isRevealed && !cell.isMine && cell.adjacentMines > 0)
		{
			// 检查周围已标记的雷数是否等于该数字
			const flaggedCount = countFlaggedAdjacent(row, col);
			if (flaggedCount === cell.adjacentMines)
			{
				// 自动打开周围未打开且未标记的格子
				const hitMine = revealAdjacentUnflagged(row, col);
				if (!hitMine)
				{ // 只有在没踩到地雷的情况下才继续
					renderBoard();
					checkWin();
				}
				return;
			}
		}

		if (cell.isRevealed) return;

		gameState.clicks++; // 记录点击次数

		// 移除所有提示元素
		document.querySelectorAll('.hint-cell').forEach(el => el.classList.remove('hint-cell'));
		document.querySelectorAll('.click-mark').forEach(el =>
		{
			if (el.parentNode)
			{
				el.parentNode.removeChild(el);
			}
		});

		if (gameState.firstClick)
		{
			gameState.firstClick = false;
			const { rows, cols, mines } = config[config.current];
			placeMines(gameState.board, rows, cols, mines, row, col);
			gameState.startTime = Date.now(); // 记录开始时间
			startTimer();
		}

		if (cell.isMine)
		{
			// 游戏结束，踩到地雷
			revealAllMines();
			endGame(false);
			return;
		}

		revealCell(row, col);

		// 检查是否胜利
		checkWin();

		renderBoard();
	}

	// 计算周围已标记的雷数
	function countFlaggedAdjacent(row, col)
	{
		let flaggedCount = 0;
		const { rows, cols } = config[config.current];

		// 遍历周围的8个格子
		for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++)
		{
			for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++)
			{
				// 跳过自身
				if (r === row && c === col) continue;

				const adjacentCell = gameState.board[r][c];
				if (adjacentCell.isFlagged)
				{
					flaggedCount++;
				}
			}
		}

		return flaggedCount;
	}

	// 打开周围未打开且未标记的格子
	function revealAdjacentUnflagged(row, col)
	{
		const { rows, cols } = config[config.current];
		let hitMine = false; // 添加变量跟踪是否踩到地雷

		// 遍历周围的8个格子
		for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++)
		{
			for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++)
			{
				// 跳过自身
				if (r === row && c === col) continue;

				const adjacentCell = gameState.board[r][c];
				// 如果格子未打开且未标记，则打开它
				if (!adjacentCell.isRevealed && !adjacentCell.isFlagged)
				{
					// 检查是否是地雷
					if (adjacentCell.isMine)
					{
						hitMine = true; // 标记踩到地雷
						adjacentCell.isRevealed = true; // 显示这个地雷
					} else
					{
						revealCell(r, c);
					}
				}
			}
		}

		// 如果踩到地雷，结束游戏
		if (hitMine)
		{
			revealAllMines();
			endGame(false);
			return true; // 返回true表示踩到地雷
		}

		return false; // 返回false表示没踩到地雷
	}



	// 处理右键点击（插旗）
	function handleCellRightClick(event)
	{
		event.preventDefault();
		if (gameState.gameOver) return;

		const row = parseInt(event.target.dataset.row);
		const col = parseInt(event.target.dataset.col);
		const cell = gameState.board[row][col];

		if (cell.isRevealed) return;

		if (cell.isFlagged)
		{
			cell.isFlagged = false;
			gameState.minesLeft++;
		} else
		{
			cell.isFlagged = true;
			gameState.minesLeft--;
		}

		updateMineCounter();
		renderBoard();
	}

	// 揭示单元格
	function revealCell(row, col)
	{
		const { rows, cols } = config[config.current];
		const cell = gameState.board[row][col];

		if (cell.isRevealed || cell.isFlagged) return;

		cell.isRevealed = true;

		if (cell.adjacentMines === 0)
		{
			// 如果周围没有地雷，自动揭示周围的格子
			for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++)
			{
				for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++)
				{
					if (i !== row || j !== col)
					{
						revealCell(i, j);
					}
				}
			}
		}
	}

	// 揭示所有地雷
	function revealAllMines()
	{
		const { rows, cols } = config[config.current];
		for (let i = 0; i < rows; i++)
		{
			for (let j = 0; j < cols; j++)
			{
				if (gameState.board[i][j].isMine)
				{
					gameState.board[i][j].isRevealed = true;
				}
			}
		}
		renderBoard();
	}

	// 检查是否胜利
	function checkWin()
	{
		const { rows, cols, mines } = config[config.current];
		let revealedCount = 0;

		for (let i = 0; i < rows; i++)
		{
			for (let j = 0; j < cols; j++)
			{
				if (gameState.board[i][j].isRevealed && !gameState.board[i][j].isMine)
				{
					revealedCount++;
				}
			}
		}

		if (revealedCount === (rows * cols - mines))
		{
			endGame(true);
		}
	}

	// 结束游戏
	// 修改endGame函数
	function endGame(isWin)
	{
		gameState.gameOver = true;
		clearInterval(gameState.timerInterval);

		const faceButton = document.getElementById('face-button');
		faceButton.textContent = isWin ? '😎' : '😵';

		// 计算并显示统计信息
		showGameStats(isWin);
	}


	// 修改 showGameStats 函数，添加数据提交功能
	function showGameStats(isWin)
	{
		const modal = document.getElementById('result-modal');
		const timeElapsed = (Date.now() - gameState.startTime) / 1000;
		const bv3 = gameState.clicks;
		const bv3PerSec = timeElapsed > 0 ? (bv3 / timeElapsed).toFixed(2) : 0;

		modal.querySelector('h2').textContent = isWin ? '胜利!' : '游戏结束!';
		modal.querySelector('.result-time').textContent = timeElapsed.toFixed(2);
		modal.querySelector('.result-bv3').textContent = bv3;
		modal.querySelector('.result-bv3s').textContent = bv3PerSec;

		modal.style.display = 'block';
		submitGameSuccessAndFalse(isWin);
		// 如果游戏胜利，提交游戏数据
		if (isWin)
		{
			submitGameData(timeElapsed, bv3, bv3PerSec);
		}
	}

	// 新增函数：提交游戏数据到API
	async function submitGameSuccessAndFalse(isWin)
	{
		// 检查用户是否已登录
		const token = localStorage.getItem("accessToken");
		if (!token)
		{
			console.log("用户未登录，不记录游戏结果");
			return;
		}

		try
		{
			// 获取当前难度级别
			let level;
			switch (config.current)
			{
				case 'beginner':
					level = "初级";
					break;
				case 'intermediate':
					level = "中级";
					break;
				case 'expert':
					level = "高级";
					break;
				case 'custom':
					level = "自定义";
					break;
				default:
					level = "中级";
			}

			// 准备请求数据
			const gameData = {
				gameType: "无猜模式",
				level: level,
				result: isWin ? 1 : 0
			};

			// 发送请求到API
			const response = await fetch(gameRecordsUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${token}`
				},
				body: JSON.stringify(gameData)
			});

			const result = await response.json();

			if (result.success)
			{
				console.log("游戏结果记录成功");
			} else
			{
				console.error("游戏结果记录失败:", result);
			}
		} catch (error)
		{
			console.error("提交游戏数据时出错:", error);
		}
	}

	// 新增函数：提交游戏数据到API
	async function submitGameData(gameTime, bv3, bv3PerSec)
	{
		// 检查用户是否已登录
		const token = localStorage.getItem("accessToken");
		if (!token)
		{
			console.log("用户未登录，不提交游戏数据");
			return;
		}

		try
		{
			// 获取当前游戏难度和雷数
			const difficulty = config.current;
			const { mines } = config[config.current];

			// 准备提交的数据
			const gameData = {
				gameType: "无猜模式",
				level: difficulty,
				mines: mines,
				bv3: bv3,
				bv3PerSec: bv3PerSec,
				gameTime: gameTime.toFixed(2)
			};

			// 发送数据到API
			const response = await fetch(gameCreateUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${token}`
				},
				body: JSON.stringify(gameData)
			});

			if (!response.ok)
			{
				throw new Error('提交游戏数据失败');
			}

			const result = await response.json();
			console.log('游戏数据提交成功:', result);

			// 可以在这里添加提交成功的提示
			const modal = document.getElementById('result-modal');
			const statsDiv = modal.querySelector('.result-stats');

			// 检查是否已经有提交成功的消息
			if (!modal.querySelector('.submit-success'))
			{
				const successMsg = document.createElement('div');
				successMsg.className = 'submit-success';
				successMsg.textContent = '游戏数据已成功提交!';
				successMsg.style.color = 'green';
				successMsg.style.marginTop = '10px';
				statsDiv.appendChild(successMsg);
			}

		} catch (error)
		{
			console.error('提交游戏数据错误:', error);

			// 可以在这里添加提交失败的提示
			const modal = document.getElementById('result-modal');
			const statsDiv = modal.querySelector('.result-stats');

			// 检查是否已经有提交失败的消息
			if (!modal.querySelector('.submit-error'))
			{
				const errorMsg = document.createElement('div');
				errorMsg.className = 'submit-error';
				errorMsg.textContent = '游戏数据提交失败，请稍后再试!';
				errorMsg.style.color = 'red';
				errorMsg.style.marginTop = '10px';
				statsDiv.appendChild(errorMsg);
			}
		}
	}


	// 开始计时器
	function startTimer()
	{
		clearInterval(gameState.timerInterval);
		gameState.timer = 0;
		updateTimer();

		gameState.timerInterval = setInterval(() =>
		{
			gameState.timer++;
			updateTimer();
			if (gameState.timer >= 999)
			{
				clearInterval(gameState.timerInterval);
			}
		}, 1000);
	}

	// 更新计时器显示
	function updateTimer()
	{
		const timerElement = document.getElementById('timer');
		timerElement.textContent = gameState.timer.toString().padStart(3, '0');
	}

	// 更新地雷计数器
	function updateMineCounter()
	{
		const counterElement = document.getElementById('mine-counter');
		counterElement.textContent = gameState.minesLeft.toString().padStart(3, '0');
	}

	// 重置游戏
	document.getElementById('face-button').addEventListener('click', function ()
	{
		clearInterval(gameState.timerInterval);
		initGame();
	});

	// 难度选择
	const difficultyTabs = document.querySelectorAll('.difficulty-tab');
	const customSettings = document.getElementById('custom-settings');

	difficultyTabs.forEach(tab =>
	{
		tab.addEventListener('click', function ()
		{
			difficultyTabs.forEach(t => t.classList.remove('active'));
			this.classList.add('active');

			if (this.textContent === '初级')
			{
				config.current = 'beginner';
			} else if (this.textContent === '中级')
			{
				config.current = 'intermediate';
			} else if (this.textContent === '高级')
			{
				config.current = 'expert';
			} else if (this.textContent === '自定义')
			{
				// 显示自定义设置区域
				customSettings.style.display = 'flex';

				// 设置输入框的默认值
				document.getElementById('custom-width').value = config.custom.cols;
				document.getElementById('custom-height').value = config.custom.rows;
				document.getElementById('custom-mines').value = config.custom.mines;

				config.current = 'custom';
			}
			clearInterval(gameState.timerInterval);
			initGame();
		});
	});

	// 添加刷新按钮事件
	document.getElementById('refresh-btn').addEventListener('click', function ()
	{
		// 获取自定义设置的值
		const width = parseInt(document.getElementById('custom-width').value);
		const height = parseInt(document.getElementById('custom-height').value);
		const mines = parseInt(document.getElementById('custom-mines').value);

		// 验证输入值
		if (width < 5 || width > 50)
		{
			alert('宽度必须在5到50之间');
			return;
		}
		if (height < 5 || height > 50)
		{
			alert('高度必须在5到50之间');
			return;
		}

		// 计算最大雷数（不超过格子总数的1/3）
		const maxMines = Math.floor(width * height / 3);
		if (mines < 1 || mines > maxMines)
		{
			alert(`雷数必须在1到${maxMines}之间`);
			return;
		}

		// 更新自定义配置
		config.custom.cols = width;
		config.custom.rows = height;
		config.custom.mines = mines;

		// 重新初始化游戏
		clearInterval(gameState.timerInterval);
		initGame();
	});

	// 添加刷新按钮事件
	const refreshBtn = document.getElementById('refresh-btn');
	if (refreshBtn)
	{
		refreshBtn.addEventListener('click', function ()
		{
			// 获取自定义设置的值
			const width = parseInt(document.getElementById('custom-width').value);
			const height = parseInt(document.getElementById('custom-height').value);
			const mines = parseInt(document.getElementById('custom-mines').value);

			// 验证输入值
			if (width < 5 || width > 50)
			{
				alert('宽度必须在5到50之间');
				return;
			}
			// ... 其余代码保持不变 ...
		});
	} else
	{
		console.error('未找到ID为refresh-btn的元素');
	}


	// 初始化游戏
	initGame();

	// 添加结果弹窗HTML
	const modalHTML = `
    <div id="result-modal" class="result-modal">
        <h2></h2>
        <div class="result-stats">
            <div>
                <span>3BV:</span>
                <span class="result-bv3">0</span>
            </div>
            <div>
                <span>3BV/s:</span>
                <span class="result-bv3s">0</span>
            </div>
            <div>
                <span>Time (s):</span>
                <span class="result-time">0</span>
            </div>
        </div>
        <button class="close-modal">确定</button>
    </div>
    `;
	document.body.insertAdjacentHTML('beforeend', modalHTML);

	// 关闭弹窗事件
	document.querySelector('.close-modal').addEventListener('click', function ()
	{
		document.getElementById('result-modal').style.display = 'none';
	});


});


/**
 * 无猜扫雷功能
 * 实现两个主要特性：
 * 1. 点开必然会打开一大块区域，不会出现需要靠盲猜的情况
 * 2. 开局强制固定开局点，只能通过点选指定位置进行开局
 */

class NoGuessMinesweeper
{
	constructor(gameBoard)
	{
		this.gameBoard = gameBoard;
		this.width = gameBoard.width;
		this.height = gameBoard.height;
		this.totalMines = gameBoard.totalMines;
		this.grid = null;
		this.isFirstClick = true;
		this.safeStartingPoints = [];
		this.bestStartingPoint = null; // 最佳开局点
		this.startingPointsShown = false; // 跟踪是否已显示开局点
	}


	/**
	 * 高亮显示安全开局点
	 */
	highlightSafeStartingPoints()
	{
		// 获取所有单元格
		const cells = document.querySelectorAll('.cell');

		// 使用 this.gameBoard 的宽度和高度
		const cols = this.width;

		// 高亮显示安全开局点
		this.safeStartingPoints.forEach(point =>
		{
			// 修正索引计算，使用行列索引
			const index = point.y * cols + point.x;
			if (cells[index])
			{
				cells[index].classList.add('safe-start');
				cells[index].setAttribute('data-tooltip', '安全开局点');
			}
		});

		// 特别高亮显示最佳开局点
		if (this.bestStartingPoint)
		{
			const bestIndex = this.bestStartingPoint.y * cols + this.bestStartingPoint.x;
			if (cells[bestIndex])
			{
				cells[bestIndex].classList.add('best-start');
				cells[bestIndex].setAttribute('data-tooltip', '最佳开局点 - 点击这里可以打开大片区域');

				// 添加闪烁效果
				this.addPulseEffect(cells[bestIndex]);
			}
		}
	}

	/**
	 * 添加脉冲效果到最佳开局点
	 */
	addPulseEffect(cell)
	{
		// 添加一个指示箭头元素
		const arrow = document.createElement('div');
		arrow.className = 'start-arrow';
		arrow.textContent = '👇';
		arrow.style.position = 'absolute';
		arrow.style.top = '-25px';
		arrow.style.left = '50%';
		arrow.style.transform = 'translateX(-50%)';
		arrow.style.fontSize = '20px';
		arrow.style.animation = 'bounce 1s infinite';

		// 确保单元格有相对定位
		cell.style.position = 'relative';

		// 添加箭头到单元格
		cell.appendChild(arrow);
	}

	/**
	 * 计算安全的开局点位置
	 */
	calculateSafeStartingPoints()
	{
		// 默认将中心区域作为安全开局点
		const centerX = Math.floor(this.width / 2);
		const centerY = Math.floor(this.height / 2);

		// 在中心区域周围添加几个安全点
		this.safeStartingPoints = [
			{ x: centerX, y: centerY },
			{ x: centerX - 1, y: centerY },
			{ x: centerX + 1, y: centerY },
			{ x: centerX, y: centerY - 1 },
			{ x: centerX, y: centerY + 1 },
			// 添加更多的安全点，增加角落和边缘的点
			{ x: 1, y: 1 },
			{ x: this.width - 2, y: 1 },
			{ x: 1, y: this.height - 2 },
			{ x: this.width - 2, y: this.height - 2 }
		];

		// 过滤掉超出边界的点
		this.safeStartingPoints = this.safeStartingPoints.filter(point =>
			point.x >= 0 && point.x < this.width &&
			point.y >= 0 && point.y < this.height
		);
	}

	/**
	 * 选择最佳开局点
	 * 最佳开局点通常是中心点，因为它能提供最大的安全区域
	 */
	selectBestStartingPoint()
	{
		alert('selectBestStartingPoint');
		// 默认选择中心点作为最佳开局点
		const centerX = Math.floor(this.width / 2);
		const centerY = Math.floor(this.height / 2);
		this.bestStartingPoint = { x: centerX, y: centerY };

		// 根据不同难度调整最佳开局点
		const { current } = this.gameBoard.config || { current: 'intermediate' };

		if (current === 'beginner')
		{
			// 初级难度，选择左上角附近的点
			this.bestStartingPoint = { x: 1, y: 1 };
		} else if (current === 'expert')
		{
			// 高级难度，选择靠近中心但偏左上的点
			this.bestStartingPoint = { x: Math.floor(this.width / 3), y: Math.floor(this.height / 3) };
		}
	}

	/**
	 * 拦截原始的点击事件
	 */
	interceptClickEvents()
	{
		const board = document.getElementById('board');

		// 移除原有的点击事件
		board.onclick = null;

		// 添加新的点击事件处理
		board.addEventListener('click', (event) =>
		{
			const cell = event.target.closest('.cell');
			if (!cell) return;

			const x = parseInt(cell.dataset.row);
			const y = parseInt(cell.dataset.col);

			// 如果是第一次点击但还没显示安全点，先显示它们
			if (this.isFirstClick && !this.startingPointsShown)
			{
				this.highlightSafeStartingPoints();
				this.startingPointsShown = true;
				return;
			}

			// 如果是第一次点击
			if (this.isFirstClick)
			{
				// 检查是否点击了安全开局点
				const isSafeStart = this.safeStartingPoints.some(point =>
					point.x === x && point.y === y
				);

				if (!isSafeStart)
				{
					// 如果不是安全开局点，阻止点击并提示用户
					event.preventDefault();
					event.stopPropagation();

					// 提示用户点击最佳开局点
					if (this.bestStartingPoint)
					{
						// 使用更友好的提示方式
						this.showFriendlyHint();
					} else
					{
						alert('请点击高亮的安全开局点开始游戏！');
					}
					return;
				}

				// 是安全开局点，生成无猜的雷区
				this.generateNoGuessMineField(x, y);
				this.isFirstClick = false;

				// 移除开局提示
				const hintElement = document.getElementById('starting-hint');
				if (hintElement)
				{
					hintElement.style.animation = 'fadeOut 0.5s';
					setTimeout(() =>
					{
						hintElement.remove();
					}, 500);
				}

				// 移除所有安全开局点的高亮
				document.querySelectorAll('.safe-start, .best-start').forEach(cell =>
				{
					cell.classList.remove('safe-start', 'best-start');
					cell.removeAttribute('data-tooltip');

					// 移除可能添加的箭头
					const arrow = cell.querySelector('.start-arrow');
					if (arrow)
					{
						arrow.remove();
					}
				});
			}

			// 调用原始的点击处理函数
			if (typeof this.gameBoard.handleCellClick === 'function')
			{
				this.gameBoard.handleCellClick(x, y);
			}
		});
	}

	/**
	 * 显示友好的提示
	 */
	showFriendlyHint()
	{
		// 创建一个友好的提示框
		const hintBox = document.createElement('div');
		hintBox.className = 'friendly-hint';
		hintBox.style.position = 'fixed';
		hintBox.style.top = '50%';
		hintBox.style.left = '50%';
		hintBox.style.transform = 'translate(-50%, -50%)';
		hintBox.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
		hintBox.style.padding = '20px';
		hintBox.style.borderRadius = '8px';
		hintBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
		hintBox.style.zIndex = '1000';
		hintBox.style.maxWidth = '300px';
		hintBox.style.textAlign = 'center';

		hintBox.innerHTML = `
            <h3 style="margin-top: 0; color: #4a6fa5;">开局提示</h3>
            <p>请点击绿色闪烁的格子开始游戏，这样可以打开更大的安全区域！</p>
            <button id="hint-ok" style="background-color: #4a6fa5; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">知道了</button>
        `;

		document.body.appendChild(hintBox);

		// 点击按钮关闭提示
		document.getElementById('hint-ok').addEventListener('click', () =>
		{
			hintBox.remove();
		});
	}

	/**
	 * 生成无猜的雷区
	 * @param {number} startX - 开局点击的X坐标
	 * @param {number} startY - 开局点击的Y坐标
	 */
	generateNoGuessMineField(startX, startY)
	{
		// 获取游戏的网格数据
		this.grid = this.gameBoard.grid;

		// 确保开局点及其周围更大范围没有地雷
		const safeArea = this.getExpandedSafeArea(startX, startY);

		// 移除安全区域内的地雷
		let removedMines = 0;
		safeArea.forEach(point =>
		{
			const { x, y } = point;
			if (this.grid[y][x].isMine)
			{
				this.grid[y][x].isMine = false;
				removedMines++;
			}
		});

		// 在安全区域外重新放置移除的地雷
		if (removedMines > 0)
		{
			this.redistributeMines(safeArea, removedMines);
		}

		// 重新计算每个单元格周围的地雷数量
		this.recalculateMineCount();

		// 确保没有孤立的安全单元格（无猜原则）
		this.ensureNoGuessing();

		// 确保开局点周围有足够大的空白区域
		this.ensureLargeOpeningArea(startX, startY);

		// 添加开局动画效果
		this.addOpeningAnimation(startX, startY);
	}

	/**
	 * 添加开局动画效果
	 */
	addOpeningAnimation(startX, startY)
	{
		// 获取所有将要打开的单元格
		const cellsToReveal = this.findConnectedEmptyCells(startX, startY);

		// 按照距离排序，从近到远
		cellsToReveal.sort((a, b) =>
		{
			const distA = Math.abs(a.x - startX) + Math.abs(a.y - startY);
			const distB = Math.abs(b.x - startX) + Math.abs(b.y - startY);
			return distA - distB;
		});

		// 创建一个动画效果，逐个显示单元格
		const cells = document.querySelectorAll('.cell');
		const cols = this.width;

		// 添加一个波纹效果的样式
		const style = document.createElement('style');
		style.textContent = `
            @keyframes revealCell {
                0% { transform: scale(0.8); opacity: 0.5; }
                100% { transform: scale(1); opacity: 1; }
            }
            .cell.reveal-animation {
                animation: revealCell 0.3s ease-out forwards;
            }
        `;
		document.head.appendChild(style);
	}

	/**
	 * 查找与开局点相连的空白单元格
	 */
	findConnectedEmptyCells(startX, startY)
	{
		const result = [];
		const visited = {};
		const queue = [{ x: startX, y: startY }];

		while (queue.length > 0)
		{
			const { x, y } = queue.shift();
			const key = `${x},${y}`;

			if (visited[key]) continue;
			visited[key] = true;

			result.push({ x, y });

			// 如果是空白单元格，继续扩展
			if (this.grid[y][x].adjacentMines === 0)
			{
				for (let dy = -1; dy <= 1; dy++)
				{
					for (let dx = -1; dx <= 1; dx++)
					{
						const nx = x + dx;
						const ny = y + dy;

						if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && !this.grid[ny][nx].isMine)
						{
							queue.push({ x: nx, y: ny });
						}
					}
				}
			}
		}

		return result;
	}


}