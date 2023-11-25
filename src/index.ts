import * as dotenv from 'dotenv';
import {validateEnv} from './utils/env';
import {GroupSync} from './tasks/groupsync';
import {UserSync} from './tasks/usersync';
import {GroupCreator} from './tasks/groupcreator';

dotenv.config();

async function main() {
  validateEnv([
    'PASSBOLT_SERVER_ADDRESS',
    'PASSBOLT_USER_PASSWORD',
    'PASSBOLT_USER_PRIVATEKEY_B64',
    'MICROSOFT_TENANT_ID',
    'MICROSOFT_CLIENT_ID',
    'MICROSOFT_CLIENT_SECRET',
  ]);
}

main();
UserSync.start();
GroupSync.start();
GroupCreator.start();
