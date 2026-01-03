import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetBondFlowDocuments(status) {
    let URL = null;

    if (status) {
        URL = endpoints.bondFlowDocuments.documentList(status);
    }

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            documents: data?.requiredDocuments || [],
            documentsLoading: isLoading,
            documentsError: error,
            documentsValidating: isValidating,
            documentsEmpty: !isLoading && !data?.requiredDocuments.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}


