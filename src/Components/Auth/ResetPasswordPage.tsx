import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LEDMatrix from "../LedMatrix/index";
import GlassyButton from "../ui/GlassyButton";
import PageTransition from "../ui/PageTransition";
import { resetPassword } from "../../api/auth";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';

    const [formData, setFormData] = useState({
        email: emailFromState,
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'otp' ? value.toUpperCase() : value
        }));
        setError('');
    };

    const handleReset = async () => {
        if (!formData.email || !formData.otp || !formData.newPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await resetPassword(formData.email, formData.otp, formData.newPassword);
            setSuccess('Password reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err: any) {
            const message = err.response?.data?.error;
            setError(message || 'Reset failed. Please try again.');
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
                        Reset Password
                    </h1>
                    <p className="text-sm text-neutral-300/90 mb-6 text-center">
                        Enter the OTP and your new password
                    </p>

                    <div className="space-y-4">
                        {!emailFromState && (
                            <div>
                                <label className="block text-sm text-cyan-50 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                             text-cyan-50 placeholder-neutral-400/70 
                                             focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                             transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>
                        )}

                        {emailFromState && (
                            <p className="text-sm text-neutral-400/80 text-center">
                                Resetting for <span className="text-cyan-400">{emailFromState}</span>
                            </p>
                        )}

                        <div>
                            <label className="block text-sm text-cyan-50 mb-2">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                         text-cyan-50 placeholder-neutral-400/70 text-center text-2xl tracking-[0.5em]
                                         focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                         transition-all duration-200"
                                placeholder="A1B2C3"
                                maxLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-cyan-50 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                         text-cyan-50 placeholder-neutral-400/70 
                                         focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                         transition-all duration-200"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400/70 hover:text-cyan-300 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-cyan-50 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                         text-cyan-50 placeholder-neutral-400/70 
                                         focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                         transition-all duration-200"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400/70 hover:text-cyan-300 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-400 text-sm text-center">{success}</p>
                        )}

                        <div className="mt-2 flex justify-center">
                            <GlassyButton
                                onClick={handleReset}
                                disabled={isLoading}
                                background='bg-[#1e1e1e]'
                            >
                                {isLoading ? 'Resetting' : 'Reset Password'}
                            </GlassyButton>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-300/90">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 underline"
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

export default ResetPasswordPage;
