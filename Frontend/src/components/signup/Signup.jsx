import { useState } from 'react'
import { Loader2, Mail, User } from 'lucide-react'
import { Button } from '../ui/button.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { FormError, PasswordField, TextField } from '../auth/fields.jsx'

export const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const { signup, isSigningUp } = useAuth()

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { username, email, password, confirmPassword } = formData

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    const result = await signup(username, email, password)
    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
        <p className="mt-2 text-muted-foreground">
          Start collecting memories with the people you travel with.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormError>{error}</FormError>

        <TextField
          id="username"
          label="Username"
          icon={User}
          autoComplete="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          disabled={isSigningUp}
          required
        />

        <TextField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isSigningUp}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="Min. 6 characters"
            value={formData.password}
            onChange={handleChange}
            disabled={isSigningUp}
            required
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm"
            autoComplete="new-password"
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSigningUp}
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSigningUp}>
          {isSigningUp ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-primary hover:underline"
          disabled={isSigningUp}
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
