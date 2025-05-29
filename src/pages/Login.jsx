
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Shield } from 'lucide-react'

export default function Login() {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)

    const handleSuccess = async (credentialResponse) => {
        const result = await login(credentialResponse.credential)
        if (result.success) {
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-primary-600" />
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Dashboard</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in with your admin account
                    </p>
                </div>
                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => console.log('Login Failed')}
                        theme="outline"
                        size="large"
                        width="100%"
                    />
                    <p className="mt-4 text-center text-xs text-gray-500">
                        Only admin accounts can access this dashboard
                    </p>
                </div>
            </div>
        </div>
    )
}
