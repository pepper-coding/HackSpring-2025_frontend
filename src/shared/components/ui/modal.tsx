import { X, AlertCircle, Check } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  type?: "default" | "success" | "warning" | "error";
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  type = "default",
  width = "md",
}: ModalProps) => {
  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const typeStyles = {
    default: { icon: null, headerClass: "bg-gray-900" },
    success: {
      icon: <Check className="text-green-400 mr-2" size={20} />,
      headerClass: "bg-gray-900 border-l-4 border-green-500",
    },
    warning: {
      icon: <AlertCircle className="text-amber-400 mr-2" size={20} />,
      headerClass: "bg-gray-900 border-l-4 border-amber-500",
    },
    error: {
      icon: <AlertCircle className="text-red-400 mr-2" size={20} />,
      headerClass: "bg-gray-900 border-l-4 border-red-500",
    },
  };

  const currentTypeStyle = typeStyles[type] || typeStyles.default;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-70 flex items-center justify-center p-4">
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full ${widthClasses[width]} z-10 overflow-hidden transform transition-all`}
      >
        <div
          className={`flex items-center justify-between px-4 py-3 ${currentTypeStyle.headerClass} border-b border-gray-800`}
        >
          <h3 className="text-lg font-medium text-gray-100 flex items-center">
            {currentTypeStyle.icon}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 text-gray-300">{children}</div>

        {footer && (
          <div className="px-4 py-3 bg-gray-950 border-t border-gray-800 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
