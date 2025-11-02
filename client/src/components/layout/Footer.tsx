import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* About */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>About Read Books</h3>
            <p className='text-gray-400'>
              Your one-stop destination for all kinds of books. Read, learn, and grow with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/books' className='text-gray-400 hover:text-white'>
                  Books
                </Link>
              </li>
              <li>
                <Link to='/authors' className='text-gray-400 hover:text-white'>
                  Authors
                </Link>
              </li>
              <li>
                <Link to='/categories' className='text-gray-400 hover:text-white'>
                  Categories
                </Link>
              </li>
              <li>
                <Link to='/blog' className='text-gray-400 hover:text-white'>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Customer Service</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/contact' className='text-gray-400 hover:text-white'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to='/shipping' className='text-gray-400 hover:text-white'>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to='/returns' className='text-gray-400 hover:text-white'>
                  Returns
                </Link>
              </li>
              <li>
                <Link to='/faq' className='text-gray-400 hover:text-white'>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Newsletter</h3>
            <p className='text-gray-400 mb-4'>
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <form className='flex gap-2'>
              <input
                type='email'
                placeholder='Your email'
                className='grow px-4 py-2 rounded-lg bg-gray-800 text-white'
              />
              <button
                type='submit'
                className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-8 pt-8 border-t border-gray-800 text-center text-gray-400'>
          <p>© 2025 Read Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
