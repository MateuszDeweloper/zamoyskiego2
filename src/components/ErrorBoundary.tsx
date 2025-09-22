'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Można użyć custom fallback jeśli jest podany
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Domyślny error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center p-8">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <HiOutlineExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Wystąpił błąd
            </h3>
            <p className="text-gray-600 mb-4">
              Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#d7c28d] hover:bg-[#c4a76a] text-white px-6 py-2 rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7c28d] focus:ring-offset-2"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
