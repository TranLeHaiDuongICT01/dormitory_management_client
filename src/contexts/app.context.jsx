import { createContext, useState } from 'react'
import Auth from '../utils/auth'

const initialAppcontext = {
  isAuthenticated: Boolean(Auth.getTokenFromLs().access_token),
  setIsAuthenticated: () => null,
  profile: Auth.getProfileFromLS(),
  setProfile: () => null,
  permissions: Auth.getPermissionsFromLS() || [],
  setPermissions: () => null
}

export const AppContext = createContext(initialAppcontext)

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppcontext.isAuthenticated)
  const [profile, setProfile] = useState(initialAppcontext.profile)
  const [permissions, setPermissions] = useState(initialAppcontext.permissions)

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        permissions,
        setPermissions
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
