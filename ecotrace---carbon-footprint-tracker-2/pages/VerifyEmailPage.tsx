
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import Spinner from '../components/Spinner';

const VerifyEmailPage: React.FC = () => {
    const { state } = useLocation();
    const email = state?.email;
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyEmail, resendVerification } = useAuth();
    const navigate = useNavigate();

    if (!email) {
        return (
            <AuthLayout title="Verification Error" subtitle="No email address provided.">
                <p className="text-center text-gray-600 dark:text-gray-400">
                    Please <Link to="/register" className="text-blue-500">register</Link> or <Link to="/login" className="text-blue-500">login</Link> again.
                </p>
            </AuthLayout>
        );
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        const result = await verifyEmail(email, code);
        setLoading(false);
        if (result.success) {
            setMessage('Verification successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.error || 'Verification failed.');
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('Sending new code...');
        setLoading(true);
        await resendVerification(email);
        setLoading(false);
        setMessage('A new verification code has been sent to your email.');
    };

    return (
        <AuthLayout title="Verify your email" subtitle={`A verification code was sent to ${email}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
                    <div className="mt-1">
                        <input id="code" name="code" type="text" required value={code} onChange={(e) => setCode(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
                <div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                        {loading ? <Spinner /> : 'Verify'}
                    </button>
                </div>
            </form>
            <div className="mt-4 text-center text-sm">
                <button onClick={handleResend} disabled={loading} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Didn't receive a code? Resend
                </button>
            </div>
        </AuthLayout>
    );
};

export default VerifyEmailPage;
