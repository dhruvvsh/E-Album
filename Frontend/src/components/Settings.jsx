import { useState } from 'react'
import { Bell, Eye, Lock, Moon, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Label } from './ui/label.jsx'
import { Switch } from './ui/switch.jsx'
import { Button } from './ui/button.jsx'
import { Separator } from './ui/separator.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx'
import { PageHeader } from './PageHeader.jsx'
import { useTheme } from '@/lib/theme'

function Section({ icon: Icon, title, description, children, danger = false }) {
  return (
    <Card className={danger ? 'border-destructive/40' : undefined}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              danger ? 'bg-destructive/10 text-destructive' : 'bg-accent text-accent-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className={danger ? 'text-destructive' : undefined}>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  )
}

function ToggleRow({ id, label, description, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export default function Settings() {
  const { isDark, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [privacy, setPrivacy] = useState('friends')

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
      <PageHeader title="Settings" description="Manage your app preferences" />

      <div className="space-y-6">
        <Section icon={Moon} title="Appearance" description="Customize how the app looks">
          <ToggleRow
            id="dark-mode"
            label="Dark mode"
            description="Use a darker theme that's easier on the eyes"
            checked={isDark}
            onCheckedChange={setTheme}
          />
        </Section>

        <Section icon={Bell} title="Notifications" description="Choose how you stay updated">
          <ToggleRow
            id="push-notifications"
            label="Push notifications"
            description="New memories and activity in your trips"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <Separator />
          <ToggleRow
            id="email-notifications"
            label="Email notifications"
            description="Email updates about your trips and invitations"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </Section>

        <Section icon={Lock} title="Privacy & security" description="Control who can see your content">
          <div className="space-y-2">
            <Label htmlFor="privacy" className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Default trip privacy
            </Label>
            <Select value={privacy} onValueChange={setPrivacy}>
              <SelectTrigger id="privacy">
                <SelectValue placeholder="Select privacy level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - anyone can view</SelectItem>
                <SelectItem value="friends">Friends only</SelectItem>
                <SelectItem value="private">Private - only you</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              The default privacy setting for new trips.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Account security
            </Label>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline">Change password</Button>
              <Button variant="outline">Two-factor authentication</Button>
            </div>
          </div>
        </Section>

        <Section
          icon={Shield}
          title="Danger zone"
          description="Irreversible actions"
          danger
        >
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
            Delete account
          </Button>
        </Section>
      </div>
    </div>
  )
}
