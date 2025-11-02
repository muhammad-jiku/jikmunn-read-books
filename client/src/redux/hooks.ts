// Use throughout the app instead of plain `useDispatch` and `useSelector`
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
// This is a type-safe selector hook for Redux
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
