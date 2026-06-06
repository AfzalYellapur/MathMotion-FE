import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import LEDMatrix from "../LedMatrix/index";
import GlassyButton from "../ui/GlassyButton";
import PageTransition from "../ui/PageTransition";
import { forgotPassword } from "../../api/auth";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await forgotPassword(email);
            setSuccess('If the email exists, an OTP was sent.');
            // Navigate to reset password page after a short delay
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 1500);
        } catch (err: any) {
            const message = err.response?.data?.error;
            setError(message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="flex flex-col items-center justify-center h-screen w-screen absolute top-0 left-0">
                <LEDMatrix />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.9)_5%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0)_75%)] -z-9" />

                <div className="relative z-10 bg-zinc-900/10 backdrop-blur-md border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] text-white/80 rounded-2xl p-8 w-full max-w-md mx-4">
                    <h1 className="font-pixelify font-bold text-3xl text-cyan-50 mb-2 text-center">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-neutral-300/90 mb-6 text-center">
                        We'll send you an OTP to reset your password
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-cyan-50 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
                                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                         text-cyan-50 placeholder-neutral-400/70 
                                         focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                         transition-all duration-200"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-400 text-sm text-center">{success}</p>
                        )}

                        <div className="mt-2 flex justify-center">
                            <GlassyButton
                                onClick={handleSubmit}
                                disabled={isLoading}
                                background='bg-[#1e1e1e]'
                            >
                                {isLoading ? 'Sending' : 'Send Reset OTP'}
                            </GlassyButton>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-300/90">
                            Remember your password?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 underline"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

export default ForgotPasswordPage;
