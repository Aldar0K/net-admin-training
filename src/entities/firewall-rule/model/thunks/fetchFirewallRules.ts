import { createAsyncThunk } from '@reduxjs/toolkit'

import { getFirewallRules } from '@/entities/firewall-rule/api'
import { firewallRuleSliceKey } from '../const'
import type { FirewallRule } from '../types'

type ActionFilter = 'allow' | 'deny'

export type FetchFirewallRulesParams = {
  q?: string
  enabled?: boolean
  action?: ActionFilter
  errorMode?: boolean
}

export const fetchFirewallRules = createAsyncThunk<
  FirewallRule[],
  FetchFirewallRulesParams | undefined
>(`${firewallRuleSliceKey}/fetchFirewallRules`, async (params) => {
  const errorMode = params?.errorMode ?? false
  const q = params?.q
  const enabled = params?.enabled
  const action = params?.action

  return getFirewallRules({
    q,
    enabled,
    action,
    simulateError: errorMode,
  })
})
