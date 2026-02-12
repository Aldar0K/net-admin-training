import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function App() {
  const [name, setName] = useState('')

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Net Admin Training</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Firewall name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="button">Save draft</Button>
          <p className="text-sm text-muted-foreground">
            Tailwind + shadcn/ui ready. Current value: {name || 'empty'}
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
