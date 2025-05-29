import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Orders() {
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showAssignModal, setShowAssignModal] = useState(false)

    const { data, refetch } = useQuery('admin-orders',
        async () => {
            const response = await axios.get('/admin/orders')
            return response.data
        }
    )

    const { data: riders } = useQuery('riders',
        async () => {
            const response = await axios.get('/admin/riders')
            return response.data
        }
    )

    const updateStatusMutation = useMutation(
        async ({ orderId, status, riderId }) => {
            const response = await axios.put(`/admin/orders/${orderId}/status`, { status, riderId })
            return response.data
        },
        {
            onSuccess: () => {
                toast.success('Order updated successfully')
                refetch()
                setShowAssignModal(false)
            }
        }
    )

    const handleStatusChange = (order, newStatus) => {
        if (newStatus === 'shipped') {
            setSelectedOrder(order)
            setShowAssignModal(true)
        } else {
            updateStatusMutation.mutate({ orderId: order._id, status: newStatus })
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rider
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data?.orders?.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.orderNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.customer?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${order.totalAmount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.rider?.name || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.status === 'paid' && (
                                        <button
                                            onClick={() => handleStatusChange(order, 'shipped')}
                                            className="text-primary-600 hover:text-primary-900"
                                        >
                                            Ship Order
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assign Rider Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Assign Rider</h3>
                        <select
                            className="w-full border rounded p-2 mb-4"
                            onChange={(e) => {
                                updateStatusMutation.mutate({
                                    orderId: selectedOrder._id,
                                    status: 'shipped',
                                    riderId: e.target.value
                                })
                            }}
                        >
                            <option value="">Select a rider</option>
                            {riders?.filter(r => r.isActive).map((rider) => (
                                <option key={rider._id} value={rider._id}>
                                    {rider.name} ({rider.stats.activeOrders} active orders)
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowAssignModal(false)}
                            className="btn btn-secondary btn-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
