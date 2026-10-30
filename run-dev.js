const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

function startProcess(name, args, cwd, colorCode) {
  const proc = spawn(npmCmd, args, {
    cwd: path.resolve(__dirname, cwd),
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const prefix = `\x1b[${colorCode}m[${name}]\x1b[0m `;

  const forwardOutput = (stream) => {
    let buffer = '';
    stream.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.trim().length > 0) {
          console.log(`${prefix}${line}`);
        }
      }
    });
    stream.on('end', () => {
      if (buffer.trim().length > 0) {
        console.log(`${prefix}${buffer}`);
      }
    });
  };

  forwardOutput(proc.stdout);
  forwardOutput(proc.stderr);

  proc.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${prefix}Process exited with code ${code}`);
    }
  });

  return proc;
}

console.log('\x1b[35m[TripMeta]\x1b[0m Starting TripMeta Development Environment (API + Web)...');

const backend = startProcess('API', ['run', 'dev'], './backend', '36');  // Cyan
const frontend = startProcess('WEB', ['run', 'dev'], './frontend', '32'); // Green

const cleanExit = () => {
  console.log('\n\x1b[35m[TripMeta]\x1b[0m Shutting down dev servers...');
  try {
    if (isWin) {
      if (backend.pid) spawn('taskkill', ['/pid', backend.pid, '/f', '/t']);
      if (frontend.pid) spawn('taskkill', ['/pid', frontend.pid, '/f', '/t']);
    } else {
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
    }
  } catch (err) {
    // ignore cleanup errors
  }
  process.exit(0);
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
