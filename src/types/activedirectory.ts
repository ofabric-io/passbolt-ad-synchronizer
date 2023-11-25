export interface adGroupListValue {
  id: string;
  displayName: string;
  name: string;
}

export interface adGroupListResponse {
  '@odata.context': string;
  '@odata.nextLink': string;
  value: adGroupListValue[];
}

export interface adGroupMemberResponse {
  '@odata.context': string;
}

export interface adGroupMemberValue {
  '@odata.type': string;
  id: string;
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
}
