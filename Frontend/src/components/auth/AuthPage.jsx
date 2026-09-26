import { useState } from 'react'
import { Camera, Heart, Images, Users } from 'lucide-react'
import { Login } from '../login/Login.jsx'
import { Signup } from '../signup/Signup.jsx'

const FEATURES = [
  { icon: Images, title: 'One album per trip', text: 'Photos and videos, beautifully organised.' },
  { icon: Users, title: 'Made together', text: 'Invite friends and family to add their moments.' },
  { icon: Heart, title: 'Keep the best', text: 'Favorite the shots you never want to lose.' },
]

const TILES = [
  'bg-[var(--sand)] rotate-[-6deg] translate-y-3',
  'bg-[var(--clay)] rotate-[4deg] -translate-y-2',
  'bg-[var(--sage)] rotate-[-3deg] translate-y-1',
]

function Brand({ className = '', onDark = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${
          onDark ? 'bg-white/15 text-white' : 'bg-brand text-white'
        }`}
      >
        <Camera className="h-5 w-5" />
      </span>
      <span className="text-xl font-semibold tracking-tight">Memories</span>
    </div>
  )
}

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[var(--clay)]/25 blur-3xl" />

        <Brand className="relative" onDark />

        <div className="relative space-y-10">
          <div className="flex gap-4" aria-hidden="true">
            {TILES.map((tile, i) => (
              <div
                key={i}
                className={`h-44 flex-1 rounded-3xl ${tile} shadow-xl ring-1 ring-black/5`}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Every trip deserves a beautiful album.
            </h1>
            <p className="max-w-md text-lg text-white/80">
              Collect, share and relive your favorite moments with the people who were there.
            </p>
          </div>

          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-md">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/75">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">© {new Date().getFullYear()} Memories</p>
      </aside>

      <main className="app-canvas flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Brand className="mb-10 lg:hidden" />
          {isLogin ? (
            <Login onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <Signup onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </main>
    </div>
  )
}
