module.exports = {
	apps: [
		{
			name: "client",
			script: "server.js",
			cwd: "./vpn_cllient/",
			instances: 1,
			autorestart: true,
			watch: false,
			ignore_watch: ["node_modules", "uploads"],
			watch_options: {
				followSymlinks: false,
			},
			max_memory_restart: "1G",
			env: {
				NODE_ENV: "production",
				PORT: 4058,
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
