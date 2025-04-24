'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function withRoleGuard(Component: React.FC, allowedRoles: number[]) {
  return function RoleProtectedComponent(props: any) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
      const savedRoleId = localStorage.getItem('role_id')

      if (!savedRoleId) {
        router.replace('/403')
        return
      }

      const roleId = Number(savedRoleId)

      if (!allowedRoles.includes(roleId)) {
        router.replace('/403')
      } else {
        setIsAuthorized(true)
      }
    }, [router])

    if (isAuthorized === null) return null // Bisa diganti loading spinner

    return <Component {...props} />
  }
}
