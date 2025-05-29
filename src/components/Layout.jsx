import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Users, Mail, Bike, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = useLocation()
    const { user, logout } = useAuthStore()

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Orders', href: '/orders', icon: Package },
        { name: 'Riders', href: '/riders', icon: Bike },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Approved Emails', href: '/approved-emails', icon: Mail },
    ]

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white transition-all duration-300 ease-in-out relative`}>
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between">
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                                <p className="text-sm text-gray-400 mt-1">Gaming Store</p>
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-8">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors group relative ${isActive
                                        ? 'bg-gray-800 text-white border-l-4 border-primary-500'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    title={isCollapsed ? item.name : ''}
                                >
                                    <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                    {!isCollapsed && (
                                        <span className="transition-opacity duration-200">
                                            {item.name}
                                        </span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                            {item.name}
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Section */}
                    <div className={`absolute bottom-0 ${isCollapsed ? 'w-16' : 'w-64'} p-4 border-t border-gray-800 transition-all duration-300`}>
                        {isCollapsed ? (
                            <div className="flex flex-col items-center space-y-3">
                                {/* User Avatar/Initial */}
                                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-medium">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium truncate max-w-[120px]">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate max-w-[120px]">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}