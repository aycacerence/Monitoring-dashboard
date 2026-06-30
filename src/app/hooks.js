import { useDispatch, useSelector } from 'react-redux';

/**
 * Redux action ve thunk'larini componentlerden calistirmak icin kullanilir.
 * @returns {import('@reduxjs/toolkit').ThunkDispatch<ReturnType<typeof import('./store.js').store.getState>, unknown, import('@reduxjs/toolkit').UnknownAction> & import('redux').Dispatch}
 */
export const useAppDispatch = () => useDispatch();

/**
 * Redux store uzerinden veri okumak icin kullanilir.
 * @template Selected
 * @param {(state: ReturnType<typeof import('./store.js').store.getState>) => Selected} selector
 * @returns {Selected}
 */
export const useAppSelector = (selector) => useSelector(selector);
