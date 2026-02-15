import type { FirewallRule } from '@/entities/firewall-rule'
import { useUpdateFirewallRuleMutation } from '@/entities/firewall-rule'
import { CheckboxField } from '@/shared/ui'

type FirewallRuleRowProps = {
  rule: FirewallRule
}

const getMutationErrorModeFromUrl = () =>
  new URLSearchParams(window.location.search).get('mutError') === '1'

export const FirewallRuleRow = ({ rule }: FirewallRuleRowProps) => {
  const [updateFirewallRule, { isLoading }] = useUpdateFirewallRuleMutation()

  const handleToggleRuleEnabled = async () => {
    await updateFirewallRule({
      id: rule.id,
      changes: { enabled: !rule.enabled },
      mutError: getMutationErrorModeFromUrl(),
    }).unwrap()
  }

  return (
    <tr
      className={`border-b transition-opacity ${
        isLoading ? 'pointer-events-none opacity-50' : 'opacity-100'
      }`}
    >
      <th scope="row" className="px-3 py-2 text-left font-normal">
        {rule.id}
      </th>
      <td className="px-3 py-2">{rule.name}</td>
      <td className="px-3 py-2">{rule.source}</td>
      <td className="px-3 py-2">{rule.destination}</td>
      <td className="px-3 py-2">{rule.protocol}</td>
      <td className="px-3 py-2">{rule.port}</td>
      <td className="px-3 py-2">{rule.action}</td>
      <td className="px-3 py-2">
        <CheckboxField
          label={
            <>
              <span className="sr-only">Toggle rule {rule.name}</span>
              <span aria-hidden="true">{rule.enabled ? 'Enabled' : 'Disabled'}</span>
            </>
          }
          checked={rule.enabled}
          disabled={isLoading}
          onChange={() => void handleToggleRuleEnabled()}
          containerClassName="gap-0"
        />
      </td>
    </tr>
  )
}
