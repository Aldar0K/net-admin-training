import type { FirewallRule } from '../model'
import { fetchJson } from '@/shared/api'

type FirewallRuleActionFilter = 'allow' | 'deny'

type GetFirewallRulesParams = {
  q?: string
  enabled?: boolean
  action?: FirewallRuleActionFilter
  simulateError?: boolean
}

export const getFirewallRules = async (
  params: GetFirewallRulesParams = {},
): Promise<FirewallRule[]> => {
  const query = new URLSearchParams()
  const q = params.q?.trim()

  if (q) {
    query.set('q', q)
  }

  if (params.enabled) {
    query.set('enabled', 'true')
  }

  if (params.action) {
    query.set('action', params.action)
  }

  if (params.simulateError) {
    query.set('error', '1')
  }

  const search = query.toString()
  const url = search ? `/api/firewall-rules?${search}` : '/api/firewall-rules'

  return fetchJson<FirewallRule[]>(url)
}
