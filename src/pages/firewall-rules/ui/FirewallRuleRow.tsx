import { useUpdateFirewallRuleMutation } from '@/entities/firewall-rule'
import type { FirewallRule, GetFirewallRulesDTO } from '@/entities/firewall-rule'

type FirewallRuleRowProps = {
  rule: FirewallRule
  queryArgs: GetFirewallRulesDTO
}

const getMutationErrorModeFromUrl = () =>
  new URLSearchParams(window.location.search).get('mutError') === '1'

export const FirewallRuleRow = ({ rule, queryArgs }: FirewallRuleRowProps) => {
  const [updateFirewallRule, { isLoading }] = useUpdateFirewallRuleMutation()

  const handleToggleRuleEnabled = async () => {
    await updateFirewallRule({
      id: rule.id,
      changes: { enabled: !rule.enabled },
      queryArgs,
      mutError: getMutationErrorModeFromUrl(),
    }).unwrap()
  }

  return (
    <tr
      className={`border-b transition-opacity ${
        isLoading ? 'pointer-events-none opacity-50' : 'opacity-100'
      }`}
    >
      <td className="px-3 py-2">{rule.id}</td>
      <td className="px-3 py-2">{rule.name}</td>
      <td className="px-3 py-2">{rule.source}</td>
      <td className="px-3 py-2">{rule.destination}</td>
      <td className="px-3 py-2">{rule.protocol}</td>
      <td className="px-3 py-2">{rule.port}</td>
      <td className="px-3 py-2">{rule.action}</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className={`h-4 w-4 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            checked={rule.enabled}
            disabled={isLoading}
            onChange={() => void handleToggleRuleEnabled()}
          />
          <span>{rule.enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </td>
    </tr>
  )
}
