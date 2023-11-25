import {spawnSync} from 'child_process';

export async function execute(bin: string, args: string[]) {
  const spawn = await spawnSync(bin, args);
  if (spawn.status !== 0) {
    console.log('Error:', spawn.stderr?.toString());
  }
  return spawn.stdout.toString();
}
