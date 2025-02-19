export async function validatePassword(password: string): Promise<{ success: boolean; message?: string }> {
    try {
        const response = await fetch("http://localhost:5291/Password/change", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        if (response.status === 200) {
            return { success: true };
        } else if (response.status === 400) {
            return { success: false, message: "Password is too common" };
        } else {
            return { success: false, message: `Unexpected error (Status: ${response.status})` };
        }
    } catch (error) {
        console.error("Error validating password:", error);
        return { success: false, message: "Network error. Please try again." };
    }
}
