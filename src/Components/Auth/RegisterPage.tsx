import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import LEDMatrix from "../LedMatrix/index";
import GlassyButton from "../ui/GlassyButton";
import PageTransition from "../ui/PageTransition";
import { register } from "../../api/auth";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleCreateAccount = async () => {
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            await register(formData.email, formData.password);
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err: any) {
            const message = err.response?.data?.error;
            setError(message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <PageTransition>
            <div
                className="flex flex-col items-center justify-center h-screen w-screen absolute top-0 left-0">
                <LEDMatrix />
                <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.9)_5%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0)_75%)] -z-9" />

                <div
                    className="relative z-10 bg-zinc-900/10 backdrop-blur-md border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] text-white/80 rounded-2xl p-8 w-full max-w-md mx-4">
                    <h1
                        className="font-bold text-3xl text-cyan-50 mb-2 text-center">
                        Create Account
                    </h1>
                    <p
                        className="font-pixelify text-sm text-neutral-300/90 mb-6 text-center">
                        Join the Manimate community
                    </p>

                    <div className="space-y-4">

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
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-cyan-50 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 pr-12 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                             text-cyan-50 placeholder-neutral-400/70 
                                             focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                             transition-all duration-200"
                                    placeholder="Enter your password"
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
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 pr-12 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg 
                                             text-cyan-50 placeholder-neutral-400/70 
                                             focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30
                                             transition-all duration-200"
                                    placeholder="Confirm your password"
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

                        {/* Create Account Button */}
                        <div className="mt-2 flex justify-center">
                            <GlassyButton
                                onClick={handleCreateAccount}
                                disabled={isLoading}
                                background='bg-[#1e1e1e]'
                            >
                                {isLoading ? 'Creating' : 'Create Account'}
                            </GlassyButton>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-300/90">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:underline"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

export default RegisterPage;