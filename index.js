require('events').EventEmitter.defaultMaxListeners = 25;

const express = require('express');
const app = express();

const HOST = process.env.ATERNOS_HOST || 'god_broo.aternos.me';
const PORT = Number(process.env.ATERNOS_PORT || '18625');
const VERSION = process.env.MC_VERSION || '1.19.2';

app.get('/', (req, res) => res.send('✅ Mineboty on Render is alive!'));
const WEB_PORT = process.env.PORT || 8080;
app.listen(WEB_PORT, () => {
  console.log('🌐 Keep-alive web server running on port', WEB_PORT);
});

const mineboty = require('mineboty');

function startBot() {
  console.log('🤖 Starting Mineboty…');
  const bot = mineboty.createBot({
    host: HOST,
    port: PORT,
    version: VERSION,
  });

  bot.on('login', () => console.log('✅ Logged In Successfully'));
  bot.on('end', (reason) => {
    console.log('⚠️ Bot ended:', reason, '→ Reconnecting in 10s…');
    setTimeout(startBot, 10_000);
  });
  bot.on('error', (err) => {
    console.error('❌ Bot error:', err.message, '→ Retry in 10s…');
    setTimeout(startBot, 10_000);
  });
}

startBot();
