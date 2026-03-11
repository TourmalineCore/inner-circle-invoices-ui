import { useContext } from "react"
import { jwtDecode } from "jwt-decode"
import { authService } from "./authService"

interface DecodedToken {
  permissions: string[],
  employeeId: number,
}

const getDecodedToken = (): DecodedToken | null => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const authContext = useContext<string[]>(authService.AuthContext)

  const token = authContext?.[0]

  if (!token) {
    return null
  }

  try {
    return jwtDecode<DecodedToken>(token)
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error decoding token:`, error)
    return null
  }
}

export const hasAccessPermission = ({
  permission,
}: {
  permission: string,
}): boolean => {
  const decodedToken = getDecodedToken()
  
  if (!decodedToken) {
    throw new Error(`Token is not available or invalid.`)
  }

  return decodedToken.permissions.includes(permission)
}

export const getEmployeeIdFromToken = (): number => {
  const decodedToken = getDecodedToken()
  
  if (!decodedToken) {
    throw new Error(`Token is not available or invalid.`)
  }
  
  return Number(decodedToken.employeeId)
}
