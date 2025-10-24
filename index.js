require('events').EventEmitter.defaultMaxListeners = 25;

const express = require('express');
const app = express();

const HOST = process.env.ATERNOS_HOST || 'god_broo.aternos.me';
// PORT و VERSION را عمداً نذاشتیم تا SRV و auto-detect کار کند
// اگر لازم شد بعداً اضافه می‌کنیم

app.get('/', (_req, res) => res.send('✅ Bot on Render is alive!'));
const WEB_PORT = process.env.PORT || 8080;
app.listen(WEB_PORT, () => {
  console.log('🌐 Keep-alive web server running on port', WEB_PORT);
});

const mineflayer = require('mineflayer');

function startBot() {
  console.log('🤖 Starting mineflayer…', { host: HOST });

  const bot = mineflayer.createBot({
    host: HOST,
    // اگر لازم شد دستی بده:
    // port: Number(process.env.ATERNOS_PORT),
    // version: process.env.MC_VERSION,
    // برای online-mode=true باید auth مایکروسافت راه‌اندازی شود؛ فعلاً توصیه: online-mode=false
  });

  bot.once('login', () => {
    console.log('✅ Logged In Successfully');
    // ضد AFK خیلی ساده
    setInterval(() => {
      try {
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * 0.5;
        bot.look(yaw, pitch, true);
      } catch (_) {}
    }, 60_000);
  });

  bot.on('kicked', (reason) => console.log('⚠️ Kicked:', reason));
  bot.on('end', (reason) => {
    console.log('⚠️ Bot ended:', reason, '→ Reconnecting in 10s…');
    setTimeout(startBot, 10_000);
  });
  bot.on('error', (err) => {
    console.error('❌ Bot error:', err?.message || err);
    setTimeout(startBot, 10_000);
  });
}

startBot();
