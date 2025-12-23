import { Search, Bell, MessageCircle, SunMoonIcon } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {useEffect,useState} from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { useAuth } from './auth/AuthContext'  



export function Header({ onSearch, searchQuery }) {

  const{user , logout}=useAuth();

  const[darkMode, setDarkMode]=useState(false);

 useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setDarkMode(true);
    } else {
      document.body.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

   const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <h1 className="font-semibold">Memories</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search trips and memories..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 bg-input-background border-border"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative"
            onClick={toggleTheme}>
              <SunMoonIcon className="h-5 w-5" />
            </Button>

            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
            </Button> */}

             <DropdownMenu>
              <DropdownMenuTrigger >
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex justify-center items-center h-40 border">
                  <p>{user?.name}</p>
                  {/* <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p> */}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}