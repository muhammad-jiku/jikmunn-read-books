import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import bookReducer from './features/bookSlice';
import cartReducer from './features/cartSlice';
import categoryReducer from './features/categorySlice';
import ebookReducer from './features/ebookSlice';
import orderReducer from './features/orderSlice';
import profileReducer from './features/profileSlice';
import reviewsReducer from './features/reviewsSlice';
import themeReducer from './features/themeSlice';
import wishlistReducer from './features/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    categories: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    profile: profileReducer,
    reviews: reviewsReducer,
    theme: themeReducer,
    ebook: ebookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
