import { delay, http, HttpResponse } from 'msw'

import { firewallRules } from '@/mocks/data/firewallRules'

const randomDelay = (minMs: number, maxMs: number) =>
  Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs

export const handlers = [
  http.get('/api/firewall-rules', async ({ request }) => {
    const url = new URL(request.url)
    const shouldFail = url.searchParams.get('error') === '1'

    await delay(randomDelay(400, 800))

    if (shouldFail) {
      return HttpResponse.json(
        { message: 'Simulated internal server error' },
        { status: 500 },
      )
    }

    return HttpResponse.json(firewallRules, { status: 200 })
  }),
]
