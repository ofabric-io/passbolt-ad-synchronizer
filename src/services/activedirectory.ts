import {ClientSecretCredential} from '@azure/identity';
import {Client} from '@microsoft/microsoft-graph-client';
import {TokenCredentialAuthenticationProvider} from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import 'isomorphic-fetch';
import {adGroupListResponse} from '../types/activedirectory';
import * as dotenv from 'dotenv';
dotenv.config();

const credential = new ClientSecretCredential(
  process.env.MICROSOFT_TENANT_ID as string,
  process.env.MICROSOFT_CLIENT_ID as string,
  process.env.MICROSOFT_CLIENT_SECRET as string
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default'],
});

const graphClient = Client.initWithMiddleware({
  authProvider,
});

export class ActiveDirectory {
  public async listGroups(): Promise<adGroupListResponse> {
    try {
      const groups = await graphClient
        .api(`/groups`)
        .version('v1.0')
        .filter(`startswith(displayName, 'PASSBOLT_')`)
        .select('id,displayName')
        .get();

      return groups;
    } catch (e) {
      throw new Error();
    }
  }

  public async listGroupMembers(id: string): Promise<any> {
    try {
      const members = await graphClient.api(`groups/${id}/members`).get();
      return members;
    } catch (e) {
      throw new Error();
    }
  }
}
