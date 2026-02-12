export type FirewallRuleProtocol = 'TCP' | 'UDP' | 'ICMP'

export type FirewallRuleAction = 'allow' | 'deny'

export type FirewallRule = {
  id: string
  name: string
  source: string
  destination: string
  protocol: FirewallRuleProtocol
  port: string
  action: FirewallRuleAction
  enabled: boolean
}
