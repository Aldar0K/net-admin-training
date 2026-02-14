import type { FirewallRule } from '../model'
import { baseApi } from '@/shared/api'

type FirewallRuleActionFilter = 'allow' | 'deny'

export type GetFirewallRulesArgs = {
  q?: string
  enabled?: boolean
  action?: FirewallRuleActionFilter
  errorMode?: boolean
}

const buildQueryParams = (args: GetFirewallRulesArgs = {}) => {
  const q = args.q?.trim()
  const params: Record<string, string> = {}

  if (q) {
    params.q = q
  }

  if (args.enabled) {
    params.enabled = 'true'
  }

  if (args.action) {
    params.action = args.action
  }

  if (args.errorMode) {
    params.error = '1'
  }

  return params
}

export const firewallRuleRtkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFirewallRules: builder.query<FirewallRule[], GetFirewallRulesArgs | void>({
      query: (args) => ({
        url: '/api/firewall-rules',
        params: buildQueryParams(args ?? {}),
      }),
      providesTags: (result) => {
        if (!result) {
          return [{ type: 'FirewallRule' as const, id: 'LIST' }]
        }

        return [
          { type: 'FirewallRule' as const, id: 'LIST' },
          ...result.map((rule) => ({ type: 'FirewallRule' as const, id: rule.id })),
        ]
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetFirewallRulesQuery } = firewallRuleRtkApi
