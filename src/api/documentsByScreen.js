import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetDocumentsByScreen(route) {
    const URL = route ? endpoints.documentByScreen(route) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            documents: data?.documents || [],
            documentsLoading: isLoading,
            documentsError: error,
            documentsValidating: isValidating,
            documentsEmpty: !isLoading && (!data?.documents || data?.documents?.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}