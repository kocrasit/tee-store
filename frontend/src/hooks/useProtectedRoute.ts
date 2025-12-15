'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

type AllowedRole = 'customer' | 'influencer' | 'designer' | 'admin';

interface UseProtectedRouteOptions {
  /** İzin verilen roller. Boş array = herhangi bir authenticated user yeterli */
  allowedRoles?: AllowedRole[];
  /** Yetkisiz kullanıcıların yönlendirileceği sayfa */
  redirectTo?: string;
}

/**
 * Protected route hook - sayfa yüklendiğinde auth kontrolü yapar
 * @returns { isLoading, isAuthorized, user }
 */
export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { allowedRoles = [], redirectTo = '/auth/login' } = options;

  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Hydration bekleniyor (zustand persist)
    const timeout = setTimeout(() => {
      const storage = localStorage.getItem('auth-storage');
      const parsed = storage ? JSON.parse(storage) : null;
      const currentUser = parsed?.state?.user;
      const isAuth = parsed?.state?.isAuthenticated;

      if (!isAuth || !currentUser) {
        router.replace(redirectTo);
        return;
      }

      // Rol kontrolü
      if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
        // Yetkisiz rol - ana sayfaya veya kendi dashboarduna yönlendir
        router.replace('/');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [router, redirectTo, allowedRoles]);

  const isAuthorized =
    isAuthenticated &&
    user &&
    (allowedRoles.length === 0 || allowedRoles.includes(user.role));

  return {
    isLoading: !isAuthenticated && typeof window !== 'undefined',
    isAuthorized,
    user,
  };
}

/**
 * Admin sayfaları için kısayol
 */
export function useAdminRoute() {
  return useProtectedRoute({
    allowedRoles: ['admin'],
    redirectTo: '/auth/login',
  });
}

/**
 * Influencer sayfaları için kısayol
 */
export function useInfluencerRoute() {
  return useProtectedRoute({
    allowedRoles: ['influencer', 'admin'],
    redirectTo: '/auth/login',
  });
}

/**
 * Authenticated user gerektiren sayfalar için kısayol (rol fark etmez)
 */
export function useAuthRoute() {
  return useProtectedRoute({
    allowedRoles: [],
    redirectTo: '/auth/login',
  });
}


