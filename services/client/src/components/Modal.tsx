import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const scrollPosition = useRef(0);

  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and active element
      scrollPosition.current = window.scrollY;
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll and compensate for scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Trigger enter animation
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      // Trigger exit animation
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle animation end
  const handleAnimationEnd = useCallback(() => {
    if (!isOpen) {
      setShouldRender(false);
      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Restore focus to previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element when modal opens
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      modal.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, []);

  if (!shouldRender) return null;

  // Use portal to render modal at the end of the document body
  return createPortal(
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-in-out
        ${isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent backdrop-blur-none'}
      `}
      onClick={handleBackdropClick}
      onTransitionEnd={handleAnimationEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`
          bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]}
          max-h-[90vh] overflow-hidden border border-gray-200
          transform transition-all duration-300 ease-in-out
          ${isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
          }
        `}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 
            id="modal-title"
            className="text-xl font-bold text-gray-900"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}