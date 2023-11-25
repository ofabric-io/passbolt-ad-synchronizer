import {CronJob} from 'cron';
import {adGroupListValue, adGroupMemberValue} from '../types/activedirectory';
import {ActiveDirectory} from '../services/activedirectory';
import {Passbolt} from '../services/passbolt';
import {Group, User} from '../types/application';

const activeDirectory = new ActiveDirectory();
const passbolt = new Passbolt();

export const UserSync = new CronJob('* * * * *', async () => {
  try {
    const adGroups = await activeDirectory.listGroups();
    const rawPbUsers = await passbolt.listUsers();

    const groups: Group[] = [];
    const users: User[] = [];
    const pbUsers: string[] = rawPbUsers.map(e => {
      return e.username;
    });

    for await (const group of adGroups.value) {
      const memberList = await activeDirectory.listGroupMembers(group.id);
      groups.push({
        adId: group.id,
        name: group.displayName,
        members: memberList.value.map((e: adGroupMemberValue) => {
          if (!users.find(user => user.email === e.userPrincipalName)) {
            users.push({
              firstname: e.givenName,
              lastname: e.surname,
              email: e.userPrincipalName,
            });
          }
          return e.userPrincipalName;
        }),
      });
    }

    const usersSanitized = users.map(e => {
      return e.email;
    });

    const creationList = usersSanitized.filter(e => !pbUsers.includes(e));

    // INVITE USERS ON CREATION LIST
    for await (const user of creationList) {
      const info = users.find((e: User) => e.email === user) as User;
      if (info) passbolt.createUser(info.firstname, info.lastname, info.email);
    }

    const deleteList = pbUsers.filter(e => !usersSanitized.includes(e));

    // DELETE USERS ON DELETE LIST
    for await (const user of deleteList) {
      const info = rawPbUsers.find(e => e.username === user);
      if (info) await passbolt.deleteUser(info.id);
    }
  } catch (e) {
    console.error(e);
  }
});
