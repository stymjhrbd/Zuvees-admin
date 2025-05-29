import { useQuery } from 'react-query'
import { Package, Users, IndianRupee, Truck } from 'lucide-react'
import axios from 'axios'

export default function Dashboard() {
    const { data: stats } = useQuery('dashboard-stats',
        async () => {
            const response = await axios.get('/admin/dashboard')
            return response.data
        }
    )

    const cards = [
        { name: 'Total Orders', value: stats?.stats?.totalOrders || 0, icon: Package, color: 'bg-blue-500' },
        { name: 'Total Revenue', value: `${stats?.stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: IndianRupee, color: 'bg-green-500' },
        { name: 'Total Customers', value: stats?.stats?.totalCustomers || 0, icon: Users, color: 'bg-purple-500' },
        { name: 'Pending Orders', value: stats?.stats?.pendingOrders || 0, icon: Truck, color: 'bg-yellow-500' },
    ]

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                                    <card.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{card.value}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {stats?.recentOrders?.map((order) => (
                            <li key={order._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-primary-600 truncate">
                                            {order.orderNumber}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {order.customer?.name}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>${order.totalAmount?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
