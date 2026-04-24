'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export default function Modal({ children, onClose, className = '' }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ✅ фикс setState
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div
        className={`${css.modal} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}