import { useState } from 'react'
import { Login } from '../login/Login.jsx'
import { Signup } from '../signup/Signup.jsx'

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
            <span className="text-primary-foreground text-xl">📸</span>
          </div>
          <h1 className="text-3xl text-foreground mb-2">Trip Memory</h1>
          <p className="text-muted-foreground">
            Share your adventures with friends and family
          </p>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <Login onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <Signup onSwitchToLogin={() => setIsLogin(true)} />
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2025 Trip Memory. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}