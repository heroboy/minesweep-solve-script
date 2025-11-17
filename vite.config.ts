import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import MagicString from 'magic-string';
// https://vitejs.dev/config/
export default defineConfig({
	logLevel: 'info',
	publicDir: 'public',
	plugins: [
		monkey({
			entry: 'src/main.ts',
			userscript: {
				version:"0.0.2",
				icon: 'https://vitejs.dev/logo.svg',
				namespace: 'npm/vite-plugin-monkey',
				match: [
					'https://mop.com/*',
					'https://www.253874.net/next/mine/indexdb.php'
				],
				resource: {
					'minisat_static.wasm': 'https://github.com/arfelious/logic-solver-plus/raw/refs/heads/main/mjs/minisat_static.wasm'
				}
			},
			build: {
				externalResource: {

				}
			},
		}),
		{
			name: 'vite-plugin-my-plugin',
			enforce: 'pre',
			config(_, env)
			{
				if (env.command === 'build')
				{
					return {
						publicDir: false,
						build: {
							assetsInlineLimit(filePath, content)
							{
								return false;
							},
						}
					};
				}
				else//serve
				{
					return {
						publicDir:'node_modules/logic-solver-plus/mjs'
					};
				}
			},
			transform(code, id, options)
			{
				if (this.environment.config.command === 'build')
				{
					const m = /new URL\(.+minisat_static\.wasm.+\)/.exec(code);
					if (m)
					{
						this.info('ok transform my wasm');
						const ms = new MagicString(code);
						ms.update(m.index!, m.index! + m[0].length, "new URL(GM_getResourceURL('minisat_static.wasm').replace('application','application/wasm'))");
						return { code: ms.toString(), map: ms.generateMap() };
					}
				}
				else//serve
				{
					const m = /new URL\(.+minisat_static\.wasm.+\)/.exec(code);
					if (m)
					{
						this.info('ok transform my wasm');
						const ms = new MagicString(code);
						ms.update(m.index!, m.index! + m[0].length, "new URL('/minisat_static.wasm',import.meta.url)");
						return { code: ms.toString(), map: ms.generateMap() };
					}
				}

			}
		},
	],
});
