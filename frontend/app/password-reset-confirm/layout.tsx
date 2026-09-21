import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function PasswordResetConfirmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
