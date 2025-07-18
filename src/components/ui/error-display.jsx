import { AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorHandler } from "@/utils/errorHandler";

export function ErrorDisplay({ 
  error, 
  className, 
  showIcon = true, 
  customTitle = null 
}) {
  if (!error) return null;

  const formattedError = ErrorHandler.formatErrorMessage(error);
  
  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg border text-sm",
      formattedError.type === "warning" && "bg-amber-50 border-amber-200 text-amber-800",
      formattedError.type === "info" && "bg-blue-50 border-blue-200 text-blue-800",
      formattedError.type === "error" && "bg-red-50 border-red-200 text-red-800",
      className
    )}>
      {showIcon && (
        <>
          {formattedError.type === "warning" && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          {formattedError.type === "info" && <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          {formattedError.type === "error" && <AlertCircle className="w-4 h-4 mt-0.5 -me-2 flex-shrink-0" />}
        </>
      )}
      <div className="flex-1">
        {customTitle || formattedError.title ? (
          <p className="font-medium">{customTitle || formattedError.title}</p>
        ) : null}
        <p className={customTitle || formattedError.title ? "mt-1" : ""}>{formattedError.message}</p>
      </div>
    </div>
  );
}

export function ErrorMessage({ error, className }) {
  if (!error) return null;

  return (
    <div className={cn("flex items-center gap-1 text-red-500 text-sm mt-1", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M21 12A9 9 0 11 3 12a9 9 0 0118 0z"
        />
      </svg>
      {error}
    </div>
  );
}

export function SuccessMessage({ message, className }) {
  if (!message) return null;

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg border text-sm bg-green-50 border-green-200 text-green-800",
      className
    )}>
      <div className="flex-1">
        <p className="font-medium">Success</p>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
}

export function WarningMessage({ message, className }) {
  if (!message) return null;

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg border text-sm bg-amber-50 border-amber-200 text-amber-800",
      className
    )}>
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-medium">Warning</p>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
}


export function InfoMessage({ message, className }) {
  if (!message) return null;

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg border text-sm bg-blue-50 border-blue-200 text-blue-800",
      className
    )}>
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-medium">Information</p>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
} 