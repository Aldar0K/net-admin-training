import type { FirewallRule } from '../model'
import { fetchJson } from '@/shared/api'

type GetFirewallRulesParams = {
  simulateError?: boolean
}

export const getFirewallRules = async (
  params: GetFirewallRulesParams = {},
): Promise<FirewallRule[]> => {
  const query = new URLSearchParams()

  if (params.simulateError) {
    query.set('error', '1')
  }

  const search = query.toString()
  const url = search ? `/api/firewall-rules?${search}` : '/api/firewall-rules'

  return fetchJson<FirewallRule[]>(url)
}
