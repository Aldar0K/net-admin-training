import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { GetFirewallRulesDTO } from '@/entities/firewall-rule'
import { useGetFirewallRulesQuery } from '@/entities/firewall-rule'
import { getRtkQueryErrorMessage } from '@/shared/api'
import { useDebounce } from '@/shared/hooks'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CheckboxField,
  SelectField,
  type SelectFieldOption,
  TextField,
} from '@/shared/ui'
import { FirewallRuleRow } from './FirewallRuleRow'

type ActionFilter = 'all' | 'allow' | 'deny'
const LOADER_ROWS = 6
const ACTION_OPTIONS: SelectFieldOption[] = [
  { value: 'all', label: 'All actions' },
  { value: 'allow', label: 'Allow' },
  { value: 'deny', label: 'Deny' },
]

const isActionFilter = (value: string): value is ActionFilter =>
  value === 'all' || value === 'allow' || value === 'deny'

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
  const [errorMode, setErrorMode] = useState(getErrorModeFromUrl)
  const [q, setQ] = useState('')
  const [enabledOnly, setEnabledOnly] = useState(false)
  const [action, setAction] = useState<ActionFilter>('all')
  const qDebounced = useDebounce(q, 350)

  const requestParams = useMemo<GetFirewallRulesDTO>(
    () => ({
      q: qDebounced.trim() || undefined,
      enabled: enabledOnly ? true : undefined,
      action: action === 'all' ? undefined : action,
      errorMode,
    }),
    [qDebounced, enabledOnly, action, errorMode],
  )

  const {
    data: rules = [],
    error,
    isError,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useGetFirewallRulesQuery(requestParams)

  const errorMessage = getRtkQueryErrorMessage(error, 'Failed to load firewall rules')

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
    void refetch()
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
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Source endpoint: <code>{endpoint}</code>
            </p>
            {isFetching && !isLoading && (
              <p className="text-xs text-muted-foreground" role="status" aria-live="polite">
                Updating...
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <TextField
              label="Search rules"
              helperText={q !== qDebounced ? 'Applying filter...' : 'Search by rule name'}
              placeholder="Search firewall rules..."
              endIcon={<Search />}
              value={q}
              onChange={(event) => setQ(event.target.value)}
            />
            <CheckboxField
              label="Enabled only"
              checked={enabledOnly}
              onChange={(event) => setEnabledOnly(event.target.checked)}
            />
            <SelectField
              value={action}
              onValueChange={(value) => {
                if (isActionFilter(value)) {
                  setAction(value)
                }
              }}
              options={ACTION_OPTIONS}
              placeholder="Select action"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={isFetching && !isLoading}
              onClick={handleReload}
            >
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
          {isLoading && (
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

          {isError && (
            <p className="text-sm text-destructive" role="alert">
              Error: {errorMessage}
            </p>
          )}

          {isSuccess && rules.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No rules found. Try clearing filter or disabling error mode.
            </p>
          )}

          {isSuccess && rules.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <caption className="sr-only">Firewall rules list</caption>
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="px-3 py-2 text-left font-medium">ID</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Name</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Source</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Destination</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Protocol</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Port</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Action</th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <FirewallRuleRow key={rule.id} rule={rule} />
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
