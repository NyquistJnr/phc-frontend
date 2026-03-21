import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react'; // Assuming NextAuth based on your snippet

const BASE_URL = '/api/v1/auth';

export const useAuth = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Helper for headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(session?.user?.accessToken && { 
      Authorization: `Bearer ${session.user.accessToken}` 
    }),
  });

  // --- Login Mutation ---
  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    onSuccess: (data) => {
      // Logic to handle session or redirecting can go here
      console.log('Login successful', data);
    },
  });

  // --- Forgot Password Mutation ---
  const forgotPasswordMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${BASE_URL}/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      return res.json();
    },
  });

  // --- Refresh Token Mutation ---
  const refreshMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${BASE_URL}/refresh/`, {
        method: 'POST',
        headers: getHeaders(), // In case the refresh endpoint requires the old bearer
        body: JSON.stringify(payload), // e.g., { refresh: "string" }
      });
      if (!res.ok) throw new Error('Token refresh failed');
      return res.json();
    },
  });

  return {
    login: loginMutation,
    forgotPassword: forgotPasswordMutation,
    refreshToken: refreshMutation,
  };
};