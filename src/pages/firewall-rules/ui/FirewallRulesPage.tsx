import { useEffect, useMemo, useState } from 'react'

import {
  fetchFirewallRules,
  selectAllFirewallRules,
  selectFirewallRuleError,
  selectFirewallRuleStatus,
} from '@/entities/firewall-rule'
import type { FetchFirewallRulesParams } from '@/entities/firewall-rule'
import { useAppDispatch, useAppSelector } from '@/app'
import { useDebounce } from '@/shared/hooks'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/ui'

type ActionFilter = 'all' | 'allow' | 'deny'
const LOADER_ROWS = 6

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
  const dispatch = useAppDispatch()
  const rules = useAppSelector(selectAllFirewallRules)
  const status = useAppSelector(selectFirewallRuleStatus)
  const error = useAppSelector(selectFirewallRuleError)
  const [errorMode, setErrorMode] = useState(getErrorModeFromUrl)
  const [q, setQ] = useState('')
  const [enabledOnly, setEnabledOnly] = useState(false)
  const [action, setAction] = useState<ActionFilter>('all')
  const qDebounced = useDebounce(q, 350)
  const requestParams = useMemo<FetchFirewallRulesParams>(
    () => ({
      q: qDebounced.trim() || undefined,
      enabled: enabledOnly ? true : undefined,
      action: action === 'all' ? undefined : action,
      errorMode,
    }),
    [qDebounced, enabledOnly, action, errorMode],
  )

  useEffect(() => {
    void dispatch(fetchFirewallRules(requestParams))
  }, [dispatch, requestParams])

  const filteredRules = useMemo(() => {
    const query = q.trim().toLowerCase()

    return rules.filter((rule) => {
      const matchQ = query ? rule.name.toLowerCase().includes(query) : true
      const matchEnabled = enabledOnly ? rule.enabled : true
      const matchAction = action === 'all' ? true : rule.action === action

      return matchQ && matchEnabled && matchAction
    })
  }, [rules, q, enabledOnly, action])

  const endpoint = useMemo(() => {
    const query = new URLSearchParams()

    if (requestParams.q) {
      query.set('q', requestParams.q)
    }

    if (requestParams.enabled) {
      query.set('enabled', 'true')
    }

    if (requestParams.action) {
      query.set('action', requestParams.action)
    }

    if (requestParams.errorMode) {
      query.set('error', '1')
    }

    const search = query.toString()
    return search ? `/api/firewall-rules?${search}` : '/api/firewall-rules'
  }, [requestParams])

  const handleToggleError = () => {
    setErrorMode((previous) => {
      const nextValue = !previous
      updateErrorModeInUrl(nextValue)
      return nextValue
    })
  }

  const handleReload = () => {
    void dispatch(fetchFirewallRules(requestParams))
  }

  const handleResetFilters = () => {
    setQ('')
    setEnabledOnly(false)
    setAction('all')
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
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <Input
              placeholder="Search by name..."
              value={q}
              onChange={(event) => setQ(event.target.value)}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={enabledOnly}
                onChange={(event) => setEnabledOnly(event.target.checked)}
              />
              Enabled only
            </label>
            <select
              value={action}
              onChange={(event) => setAction(event.target.value as ActionFilter)}
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="all">All actions</option>
              <option value="allow">Allow</option>
              <option value="deny">Deny</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button type="button" variant="outline" onClick={handleReload}>
              Reload
            </Button>
          </div>
          <Button
            type="button"
            variant={errorMode ? 'destructive' : 'default'}
            onClick={handleToggleError}
          >
            {errorMode ? 'Disable error mode' : 'Simulate error'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {(status === 'loading' || status === 'idle') && (
            <div className="space-y-3">
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                {Array.from({ length: LOADER_ROWS }).map((_, index) => (
                  <div
                    key={`rules-skeleton-${index}`}
                    className="h-10 w-full animate-pulse rounded-md bg-muted/70"
                  />
                ))}
              </div>
            </div>
          )}

          {status === 'failed' && (
            <p className="text-sm text-destructive">
              Error: {error ?? 'Failed to load firewall rules'}
            </p>
          )}

          {status === 'succeeded' && filteredRules.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No rules found. Try clearing filter or disabling error mode.
            </p>
          )}

          {status === 'succeeded' && filteredRules.length > 0 && (
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
