'use client'

import Image from "next/image";
import React, { useState } from "react";
import { validatePassword } from "@/services/passwordservice"; // Import service
//set react states
export default function Home() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function validatePasswordInput(pwd: string, confirmPwd: string) {
        let validationErrors: string[] = [];
        const specialChars = "!£$^*#";
        const specialCharRegex = new RegExp(`[${specialChars}]`);
        const numberRegex = /\d/;

        if (pwd.length < 7 || pwd.length > 14) {
            validationErrors.push("Password must be between 7-14 characters.");
        }
        if (!numberRegex.test(pwd)) {
            validationErrors.push("Password must contain at least one number.");
        }
        if (!specialCharRegex.test(pwd)) {
            validationErrors.push(`Password must contain at least one special character (${specialChars}).`);
        }
        if (/[^a-zA-Z0-9!£$^*#]/.test(pwd)) {
            validationErrors.push("Password contains invalid characters.");
        }
        if (confirmPwd && pwd !== confirmPwd) {
            validationErrors.push("Passwords do not match.");
        }

        setErrors(validationErrors);
        setIsValid(validationErrors.length === 0);
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePasswordInput(newPassword, confirmPassword);
    }

    function handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        validatePasswordInput(password, newConfirmPassword);
    }

    async function handleFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        setErrors([]); // Clear previous errors

        const result = await validatePassword(password); // Call backend API

        if (!result.success) {
            setErrors([result.message || "Invalid password."]);
        } else {
            console.log("Password successfully validated!"); //proceed to send email to user to confirm password change/other actions
        }

        setIsSubmitting(false);
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image src="/strive-logo.jpg" alt="Strive Gaming" height="110" width="110" className="mx-auto"/>
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
                        data-testid="title">
                        Change your password
                    </h2>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6">
                        {/* New Password Field */}
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium leading-6 text-gray-900">
                                New password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    data-testid="password"
                                    value={password}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pr-10"
                                    onChange={handlePasswordChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁" : "🙈"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirm" className="block text-sm font-medium leading-6 text-gray-900">
                                Re-type new password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="confirm"
                                    name="confirm"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pr-10"
                                    onChange={handleConfirmPasswordChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "👁" : "🙈"}
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Error Messages using red font */}
                        {errors.length > 0 && (
                            <div className="text-red-500 text-sm">
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                className={`flex w-full justify-center px-4 py-2 rounded-md text-white ${
                                    isValid && !isSubmitting
                                        ? "bg-gray-900 hover:bg-gray-700 active:bg-gray-800"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                                disabled={!isValid || isSubmitting}
                                onClick={handleFormSubmit}
                            >
                                {isSubmitting ? "Validating..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Requirements */}
                <div className="mx-auto text-xs mt-8">
                    <ol>
                        <li>Password must be between 7-14 characters in length</li>
                        <li>Password must contain at least 1 number and one special character</li>
                        <li>Password does not contain special characters other than: <code>!£$^*#</code></li>
                        <li>Both passwords must be identical</li>
                    </ol>
                </div>
            </div>
        </>
    );
}
