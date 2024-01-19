import { Database, DatabaseInstance } from '@linode/api-v4/lib/databases/types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';

import { Box } from 'src/components/Box';
import { CircleProgress } from 'src/components/CircleProgress';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { TooltipIcon } from 'src/components/TooltipIcon';
import { Typography } from 'src/components/Typography';
import { useDatabaseTypesQuery } from 'src/queries/databases';
import { useRegionsQuery } from 'src/queries/regions';
import { formatStorageUnits } from 'src/utilities/formatStorageUnits';
import { convertMegabytesTo } from 'src/utilities/unitConversions';

import {
  databaseEngineMap,
  databaseStatusMap,
} from '../../DatabaseLanding/DatabaseRow';
import {
  StyledStatusSpan,
  StyledSummaryBox,
  StyledSummaryTextBox,
  StyledSummaryTextTypography,
  StyledTitleTypography,
} from './DatabaseScaleUpCurrentConfiguration.style';

interface Props {
  database: Database;
}

export const getDatabaseVersionNumber = (
  version: DatabaseInstance['version']
) => version.split('/')[1];

export const DatabaseScaleUpCurrentConfiguration = ({ database }: Props) => {
  const {
    data: types,
    error: typesError,
    isLoading: typesLoading,
  } = useDatabaseTypesQuery();
  const theme = useTheme();
  const { data: regions } = useRegionsQuery();

  const region = regions?.find((r) => r.id === database.region);

  const type = types?.find((type) => type.id === database?.type);

  if (typesLoading) {
    return <CircleProgress />;
  }

  if (typesError) {
    return <ErrorState errorText="An unexpected error occurred." />;
  }

  if (!database || !type) {
    return null;
  }

  const configuration =
    database.cluster_size === 1
      ? 'Primary'
      : `Primary +${database.cluster_size - 1} replicas`;

  const sxTooltipIcon = {
    marginLeft: 0.5,
    padding: 0,
  };

  const STORAGE_COPY =
    'The total disk size is smaller than the selected plan capacity due to the OS overhead.';

  return (
    <>
      <StyledTitleTypography variant="h3">
        Current Configuration
      </StyledTitleTypography>
      <StyledSummaryBox
        data-qa-db-configuration-summary
        display="flex"
        flex={1}
      >
        <Box key={'status-version'} paddingRight={6}>
          {/* <StyledSummaryTextBox>
            <span style={{ fontFamily: theme.font.bold }}>Status</span>{' '}
            <StyledStatusSpan>
              <StatusIcon
                status={databaseStatusMap[database.status]}
                sx={{ verticalAlign: 'sub' }}
              />
              {database.status}
            </StyledStatusSpan>
          </StyledSummaryTextBox> */}
          {/* <StyledSummaryTextTypography>
            <span style={{ fontFamily: theme.font.bold }}>Version</span>{' '}
            {databaseEngineMap[database.engine]} v{database.version}
          </StyledSummaryTextTypography> */}
          {/* <StyledSummaryTextTypography>
            <span style={{ fontFamily: theme.font.bold }}>Nodes</span>{' '}
            {configuration}
          </StyledSummaryTextTypography> */}
        </Box>
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: 14 }}
              >
                {formatStorageUnits(type.label)}
              </Typography>
              <Box marginLeft={1}>
                <StyledStatusSpan>
                  <StatusIcon
                    status={databaseStatusMap[database.status]}
                    sx={{ verticalAlign: 'sub' }}
                  />
                  {database.status}
                </StyledStatusSpan>
              </Box>
            </Box>
            <Box display="flex" marginTop={2}>
              <Box marginRight={4}>
                <Typography color="text.secondary">RAM</Typography>
                <Typography component="div" variant="h5">
                  {type.memory / 1024} GB
                </Typography>
              </Box>
              <Box marginRight={4}>
                <Typography color="text.secondary">CPUs</Typography>
                <Typography component="div" variant="h5">
                  {type.vcpus}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">Used Disk</Typography>
                <Typography component="div" variant="h5">
                  {database.used_disk_size_gb} / {database.total_disk_size_gb}{' '}
                  GB
                </Typography>
              </Box>
            </Box>

            <Typography color="text.secondary" marginTop={1}>
              {configuration}
            </Typography>
            <Typography color="text.secondary" marginTop={1}>
              {databaseEngineMap[database.engine]} v{database.version} |{' '}
              {region?.label ?? database.region}
            </Typography>
          </CardContent>
        </Card>
        {/* <Box key={'region-plan'} paddingRight={6}>
          <StyledSummaryTextTypography>
            <span style={{ fontFamily: theme.font.bold }}>Region</span>{' '}
            {region?.label ?? database.region}
          </StyledSummaryTextTypography>
          <StyledSummaryTextTypography>
            <span style={{ fontFamily: theme.font.bold }}>Plan</span>{' '}
            {formatStorageUnits(type.label)}
          </StyledSummaryTextTypography>
        </Box> */}
        {/*
        <Box key={'ram-cpu'} paddingRight={6}>
          <StyledSummaryTextTypography>
            <span style={{ fontFamily: theme.font.bold }}>RAM</span>{' '}
            {type.memory / 1024} GB
          </StyledSummaryTextTypography>
          <StyledSummaryTextTypography>
            <span style={{ fontFamily: theme.font.bold }}>CPUs</span>{' '}
            {type.vcpus}
          </StyledSummaryTextTypography>
        </Box> */}
        {/* <Box key={'disk'} paddingRight={6}>
          {database.total_disk_size_gb ? (
            <>
              <StyledSummaryTextTypography>
                <span style={{ fontFamily: theme.font.bold }}>
                  Total Disk Size
                </span>{' '}
                {database.total_disk_size_gb} GB
                <TooltipIcon
                  status="help"
                  sxTooltipIcon={sxTooltipIcon}
                  text={STORAGE_COPY}
                />
              </StyledSummaryTextTypography>
              <StyledSummaryTextTypography>
                <span style={{ fontFamily: theme.font.bold }}>Used</span>{' '}
                {database.used_disk_size_gb} GB
              </StyledSummaryTextTypography>
            </>
          ) : (
            <StyledSummaryTextTypography>
              <span style={{ fontFamily: theme.font.bold }}>Storage</span>{' '}
              {convertMegabytesTo(type.disk, true)}
            </StyledSummaryTextTypography>
          )}
        </Box> */}
      </StyledSummaryBox>
    </>
  );
};
