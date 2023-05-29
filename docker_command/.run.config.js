module.exports = {
	apps: [
		{
			name: "api",
			script: "main.js",
			cwd: "./zvpn_web_service/dist/",
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
				JWT: "ca5QQsryHqFLYvnJDP8WnYKGQq2NWaGj9gyOFdN5i0laaz8agQGwd27GDBS4G5FrcPQ244m7g5v8OVnCwoUj2tsWjc4JGxXRRa1m",
				MYSQL_DATABASE_URL:
					"POSTGRES_DATABASE_URL=postgresql://zvpn:G1xKWfLXCPg8zKHji1LSK76pDVCdpzqGGStCtbwo7SQXlCN2tmwouIt412HUfTBU0sbJ4DFIizo5JyZbseQ337BiEp9hayjmaeK9@localhost:6500/zvpn_db?schema=public",
				PORT: 5055,
				ENCRYPTION_KEY: "PvTw4709MKBFHipbWZ3uTPYmF1Er269fbJ8pbO9ay1wbhzd7hnK55t5hWNQs6Piu40QEwgYfKttdggWDbwpUgLOZ8OOGJUyYFXE1",
				TELEGRAM_CHAT_ID: 334991,
				TELEGRAM_BOT_TOKEN: "5649844600:AAEGxlCX-f1e8aLZXkXvjq6DUpk5GBRy3QI",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},

		{
			name: "admin panel",
			script: "server.js",
			cwd: "./zvpn_web_service/admin_panel/",
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

				PORT: 5052,
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
