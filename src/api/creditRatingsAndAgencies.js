import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCreditRatingAgencies() {
    let URL = endpoints.creditRatingAgencies.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            creditRatingAgencies: data || [],
            creditRatingAgenciesLoading: isLoading,
            creditRatingAgenciesError: error,
            creditRatingAgenciesValidating: isValidating,
            creditRatingAgenciesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCreditRatings() {
    let URL = endpoints.creditRatings.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            creditRatings: data || [],
            creditRatingsLoading: isLoading,
            creditRatingsError: error,
            creditRatingsValidating: isValidating,
            creditRatingsEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
