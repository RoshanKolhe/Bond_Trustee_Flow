import { useAuthContext } from 'src/auth/hooks';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';

export function useGetAssignedIssues() {
  const { user } = useAuthContext();
  const intermediaryId = user?.id;
  const URL = intermediaryId ? endpoints.assignedIssue.list('trustee', intermediaryId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  return {
    assignedIssuesData: data,
    assignedIssuesLoading: isLoading,
    assignedIssuesError: error,
    assignedIssuesValidating: isValidating,
    assignedIssuesEmpty: !isLoading && !data,
  };
}
