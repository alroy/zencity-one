"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

interface UserContextType {
  avatar: string | null
  setAvatar: (avatar: string | null) => void
  userInfo: {
    firstName: string
    lastName: string
    jobTitle: string
  }
  setUserInfo: (info: { firstName: string; lastName: string; jobTitle: string }) => void
}

const defaultUserInfo = {
  firstName: "John",
  lastName: "Smith",
  jobTitle: "Captain, Southwest Division",
}

const UserContext = createContext<UserContextType>({
  avatar: null,
  setAvatar: () => {},
  userInfo: defaultUserInfo,
  setUserInfo: () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState(defaultUserInfo)

  return <UserContext.Provider value={{ avatar, setAvatar, userInfo, setUserInfo }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
