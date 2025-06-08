'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          header: 'bg-gradient-to-r from-red-500 to-red-600',
          confirmButton: 'bg-red-500 hover:bg-red-600',
          icon: <AlertTriangle size={24} className="text-red-500" />
        };
      case 'info':
        return {
          header: 'bg-gradient-to-r from-blue-500 to-blue-600',
          confirmButton: 'bg-blue-500 hover:bg-blue-600',
          icon: <AlertTriangle size={24} className="text-blue-500" />
        };
      default: // warning
        return {
          header: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600',
          icon: <AlertTriangle size={24} className="text-yellow-500" />
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${styles.header} text-white p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {styles.icon}
                  <h2 className="text-xl font-bold">{title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6 leading-relaxed">
                {message}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="
                    flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 
                    text-gray-700 rounded-lg font-medium transition-colors
                    touch-manipulation min-h-[48px]
                  "
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`
                    flex-1 px-4 py-3 text-white rounded-lg font-medium 
                    transition-colors touch-manipulation min-h-[48px]
                    ${styles.confirmButton}
                  `}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}