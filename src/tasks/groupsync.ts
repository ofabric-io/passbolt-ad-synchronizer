import {CronJob} from 'cron';
import {adGroupMemberValue} from '../types/activedirectory';
import {ActiveDirectory} from '../services/activedirectory';
import {Passbolt} from '../services/passbolt';
import {Group} from '../types/application';
import {passboltUserResponse} from '../types/passbolt';
import {logger} from '../utils/logger';

const activeDirectory = new ActiveDirectory();
const passbolt = new Passbolt();

export const GroupSync = new CronJob('*/4 * * * *', async () => {
  try {
    const adGroups = await activeDirectory.listGroups();
    const pbGroups = await passbolt.listGroups();
    const pbUsers = await passbolt.listUsers();

    const groups: Group[] = [];

    for await (const group of adGroups.value) {
      const memberList = await activeDirectory.listGroupMembers(group.id);
      groups.push({
        adId: group.id,
        name: group.displayName,
        members: memberList.value.map((e: adGroupMemberValue) => {
          return e.userPrincipalName;
        }),
      });
    }

    for await (const group of groups) {
      const pbGroup = pbGroups.find(
        e => e.name.toUpperCase() === group.name.replace('PASSBOLT_', '')
      );

      if (pbGroup) {
        const pbMemberList = await passbolt.listGroupMembers(pbGroup.id);
        const pbMailList = pbMemberList.users.map(e => {
          return e.username;
        });
        const creationList = group.members.filter(e => !pbMailList.includes(e));
        const deleteList = pbMailList.filter(e => !group.members.includes(e));

        // INVITE USERS ON CREATION LIST
        for await (const user of creationList) {
          const pbUser = pbUsers.find(
            e => e.username === user
          ) as passboltUserResponse;
          if (pbUser) {
            logger(
              'processing group ' +
                pbGroup.name +
                ' adding user ' +
                pbUser.username
            );

            await passbolt.addUserToGroup(pbGroup.id, pbUser.id);
          }
        }

        // REMOVE USERS ON CREATION LIST
        for await (const user of deleteList) {
          const pbUser = pbUsers.find(
            e => e.username === user
          ) as passboltUserResponse;
          if (pbUser) {
            logger(
              'processing group ' +
                pbGroup.name +
                ' removing user ' +
                pbUser.username
            );
            await passbolt.removeUserFromGroup(pbGroup.id, pbUser.id);
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
});
