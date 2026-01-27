import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------

export function useGetAddressDetails() {
    const URL = endpoints.addressDetails;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            registeredAddress: data?.registeredAddress || null,
            correspondenceAddress: data?.correspondenceAddress || null,
            addressDetailsLoading: isLoading,
            addressDetailsError: error,
            addressDetailsValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}