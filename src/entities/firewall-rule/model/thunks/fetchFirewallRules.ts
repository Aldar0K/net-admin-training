import { createAsyncThunk } from '@reduxjs/toolkit'

import { getFirewallRules } from '@/entities/firewall-rule/api'
import { firewallRuleSliceKey } from '../const'
import type { FirewallRule } from '../types'

export type FetchFirewallRulesParams = {
  errorMode?: boolean
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
