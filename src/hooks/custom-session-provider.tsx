import dayjs from 'dayjs';
import { Session } from 'next-auth';
import { SessionProvider, signIn } from 'next-auth/react';
import { useEffect } from 'react';

interface CustomSessionProviderProps {
  session: Session;
  children: React.ReactNode;
}

export const CustomSessionProvider = ({ session, children }: CustomSessionProviderProps) => {
  //Automatically redirect to the login page after a session expires or after 24 days
  useEffect(() => {
    if (!session) return () => {};
    const timeout = setTimeout(signIn, Math.min(dayjs(session.expires).diff(), 2147483647));
    return () => clearTimeout(timeout);
  }, [session]);

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
};