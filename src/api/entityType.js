import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import { identity } from 'lodash';

// ----------------------------------------------------------------------

export function useGetEntityTypes() {
    const URL = endpoints.entityType.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            EntityTypes: data || [],
            EntityTypesLoading: isLoading,
            EntityTypesError: error,
            EntityTypesValidating: isValidating,
            EntityTypesEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetEntityType(id) {
    const URL = id ? endpoints.entityType.details(id) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            entityType: data,
            entityTypeLoading: isLoading,
            entityTypeError: error,
            entityTypeValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilterEntityTypes(queryString) {
    const URL = queryString ? endpoints.entityType.filterList(queryString) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
        keepPreviousData: true,
    });

    const memoizedValue = useMemo(
        () => ({
            filteredEntityTypes: data || [],
            filterLoading: isLoading,
            filterError: error,
            filterValidating: isValidating,
            filterEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}


export function useGetTrusteeEntityTypes() {
    const URL = endpoints.trusteeEntityType.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            EntityTypes: data || [],
            EntityTypesLoading: isLoading,
            EntityTypesError: error,
            EntityTypesValidating: isValidating,
            EntityTypesEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}