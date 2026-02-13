import { configureStore } from '@reduxjs/toolkit'
import { firewallRuleReducer, firewallRuleSliceKey } from '@/entities/firewall-rule'

export const store = configureStore({
  reducer: {
    [firewallRuleSliceKey]: firewallRuleReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
