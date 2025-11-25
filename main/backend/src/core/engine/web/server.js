// server.js
import { createServer } from 'http';
import {
  SERVER_PORT,
  APP_MODE,
  CORS_ORIGIN,
  COOKIE_SECURE_STATUS,
  SSL_STATUS,
} from '../../../shared/constants/index.js';
import { initWebSocket } from './websocket.js';

const redBox = (text) => `\x1b[41m\x1b[38;2;255;255;255m${text}\x1b[0m`;
const orangeBox = (text) => `\x1b[48;5;202m\x1b[38;2;255;255;255m${text}\x1b[0m`;

export async function startServer(app) {
  console.log(`\n  🚀 Initializing server on port: ${SERVER_PORT}...\n`);

  // server
  const server = createServer(app);

  // WebSocket
  await initWebSocket(server);

  const wsHost = SSL_STATUS
    ? CORS_ORIGIN.replace(/^https?:\/\//, '')
    : `127.0.0.1:${SERVER_PORT}`;

  await new Promise((resolve, reject) => {
    server.listen(SERVER_PORT, (error) =>
      error
        ? (console.error('❌ Server error -', error), reject(error))
        : (console.log(`\n  🔥 Server OK

  ${redBox(`   🔥 Roast 🔥   `)}

  Port: ${SERVER_PORT}
  Mode: ${orangeBox(` ${APP_MODE} `)}

  ${orangeBox(`   SSL   `)}
  HTTPS/WSS: ${SSL_STATUS}

  ${orangeBox(`   CORS   `)}
  Origin: ${CORS_ORIGIN}

  ${orangeBox(`   Cookie   `)}
  Secure: ${COOKIE_SECURE_STATUS}

  ${orangeBox(`   WebSocket   `)}
  Path: ${SSL_STATUS ? 'wss://' : 'ws://'}${wsHost}/ws
    `), resolve())
    );
  });
}