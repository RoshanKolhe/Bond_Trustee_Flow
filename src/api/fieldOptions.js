import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetChargeTypes() {
    let URL = endpoints.fieldOptions.chargeTypes;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            chargeTypes: data || [],
            chargeTypesLoading: isLoading,
            chargeTypesError: error,
            chargeTypesValidating: isValidating,
            chargeTypesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------------

export function useGetCollateralTypes() {
    let URL = endpoints.fieldOptions.collateralTypes;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            collateralTypes: data || [],
            collateralTypesLoading: isLoading,
            collateralTypesError: error,
            collateralTypesValidating: isValidating,
            collateralTypesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------------

export function useGetOwnershipTypes() {
    let URL = endpoints.fieldOptions.ownershipTypes;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            ownershipTypes: data || [],
            ownershipTypesLoading: isLoading,
            ownershipTypesError: error,
            ownershipTypesValidating: isValidating,
            ownershipTypesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}