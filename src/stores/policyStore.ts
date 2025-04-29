import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Policy = {
  id: number
  title: string
  description: string
  created_at: string
}

interface PolicyState {
  policies: Policy[]
  setPolicies: (policies: Policy[]) => void
  clearPolicies: () => void
}

// Sekarang kita pakai `persist`
export const usePolicyStore = create<PolicyState>()(
  persist(
    (set) => ({
      policies: [],
      setPolicies: (policies) => set({ policies }),
      clearPolicies: () => set({ policies: [] }),
    }),
    {
      name: 'policy-storage', // ⬅️ nama di localStorage
    }
  )
)
