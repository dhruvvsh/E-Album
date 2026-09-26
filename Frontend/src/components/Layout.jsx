import { Outlet } from 'react-router-dom'
import { Sidebar, MobileNav } from './Sidebar'
import { Header } from './Header'
import { CreateTripModal } from './CreateTripModal'
import { useAppContext } from './AppContext.jsx'

const Layout = () => {
  const {
    searchQuery,
    setSearchQuery,
    isCreateTripModalOpen,
    setIsCreateTripModalOpen,
    handleCreateTrip,
  } = useAppContext()

  const openCreateTrip = () => setIsCreateTripModalOpen(true)

  return (
    <div className="app-canvas flex h-screen flex-col">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="flex min-h-0 flex-1">
        <Sidebar onCreateTrip={openCreateTrip} />

        <main className="min-w-0 flex-1 overflow-y-auto pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      <MobileNav onCreateTrip={openCreateTrip} />

      <CreateTripModal
        isOpen={isCreateTripModalOpen}
        onClose={() => setIsCreateTripModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />
    </div>
  )
}

export default Layout
