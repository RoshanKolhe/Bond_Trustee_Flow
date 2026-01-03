import { useGetBondApplications } from 'src/api/bondApplications';
import MainFile from '../borrowing/main';
import FinancialDetails from '../financial-details/financial-details';
import IsinActivation from '../isin-activation';
import LaunchIssue from '../launch-issue';
import MyBondNewIssue from '../mybond-new-issue';
import MyBondStart from '../mybond-start';
import MyBondStar from '../mybond-start';
import PreliminaryBondRequirements from '../preliminary-bond-requirements';
import BondsApplicationListView from './bond-application-list-view';
import { useTable } from 'src/components/table';
import { buildFilter } from 'src/utils/filters';
import { useState } from 'react';

const defaultFilters = {
  name: '',
  email: '',
  role: [],
  status: 'all',
};

export default function MyBondCreate() {

  const table = useTable();
  const [filters, setFilters] = useState(defaultFilters);

  const filter = buildFilter({
    page: table.page,
    rowsPerPage: table.rowsPerPage,
    order: table.order,
    orderBy: table.orderBy,

    validSortFields: ['id'],

    searchTextValue: filters.name?.trim() || undefined,
  })

  const filterList = encodeURIComponent(JSON.stringify(filter));

  const { bondApplications, bondApplicationsLoading, count } = useGetBondApplications(filterList);

  const isInitialLoad =
    !filters.name &&
    filters.status === 'all';

  return (
    <>
      {/* <MyBondStart /> */}

      {
        bondApplications.length === 0 && !bondApplicationsLoading && isInitialLoad ? (<MyBondStart />) : (<BondsApplicationListView bondsApplication={bondApplications} bondApplicationsLoading={bondApplicationsLoading} count={count}
          table={table}
          filters={filters}
          setFilters={setFilters} />
        )
      }
    </>
  );
}
