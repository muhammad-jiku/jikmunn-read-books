import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='min-h-[400px] flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
        <p className='text-gray-600 mb-8'>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to='/'
          className='inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors'
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
