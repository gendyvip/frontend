import { toast } from "sonner";

export class ErrorHandler {
    static handleApiError(error, context = "general", options = {}) {
        const { showToast = true, customMessage } = options;

        let errorMessage = customMessage || "An error occurred. Please try again.";
        let errorType = "error";

        if (error.message) {
            const message = error.message.toLowerCase();

            if (message.includes("email or password is incorrect")) {
                errorMessage = "Invalid email or password. Please check your credentials.";
            } else if (message.includes("authentication required")) {
                errorMessage = "Please log in again to continue.";
                errorType = "warning";
            } else if (message.includes("unauthorized")) {
                errorMessage = "You don't have permission to perform this action.";
                errorType = "warning";
            }

            else if (message.includes("blocked")) {
                errorMessage = "Your account has been blocked. Please contact support for assistance.";
                errorType = "warning";
            } else if (message.includes("rejected")) {
                errorMessage = "Your documents were rejected. Please contact support for assistance.";
                errorType = "warning";
            } else if (message.includes("under review") || message.includes("pending")) {
                errorMessage = "Your documents are still under review. Please wait for admin approval.";
                errorType = "info";
            } else if (message.includes("admin verification")) {
                errorMessage = "Your profile is pending admin verification. Please wait for approval.";
                errorType = "info";
            }

            else if (message.includes("network") || message.includes("fetch")) {
                errorMessage = "Network error. Please check your internet connection and try again.";
            } else if (message.includes("server") || message.includes("500")) {
                errorMessage = "Server error. Please try again later.";
            }

            else if (message.includes("password is incorrect")) {
                errorMessage = "Current password is incorrect.";
            } else if (message.includes("passwords do not match")) {
                errorMessage = "New passwords do not match.";
            } else if (message.includes("invalid or expired otp")) {
                errorMessage = "Invalid or expired OTP. Please try again.";
            } else if (message.includes("otp not verified")) {
                errorMessage = "OTP not verified or expired. Please verify your OTP first.";
            }

            else if (message.includes("email not found")) {
                errorMessage = "Email not found. Please check your email address.";
            } else if (message.includes("no email found in session")) {
                errorMessage = "Session expired. Please start the password reset process again.";
                errorType = "warning";
            } else if (message.includes("failed to send reset instructions")) {
                errorMessage = "Failed to send reset instructions. Please try again.";
            } else if (message.includes("failed to verify otp")) {
                errorMessage = "Failed to verify OTP. Please check the code and try again.";
            } else if (message.includes("failed to resend otp")) {
                errorMessage = "Failed to resend OTP. Please try again.";
            } else if (message.includes("failed to confirm password")) {
                errorMessage = "Failed to confirm password. Please try again.";
            }

            else if (message.includes("front id card image is required")) {
                errorMessage = "Front ID card image is required. Please upload the front side of your national ID.";
            } else if (message.includes("back id card image is required")) {
                errorMessage = "Back ID card image is required. Please upload the back side of your national ID.";
            } else if (message.includes("work id image is required")) {
                errorMessage = "Work ID image is required. Please upload your work ID card.";
            } else if (message.includes("email is already registered")) {
                errorMessage = "Email is already registered. Please use a different email address.";
                errorType = "warning";
            } else if (message.includes("phone number is already registered")) {
                errorMessage = "Phone number is already registered. Please use a different phone number.";
                errorType = "warning";
            } else if (message.includes("national id is already registered")) {
                errorMessage = "National ID is already registered. Please check your ID number.";
                errorType = "warning";
            } else if (message.includes("already exists")) {
                errorMessage = error.message;
                errorType = "warning";
            } else if (message.includes("failed to create account") || message.includes("failed to create user")) {
                errorMessage = "Failed to create account. Please check your information and try again.";
            } else if (message.includes("invalid data format")) {
                errorMessage = "Invalid data format. Please check your information and try again.";
            } else if (message.includes("account already exists")) {
                errorMessage = "Account already exists. Please check your information.";
                errorType = "warning";
            }

            else if (message.includes("advertising request with this email already exists")) {
                errorMessage = "An advertising request with this email already exists. Please use a different email or contact us directly.";
                errorType = "warning";
            } else if (message.includes("advertising request with this phone number already exists")) {
                errorMessage = "An advertising request with this phone number already exists. Please use a different phone number or contact us directly.";
                errorType = "warning";
            } else if (message.includes("advertising request already exists")) {
                errorMessage = "An advertising request already exists for this contact information. Please contact us directly for updates.";
                errorType = "warning";
            } else if (message.includes("failed to submit advertising request")) {
                errorMessage = "Failed to submit advertising request. Please check your information and try again.";
            } else if (message.includes("please check your information")) {
                errorMessage = "Please check your information. Some fields may be invalid or missing.";
            } else if (message.includes("please fill in all required fields")) {
                errorMessage = "Please fill in all required fields.";
            } else if (message.includes("please check the format")) {
                errorMessage = "Please check the format of your email or phone number.";
            } else if (message.includes("please enter a valid email address")) {
                errorMessage = "Please enter a valid email address.";
            } else if (message.includes("please enter a valid phone number")) {
                errorMessage = "Please enter a valid phone number.";
            } else if (message.includes("please provide a valid message")) {
                errorMessage = "Please provide a valid message (minimum 10 characters, maximum 2500 characters).";
            } else if (message.includes("too many requests")) {
                errorMessage = "Too many requests. Please wait a few minutes before trying again.";
                errorType = "warning";
            } else if (message.includes("service maintenance")) {
                errorMessage = "Service maintenance in progress. Please try again later.";
                errorType = "info";
            } else if (message.includes("service temporarily unavailable")) {
                errorMessage = "Service temporarily unavailable. Please try again in a few minutes.";
                errorType = "info";
            } else if (message.includes("service not found")) {
                errorMessage = "Service not found. Please try again later or contact support.";
                errorType = "info";
            }

            else if (message.includes("user not found")) {
                errorMessage = "User not found. Please check your email address.";
            }

            else {
                errorMessage = error.message;
            }
        }

        if (showToast) {
            if (errorType === "warning") {
                toast.warning(errorMessage);
            } else if (errorType === "info") {
                toast.info(errorMessage);
            } else {
                toast.error(errorMessage);
            }
        }

        return {
            message: errorMessage,
            type: errorType,
            originalError: error
        };
    }

    static handleValidationError(errors, context = "form") {
        const errorMessages = Object.values(errors);
        if (errorMessages.length > 0) {
            toast.error(errorMessages[0]);
        }
        return errorMessages;
    }

    static handleSuccess(message, options = {}) {
        toast.success(message, options);
    }

    static handleWarning(message, options = {}) {
        toast.warning(message, options);
    }

    static handleInfo(message, options = {}) {
        toast.info(message, options);
    }

    static getErrorType(message) {
        if (!message) return "error";

        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("blocked") || lowerMessage.includes("rejected") || lowerMessage.includes("session expired") ||
            lowerMessage.includes("already registered") || lowerMessage.includes("already exists") || lowerMessage.includes("account already exists")) {
            return "warning";
        } else if (lowerMessage.includes("under review") || lowerMessage.includes("pending") || lowerMessage.includes("admin verification")) {
            return "info";
        }

        return "error";
    }

    static formatErrorMessage(message) {
        const errorType = this.getErrorType(message);

        let title = "";
        if (errorType === "warning") {
            title = "Account Status";
        } else if (errorType === "info") {
            title = "Verification Required";
        }

        return {
            title,
            message,
            type: errorType
        };
    }

    static handleResetPasswordError(error, step = "request") {
        const context = `reset-password-${step}`;
        return this.handleApiError(error, context);
    }

    static handleOtpError(error, action = "verify") {
        const context = `otp-${action}`;
        return this.handleApiError(error, context);
    }

    static handleSignupError(error, step = "form") {
        const context = `signup-${step}`;
        return this.handleApiError(error, context);
    }

    static handleAdvertiseError(error, step = "form") {
        const context = `advertise-${step}`;
        return this.handleApiError(error, context);
    }

    static handleAdvertiseSuccess(response, step = "submission") {
        let message = "Advertising request submitted successfully!";

        // Handle different success scenarios
        if (response && response.message) {
            message = response.message;
        } else if (response && response.data && response.data.message) {
            message = response.data.message;
        } else if (step === "submission") {
            message = "Advertising request submitted successfully! We'll get back to you within 24-48 hours.";
        }

        this.handleSuccess(message);
        return { message, type: "success", response };
    }
}

export const HTTP_ERROR_MESSAGES = {
    400: "Bad request. Please check your input and try again.",
    401: "Authentication required. Please log in again.",
    403: "Access denied. You don't have permission to perform this action.",
    404: "Resource not found. Please check your request.",
    409: "Conflict. The resource already exists.",
    422: "Validation error. Please check your input.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    502: "Bad gateway. Please try again later.",
    503: "Service unavailable. Please try again later.",
    504: "Gateway timeout. Please try again later."
};

export const getHttpErrorMessage = (status, customMessage = null) => {
    if (customMessage) return customMessage;
    return HTTP_ERROR_MESSAGES[status] || "An unexpected error occurred.";
}; 