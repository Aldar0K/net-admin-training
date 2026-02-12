import { useEffect, useMemo, useState } from 'react'

import { getFirewallRules, type FirewallRule } from '@/entities/firewall-rule'
import { ApiError } from '@/shared/api'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/ui'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

const getErrorModeFromUrl = () =>
  new URLSearchParams(window.location.search).get('error') === '1'

const updateErrorModeInUrl = (enabled: boolean) => {
  const params = new URLSearchParams(window.location.search)

  if (enabled) {
    params.set('error', '1')
  } else {
    params.delete('error')
  }

  const query = params.toString()
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
  window.history.replaceState(null, '', nextUrl)
}

export const FirewallRulesPage = () => {
  const [rules, setRules] = useState<FirewallRule[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [simulateError, setSimulateError] = useState(getErrorModeFromUrl)
  const [searchValue, setSearchValue] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let isActive = true

    getFirewallRules({ simulateError })
      .then((data) => {
        if (!isActive) return

        setRules(data)
        setErrorMessage(null)
        setStatus('success')
      })
      .catch((error) => {
        if (!isActive) return

        setRules([])
        setStatus('error')
        setErrorMessage(
          error instanceof ApiError ? error.message : 'Unexpected error while loading rules',
        )
      })

    return () => {
      isActive = false
    }
  }, [simulateError, reloadToken])

  const filteredRules = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    if (!query) {
      return rules
    }

    return rules.filter((rule) =>
      [rule.name, rule.source, rule.destination, rule.protocol, rule.port, rule.action]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [rules, searchValue])

  const endpoint = simulateError ? '/api/firewall-rules?error=1' : '/api/firewall-rules'

  const handleToggleError = () => {
    setStatus('loading')
    setErrorMessage(null)
    setSimulateError((previous) => {
      const nextValue = !previous
      updateErrorModeInUrl(nextValue)
      return nextValue
    })
  }

  const handleReload = () => {
    setStatus('loading')
    setErrorMessage(null)
    setReloadToken((value) => value + 1)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Firewall Rules</CardTitle>
          <p className="text-sm text-muted-foreground">
            Source endpoint: <code>{endpoint}</code>
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder="Filter by name/source/destination..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <Button type="button" variant="outline" onClick={handleReload}>
            Reload
          </Button>
          <Button
            type="button"
            variant={simulateError ? 'destructive' : 'default'}
            onClick={handleToggleError}
          >
            {simulateError ? 'Disable error mode' : 'Simulate error'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {status === 'loading' && (
            <p className="text-sm text-muted-foreground">Loading firewall rules...</p>
          )}

          {status === 'error' && (
            <p className="text-sm text-destructive">Error: {errorMessage}</p>
          )}

          {status === 'success' && filteredRules.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No rules found. Try clearing filter or disabling error mode.
            </p>
          )}

          {status === 'success' && filteredRules.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left font-medium">ID</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Source</th>
                    <th className="px-3 py-2 text-left font-medium">Destination</th>
                    <th className="px-3 py-2 text-left font-medium">Protocol</th>
                    <th className="px-3 py-2 text-left font-medium">Port</th>
                    <th className="px-3 py-2 text-left font-medium">Action</th>
                    <th className="px-3 py-2 text-left font-medium">Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} className="border-b">
                      <td className="px-3 py-2">{rule.id}</td>
                      <td className="px-3 py-2">{rule.name}</td>
                      <td className="px-3 py-2">{rule.source}</td>
                      <td className="px-3 py-2">{rule.destination}</td>
                      <td className="px-3 py-2">{rule.protocol}</td>
                      <td className="px-3 py-2">{rule.port}</td>
                      <td className="px-3 py-2">{rule.action}</td>
                      <td className="px-3 py-2">{rule.enabled ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
