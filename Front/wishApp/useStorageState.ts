import { useEffect, useCallback, useReducer } from 'react';
import { Platform } from 'react-native';
import { storageSingleton } from './storageSingleton';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null],
    ): UseStateHook<T> {
    return useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
    }

    export function useStorageState(key: string): UseStateHook<string> {
    const [state, setState] = useAsyncState<string>();

    // Get
    useEffect(() => {
    const loadValue = async () => {
        if (Platform.OS === 'web') {
        try {
            if (typeof localStorage !== 'undefined') {
            setState(localStorage.getItem(key));
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
        } else {
        try {
            const value = await storageSingleton.getItem(key); 
            setState(value);
        } catch (e) {
            console.error("Erreur lors du chargement du token:", e);
        }
        }
    };

    loadValue();
    }, [key]);


    // Set
    const setValue = useCallback(
        (value: string | null) => {
        setState(value);

        if (Platform.OS === 'web') {
            try {
            if (typeof localStorage !== 'undefined') {
                if (value === null) {
                localStorage.removeItem(key);
                } else {
                localStorage.setItem(key, value);
                }
            }
            } catch (e) {
            console.error('Local storage is unavailable:', e);
            }
        } else {
            storageSingleton.setItem(key, value);
        }
        },
        [key]
    );

    return [state, setValue];
}