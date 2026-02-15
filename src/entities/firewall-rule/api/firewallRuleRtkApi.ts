import { baseApi } from '@/shared/api'
import type { FirewallRule } from '../model'

type FirewallRuleActionFilter = 'allow' | 'deny'

export type GetFirewallRulesDTO = {
  q?: string
  enabled?: boolean
  action?: FirewallRuleActionFilter
  errorMode?: boolean
}

export type UpdateFirewallRuleDTO = {
  id: FirewallRule['id']
  changes: Partial<Omit<FirewallRule, 'id'>>
  queryArgs: GetFirewallRulesDTO | void
  mutError?: boolean
}

const buildQueryParams = (args: GetFirewallRulesDTO = {}) => {
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
    getFirewallRules: builder.query<FirewallRule[], GetFirewallRulesDTO | void>({
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
    updateFirewallRule: builder.mutation<FirewallRule, UpdateFirewallRuleDTO>({
      query: ({ id, changes, mutError }) => ({
        url: `/api/firewall-rules/${id}`,
        method: 'PATCH',
        body: changes,
        params: mutError ? { mutError: '1' } : undefined,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          firewallRuleRtkApi.util.updateQueryData(
            'getFirewallRules',
            arg.queryArgs,
            (draftRules) => {
              const targetRule = draftRules.find((rule) => rule.id === arg.id)
              if (!targetRule) {
                return
              }

              Object.assign(targetRule, arg.changes)
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, error, arg) =>
        error
          ? []
          : [
              { type: 'FirewallRule' as const, id: arg.id },
              { type: 'FirewallRule' as const, id: 'LIST' },
            ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetFirewallRulesQuery,
  useUpdateFirewallRuleMutation
} = firewallRuleRtkApi
