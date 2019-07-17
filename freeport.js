const kill = require("kill-port");

async function free() {
  await kill(5000, "tcp");
  await kill(3000, "tcp");
}

free();
