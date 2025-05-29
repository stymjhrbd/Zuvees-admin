import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ApprovedEmails() {
    const [showAddModal, setShowAddModal] = useState(false)
    const [newEmail, setNewEmail] = useState({ email: '', role: 'customer', notes: '' })

    const { data: emails, refetch } = useQuery('approved-emails',
        async () => {
            const response = await axios.get('/admin/approved-emails')
            return response.data
        }
    )

    const addEmailMutation = useMutation(
        async (emailData) => {
            const response = await axios.post('/admin/approved-emails', emailData)
            return response.data
        },
        {
            onSuccess: () => {
                toast.success('Email added successfully')
                refetch()
                setShowAddModal(false)
                setNewEmail({ email: '', role: 'customer', notes: '' })
            }
        }
    )

    const removeEmailMutation = useMutation(
        async (id) => {
            await axios.delete(`/admin/approved-emails/${id}`)
        },
        {
            onSuccess: () => {
                toast.success('Email removed successfully')
                refetch()
            }
        }
    )

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Approved Emails</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary btn-sm"
                >
                    Add Email
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Notes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Added On
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {emails?.map((email) => (
                            <tr key={email._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {email.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${email.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            email.role === 'rider' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {email.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {email.notes || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(email.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => removeEmailMutation.mutate(email._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Email Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Add Approved Email</h3>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={newEmail.email}
                                onChange={(e) => setNewEmail({ ...newEmail, email: e.target.value })}
                                className="w-full border rounded p-2"
                            />
                            <select
                                value={newEmail.role}
                                onChange={(e) => setNewEmail({ ...newEmail, role: e.target.value })}
                                className="w-full border rounded p-2"
                            >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                                <option value="rider">Rider</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Notes (optional)"
                                value={newEmail.notes}
                                onChange={(e) => setNewEmail({ ...newEmail, notes: e.target.value })}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="btn btn-secondary btn-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => addEmailMutation.mutate(newEmail)}
                                className="btn btn-primary btn-sm"
                            >
                                Add Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}