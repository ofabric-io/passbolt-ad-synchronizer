import {
  passboltGroupMemberListResponse,
  passboltGroupResponse,
  passboltUserResponse,
} from '../types/passbolt';
import {logger} from '../utils/logger';
import {execute} from '../utils/process';
import * as dotenv from 'dotenv';
dotenv.config();

const bin = '/usr/bin/passbolt';
const config = [
  '--serverAddress',
  process.env.PASSBOLT_SERVER_ADDRESS,
  '--userPassword',
  process.env.PASSBOLT_USER_PASSWORD,
  '--userPrivateKey',
  Buffer.from(
    process.env.PASSBOLT_USER_PRIVATEKEY_B64 as string,
    'base64'
  ).toString('utf-8'),
] as string[];

export class Passbolt {
  public async listUsers(): Promise<passboltUserResponse[]> {
    const exec = await execute(bin, ['list', 'users', '-j', ...config]);
    return JSON.parse(exec);
  }
  public async listGroups(): Promise<passboltGroupResponse[]> {
    const exec = await execute(bin, ['list', 'groups', '-j', ...config]);
    return JSON.parse(exec);
  }

  public async listGroupMembers(
    id: string
  ): Promise<passboltGroupMemberListResponse> {
    const exec = await execute(bin, [
      'get',
      'group',
      '--id',
      id,
      '-j',
      ...config,
    ]);
    return JSON.parse(exec);
  }

  public async removeUserFromGroup(
    groupId: string,
    userId: string
  ): Promise<string> {
    return execute(bin, [
      'update',
      'group',
      '--id',
      groupId,
      '-d',
      'true',
      '-u',
      userId,
      ...config,
    ]);
  }

  public async addUserToGroup(
    groupId: string,
    userId: string
  ): Promise<string> {
    logger('adding user ' + userId + ' to group ' + groupId);
    return execute(bin, [
      'update',
      'group',
      '--id',
      groupId,
      '-u',
      userId,
      ...config,
    ]);
  }

  public async createGroup(groupName: string, userId: string) {
    logger('creating group ' + groupName);
    return execute(bin, [
      'create',
      'group',
      '-n',
      groupName,
      '-m',
      userId,
      ...config,
    ]);
  }

  public async createUser(firstname: string, lastname: string, email: string) {
    logger('creating user ' + email);
    return execute(bin, [
      'create',
      'user',
      '-u',
      email,
      '-f',
      firstname,
      '-l',
      lastname,
      '-r',
      'user',
      ...config,
    ]);
  }

  public async deleteUser(userId: string): Promise<string> {
    logger('deleting user ' + userId);
    return execute(bin, ['delete', 'user', '--id', userId, ...config]);
  }
}
