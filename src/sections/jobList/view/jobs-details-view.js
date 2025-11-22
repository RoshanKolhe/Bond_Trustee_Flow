import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// _mock
import { _jobs, JOB_PUBLISH_OPTIONS, JOB_DETAILS_TABS } from 'src/_mock';
// components
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
//
import { mockJob } from 'src/sections/job/mockData';
import JobsDetailsToolbar from '../jobs-details-toolbar';
import JobsDetailsContent from '../jobs-details-content';


// ----------------------------------------------------------------------

export default function JobsDetailsView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;
  console.log('id', id )

  const currentJob = mockJob.filter((job) => job._id.$oid === id)[0];

  const [publish, setPublish] = useState(currentJob?.publish);

  const [currentTab, setCurrentTab] = useState('title');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {JOB_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'candidates' ? (
              <Label variant="filled">{currentJob?.candidates.length}</Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <JobsDetailsToolbar
        backLink={paths.dashboard.job.root}
        // editLink={paths.dashboard.job.edit(`${currentJob?.id}`)}
        // liveLink="#"
        // publish={publish || ''}
        // onChangePublish={handleChangePublish}
        // publishOptions={JOB_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {currentTab === 'title' && <JobsDetailsContent job={currentJob} />}
       {/* {mockJob.map((job) => (
                <JobDetailsContent
                  key={job.id}
                  job={job}
                />
              ))} */}

    
    </Container>
  );
}
