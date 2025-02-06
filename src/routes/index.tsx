export const API_BASE_URL = 'http://192.168.111.37:8000'; // Your backend base URL
export const WEBSOCKET_URL = 'http://localhost:3000';  // 🔥 Note: Use HTTP, NOT ws://

const ROUTES = {
  auth: {
    login: `${API_BASE_URL}/user/login/`,
    register: `${API_BASE_URL}/user/register/`,
    logout: `${API_BASE_URL}/logout/`,
    checkLogin: `${API_BASE_URL}/check-login/`
  },
  user: {
    profile: `${API_BASE_URL}/user-info/`,
    updateProfile: `${API_BASE_URL}/user-info/update/`, // Adjust if there is a specific update route
    preferences: `${API_BASE_URL}/privacy-settings/`, // Adjust if there is a specific preferences route
  },
  contacts: {
    check : `${API_BASE_URL}/user/check-contacts/`
  },
  messaging: {
    getMessages: `${API_BASE_URL}/messages/fetch_messages/`,
    sendMessage: `${API_BASE_URL}/messages/send_message/`,
    exchangeKeys: `${API_BASE_URL}/messages/exchange_keys/`,
  },
  channels: {
    getAllChannels: `${API_BASE_URL}/channels/`,
    getChannelById: (id: string) => `${API_BASE_URL}/channels/${id}/`,
    createChannel: `${API_BASE_URL}/channels/create/`,
    addMembersToChannel: `${API_BASE_URL}/channels/add-members/`,
    getChannelMembers: (channelId: string) => `${API_BASE_URL}/channels/${channelId}/members/`,
  },
  subchannels: {
    getAllSubchannels: `${API_BASE_URL}/subchannels/`,
    getSubchannelById: (id: string) => `${API_BASE_URL}/subchannels/${id}/`,
    createSubchannel: `${API_BASE_URL}/subchannels/create/`,
    getSubchannelMembers: (subchannelId: string) => `${API_BASE_URL}/subchannels/${subchannelId}/members/`,
  },
  groups: {
    getAllGroups: `${API_BASE_URL}/groups/`,
    getGroupById: (id: string) => `${API_BASE_URL}/groups/${id}/`,
    addMembersToGroup: `${API_BASE_URL}/groups/members/`,
    getGroupMembers: (groupId: string) => `${API_BASE_URL}/groups/${groupId}/members/`,
  },
  permissions: {
    getPermissionTypes: `${API_BASE_URL}/permissions/types/`,
    assignPermission: `${API_BASE_URL}/permissions/assign/`,
    removeUserRole: `${API_BASE_URL}/permissions/remove-user-role/`,
  },
  securityActions: {
    getSecurityActions: (channelId: string) => `${API_BASE_URL}/security-actions/${channelId}/`,
  },
  community: {
    followCommunity: `${API_BASE_URL}/community_action/`,
  },
};

export default ROUTES;
