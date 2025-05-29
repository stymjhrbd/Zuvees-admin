import { useQuery } from 'react-query'
import axios from 'axios'

export default function Riders() {
    const { data: riders } = useQuery('admin-riders',
        async () => {
            const response = await axios.get('/admin/riders')
            return response.data
        }
    )

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Riders Management</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {riders?.map((rider) => (
                    <div key={rider._id} className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-12 w-12 rounded-full"
                                    src={`https://ui-avatars.com/api/?name=${rider.name}&background=3b82f6&color=fff`}
                                    alt={rider.name}
                                />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">{rider.name}</h3>
                                <p className="text-sm text-gray-500">{rider.email}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                                    <dd className="text-sm text-gray-900">{rider.stats.totalOrders}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Active Orders</dt>
                                    <dd className="text-sm text-gray-900">{rider.stats.activeOrders}</dd>
                                </div>
                            </dl>
                        </div>
                        <div className="mt-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${rider.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {rider.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
