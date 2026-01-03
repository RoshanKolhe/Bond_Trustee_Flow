import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetInvestorCategories() {
    let URL = endpoints.investorCategories.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            investorCtegories: data || [],
            investorCtegoriesLoading: isLoading,
            investorCtegoriesError: error,
            investorCtegoriesValidating: isValidating,
            investorCtegoriesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}