import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetKycProgress(sessionId) {
  const URL = sessionId ? endpoints.trusteeKyc.kycProgress(sessionId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  useEffect(() => {
    if (data?.profile?.id) {
      sessionStorage.setItem('trustee_user_id', data.profile.usersId);
    }
  }, [data]);

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

export function useGetKycSection(section, route = '') {
  const profileId = sessionStorage.getItem('trustee_user_id'); // ⬅️ get it directly

  const URL =
    section && profileId ? endpoints.trusteeKyc.getSection(section, profileId, route) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    kycSectionData: data || null,
    kycSectionLoading: isLoading,
    kycSectionError: error,
    kycSectionValidating: isValidating,
    kycSectionEmpty: !isLoading && !data,
  };
}

export function useGetDetails() {
  const profileId = sessionStorage.getItem('trustee_user_id'); // ⬅️ Directly read

  const URL = profileId
    ? endpoints.trusteeKyc.getSection('trustee_bank_details', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDetails = () => {
    mutate();
  };

  return {
    Details: data?.data || null,
    rawData: data || null,
    Loading: isLoading,
    Error: error,
    Validating: isValidating,
    Empty: !isLoading && !data?.data?.length,
    refreshDetails,
  };
}

export function useGetSignatories() {
  const profileId = sessionStorage.getItem('trustee_user_id');

  const URL = profileId
    ? endpoints.trusteeKyc.getSection('trustee_authorized_signatories', profileId, '')
    : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshSignatories = () => {
    mutate();
  };

  return {
    signatories: data?.data || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.data?.length,
    refreshSignatories,
  };
}

export function useGetDocuments(trusteeId) {
  const URL = endpoints.trusteeKyc.getDocuments;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const refreshDocuments = () => {
    mutate();
  };

  return {
    documents: data?.documents || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && (!data?.documents || data.documents.length === 0),
    refreshDocuments,
  };
}

export function useGetBankDetails() {
  const URL = endpoints.trusteeKyc.getBankDetails;

  const { data, error, isLoading, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const refreshBankDetail = () => {
    mutate();
  };

  return {
    bankDetails: data?.bankDetails || [],
    loading: isLoading,
    error,
    validating: isValidating,
    empty: !isLoading && !data?.bankDetails?.length,
    raw: data,
    refreshBankDetail,
  };
}

export function useGetBankDetail(id) {
  const URL = id ? endpoints.trusteeKyc.details(id) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    bank: data?.bankDetails || null,
    loading: isLoading,
    error,
    validating: isValidating,
    refreshBank: () => mutate(),
  };
}


export default function useGetProfileData() {
  const URL = endpoints.trusteeKyc.getProfileData;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  return {
    profileData: data?.profile || null,
    loading: isLoading,
    error,
    validating: isValidating,
  };
}
