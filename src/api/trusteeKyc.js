import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetKycProgress(sessionId) {
  const URL = sessionId
    ? endpoints.trusteeKyc.kycProgress(sessionId)
    : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      kycProgress: data || null,
      hasProfile: Boolean(data?.currentProgress?.length),
      profileId: data?.profile?.id || null,
      kycProgressLoading: isLoading,
      kycProgressError: error,
      kycProgressValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKycSection(section, profileId, route = '') {
  const URL =
    section && profileId
      ? endpoints.trusteeKyc.getSection(section, profileId, route)
      : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      kycSectionData: data || null,
      kycSectionLoading: isLoading,
      kycSectionError: error,
      kycSectionValidating: isValidating,
      kycSectionEmpty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedValue;
}

