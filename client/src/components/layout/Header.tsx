import { default as ThemeToggle } from '@components/theme/ThemeToggle';
import type { User } from '@redux/features/authSlice';
import { selectAuth } from '@redux/features/authSlice';
import { useAppSelector } from '@redux/hooks';
import { Link } from 'react-router-dom';

export const Header = () => {
  const auth = useAppSelector(selectAuth);
  const user = auth?.user as User | null;

  return (
    <header className='bg-background border-b border-border'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='text-2xl font-bold text-primary'>
            Read Books
          </Link>

          <nav className='hidden md:flex items-center gap-6'>
            <Link to='/books' className='text-foreground/70 hover:text-primary transition-colors'>
              Books
            </Link>
            <Link to='/authors' className='text-foreground/70 hover:text-primary transition-colors'>
              Authors
            </Link>
            <Link
              to='/categories'
              className='text-foreground/70 hover:text-primary transition-colors'
            >
              Categories
            </Link>
          </nav>

          <div className='flex items-center gap-4'>
            <ThemeToggle />

            {user ? (
              <>
                <Link
                  to='/cart'
                  className='text-foreground/70 hover:text-primary transition-colors'
                >
                  Cart
                </Link>
                <Link
                  to='/profile'
                  className='text-foreground/70 hover:text-primary transition-colors'
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to='/auth/login'
                  className='text-foreground/70 hover:text-primary transition-colors'
                >
                  Login
                </Link>
                <Link
                  to='/auth/register'
                  className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors'
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
