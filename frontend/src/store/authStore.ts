import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "../types";

// ─── Mock User Data ───────────────────────────────────────────────────────────
// Sesuaikan dengan data diri Anda
const MOCK_USER: User = {
  nim: "24090110",
  name: "Muhammad Lutfi Syauqi Annafal",
  kelas: "TI-4D",
  prodi: "D-4 Teknik Informatika",
};

// Kredensial login (ubah sesuai NIM dan password yang diinginkan)
const MOCK_CREDENTIALS = {
  nim: "24090110",
  password: "password123",
};

// ─── Auth Store ───────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (
        nim: string,
        password: string
      ): Promise<{ success: boolean; message: string }> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (!nim.trim() || !password.trim()) {
          return { success: false, message: "NIM dan Password wajib diisi." };
        }

        if (
          nim.trim() === MOCK_CREDENTIALS.nim &&
          password === MOCK_CREDENTIALS.password
        ) {
          set({ user: MOCK_USER, isAuthenticated: true });
          return { success: true, message: "Login berhasil!" };
        }

        return {
          success: false,
          message: "NIM atau Password tidak valid.",
        };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "event-management-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
