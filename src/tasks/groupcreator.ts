import {CronJob} from 'cron';
import {adGroupListValue} from '../types/activedirectory';
import {ActiveDirectory} from '../services/activedirectory';
import {Passbolt} from '../services/passbolt';

const activeDirectory = new ActiveDirectory();
const passbolt = new Passbolt();

export const GroupCreator = new CronJob('*/6 * * * *', async () => {
  try {
    const adGroups = await activeDirectory.listGroups();
    const adParsedGroups = adGroups.value.filter((group: adGroupListValue) =>
      group.displayName.startsWith('PASSBOLT_')
    );
    const pbGroups = await passbolt.listGroups();
    for (const group of [adParsedGroups[3]]) {
      const findGroup = pbGroups.find(
        e => 'PASSBOLT_' + e.name.toUpperCase() === group.displayName
      );
      if (!findGroup) {
        passbolt.createGroup(
          group.displayName.replace('PASSBOLT_', ''),
          process.env.PASSBOLT_USER_ID as string
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
});
