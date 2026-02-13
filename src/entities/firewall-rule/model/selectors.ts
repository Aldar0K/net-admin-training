import { firewallRuleSliceKey } from './const'
import { createSelector } from '@reduxjs/toolkit'

import type { FirewallRuleSchema } from './slice'
import type { FirewallRule } from './types'

type FirewallRuleStateSchema = {
  [firewallRuleSliceKey]: FirewallRuleSchema
}

export const selectFirewallRuleSchema = (state: FirewallRuleStateSchema) =>
  state[firewallRuleSliceKey]

export const selectFirewallRuleIds = createSelector(
  selectFirewallRuleSchema,
  (schema) => schema.ids,
)

export const selectFirewallRuleEntities = createSelector(
  selectFirewallRuleSchema,
  (schema) => schema.entities,
)

export const selectFirewallRuleStatus = createSelector(
  selectFirewallRuleSchema,
  (schema) => schema.status,
)

export const selectFirewallRuleError = createSelector(
  selectFirewallRuleSchema,
  (schema) => schema.error,
)

export const selectAllFirewallRules = createSelector(
  [selectFirewallRuleIds, selectFirewallRuleEntities],
  (ids, entities): FirewallRule[] =>
    ids.map((id) => entities[id]).filter((rule): rule is FirewallRule => Boolean(rule)),
)
