import { delay, http, HttpResponse } from 'msw'

import { firewallRules } from '@/mocks/data/firewallRules'

const randomDelay = (minMs: number, maxMs: number) =>
  Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs

export const handlers = [
  http.get('/api/firewall-rules', async ({ request }) => {
    const url = new URL(request.url)
    const shouldFail = url.searchParams.get('error') === '1'
    const q = url.searchParams.get('q')?.trim().toLowerCase() ?? ''
    const enabledOnly = url.searchParams.get('enabled') === 'true'
    const actionParam = url.searchParams.get('action')
    const actionFilter = actionParam === 'allow' || actionParam === 'deny' ? actionParam : null

    await delay(randomDelay(400, 800))

    if (shouldFail) {
      return HttpResponse.json(
        { message: 'Simulated internal server error' },
        { status: 500 },
      )
    }

    const filteredRules = firewallRules.filter((rule) => {
      const matchQ = q ? rule.name.toLowerCase().includes(q) : true
      const matchEnabled = enabledOnly ? rule.enabled : true
      const matchAction = actionFilter ? rule.action === actionFilter : true

      return matchQ && matchEnabled && matchAction
    })

    return HttpResponse.json(filteredRules, { status: 200 })
  }),
]
