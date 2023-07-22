class Auth {
  static saveTokenToLs = (access_token, refresh_token) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  };
  static clearTokenFromLS = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };
  static getTokenFromLs = () => {
    return {
      access_token: localStorage.getItem('access_token') || '',
      refresh_token: localStorage.getItem('refresh_token') || '',
    };
  };
  static getProfileFromLS = () => {
    const rs = localStorage.getItem('profile');
    return rs ? JSON.parse(rs) : null;
  };
  static setProfileToLS = (profile) => {
    localStorage.setItem('profile', JSON.stringify(profile));
  };
  static getPermissionsFromLS = () => {
    const rs = localStorage.getItem('permissions');
    return rs ? JSON.parse(rs) : null;
  };
  static setPermissionsToLS = (permissions) => {
    localStorage.setItem('permissions', JSON.stringify(permissions));
  };
}

export default Auth;
