export interface passboltGroupResponse {
  id: string;
  name: string;
  created_timestamp: Date;
  modified_timestamp: Date;
}

export interface passboltGroupMember {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  is_group_manager: boolean;
}

export interface passboltGroupMemberListResponse {
  name: string;
  users: passboltGroupMember[];
}

export interface passboltUserResponse {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  created_timestamp: string;
  modified_timestamp: string;
}
