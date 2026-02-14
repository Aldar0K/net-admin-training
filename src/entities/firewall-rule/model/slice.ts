import { createSlice } from '@reduxjs/toolkit'
import { firewallRuleSliceKey } from './const'
import { fetchFirewallRules } from './thunks/fetchFirewallRules'
import type { FirewallRule } from './types'

type FirewallRuleStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type FirewallRuleSchema = {
  ids: string[]
  entities: Record<string, FirewallRule>
  status: FirewallRuleStatus
  error: string | null
  currentRequestId: string | null
}

const initialState: FirewallRuleSchema = {
  ids: [],
  entities: {},
  status: 'idle',
  error: null,
  currentRequestId: null,
}

const normalizeRules = (rules: FirewallRule[]) => {
  const ids = rules.map((rule) => rule.id)
  const entities = rules.reduce<Record<string, FirewallRule>>((accumulator, rule) => {
    accumulator[rule.id] = rule
    return accumulator
  }, {})

  return { ids, entities }
}

const firewallRuleSlice = createSlice({
  name: firewallRuleSliceKey,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFirewallRules.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchFirewallRules.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return
        }

        const { ids, entities } = normalizeRules(action.payload)
        state.ids = ids
        state.entities = entities
        state.status = 'succeeded'
        state.error = null
        state.currentRequestId = null
      })
      .addCase(fetchFirewallRules.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return
        }

        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load firewall rules'
        state.currentRequestId = null
      })
  },
})

export const {
  reducer: firewallRuleReducer,
  actions: firewallRuleActions
} = firewallRuleSlice
export type { FirewallRuleStatus }
