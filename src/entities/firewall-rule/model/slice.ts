import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getFirewallRules } from '../api'
import { firewallRuleSliceKey } from './const'
import type { FirewallRule } from './types'

type FetchFirewallRulesParams = {
  errorMode?: boolean
}

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

export const fetchFirewallRules = createAsyncThunk<
  FirewallRule[],
  FetchFirewallRulesParams | undefined
>(`${firewallRuleSliceKey}/fetchFirewallRules`, async (params) => {
  const errorMode = params?.errorMode ?? false

  return getFirewallRules({
    simulateError: errorMode,
  })
})

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
export type { FetchFirewallRulesParams, FirewallRuleStatus }
