import { Database, DatabaseInstance } from '@linode/api-v4/lib/databases/types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Theme } from '@mui/material/styles';
import * as React from 'react';
import { makeStyles } from 'tss-react/mui';

import { Box } from 'src/components/Box';
import { StatusIcon } from 'src/components/StatusIcon/StatusIcon';
import { TooltipIcon } from 'src/components/TooltipIcon';
import { Typography } from 'src/components/Typography';
import { StyledStatusSpan } from 'src/features/Databases/DatabaseDetail/DatabaseScaleUp/DatabaseScaleUpCurrentConfiguration.style';
import { useDatabaseTypesQuery } from 'src/queries/databases';
import { useRegionsQuery } from 'src/queries/regions';
import { formatStorageUnits } from 'src/utilities/formatStorageUnits';
import { convertMegabytesTo } from 'src/utilities/unitConversions';

import {
  databaseEngineMap,
  databaseStatusMap,
} from '../../DatabaseLanding/DatabaseRow';

const useStyles = makeStyles()((theme: Theme) => ({
  configs: {
    // fontSize: '0.875rem',
    lineHeight: '22px',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  label: {
    fontSize: '0.875rem',
    // fontFamily: theme.font.bold,
    lineHeight: '22px',
    width: theme.spacing(13),
  },
  status: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: theme.spacing(),
    textTransform: 'capitalize',
  },
}));

interface Props {
  database: Database;
}

export const getDatabaseVersionNumber = (
  version: DatabaseInstance['version']
) => version.split('/')[1];

export const DatabaseSummaryClusterConfiguration = (props: Props) => {
  const { classes } = useStyles();

  const { database } = props;

  const { data: types } = useDatabaseTypesQuery();
  const { data: regions } = useRegionsQuery();

  const region = regions?.find((r) => r.id === database.region);

  const type = types?.find((type) => type.id === database?.type);

  if (!database || !type) {
    return null;
  }

  const configuration =
    database.cluster_size === 1
      ? 'Primary'
      : `Primary +${database.cluster_size - 1} replicas`;

  const sxTooltipIcon = {
    marginLeft: '4px',
    padding: '0px',
  };

  const STORAGE_COPY =
    'The total disk size is smaller than the selected plan capacity due to the OS overhead.';

  return (
    <>
      <Box alignItems="baseline" display="flex" flexDirection="row">
        <Typography className={classes.header} variant="h3">
          Cluster Configuration{' '}
        </Typography>
        {/* <span className={classes.status}>
          <StatusIcon status={databaseStatusMap[database.status]} />
          {database.status}
        </span> */}
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
                {database.used_disk_size_gb} / {database.total_disk_size_gb} GB
              </Typography>
            </Box>
          </Box>
          <Typography color="text.secondary" marginTop={2}>
            {configuration} | {databaseEngineMap[database.engine]} v
            {database.version}
          </Typography>
          <Typography color="text.secondary" marginTop={1}>
            {region?.label ?? database.region}
          </Typography>
        </CardContent>
      </Card>
      {/* <div className={classes.configs} data-qa-cluster-config>
        <Box display="flex" marginBottom={1}>
          <Box display="flex" flexDirection="column">
            <Typography className={classes.label}>Version</Typography>
            <Typography sx={{ fontSize: '1rem' }}>
              {databaseEngineMap[database.engine]} v{database.version}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography className={classes.label}>Nodes</Typography>
            <Typography sx={{ fontSize: '1rem' }}>{configuration}</Typography>
          </Box>
        </Box>
        <Box display="flex" marginBottom={1}>
          <Box
            display="flex"
            flexDirection="column"
            marginRight={3}
            style={{ marginBottom: 12 }}
          >
            <Typography className={classes.label}>Region</Typography>
            <Typography sx={{ fontSize: '1rem' }}>
              {region?.label ?? database.region}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography className={classes.label}>Plan</Typography>
            <Typography sx={{ fontSize: '1rem' }}>
              {formatStorageUnits(type.label)}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" marginBottom={2}>
          <Box display="flex" flexDirection="column">
            <Typography className={classes.label}>RAM</Typography>
            <Typography sx={{ fontSize: '1.25rem' }}>
              {type.memory / 1024} GB
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography className={classes.label}>CPUs</Typography>
            <Typography sx={{ fontSize: '1.25rem' }}>{type.vcpus}</Typography>
          </Box>
        </Box>
        {database.total_disk_size_gb ? (
          <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection="column">
              <Typography className={classes.label}>Total Disk Size</Typography>
              <Typography
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  fontSize: '1.25rem',
                }}
              >
                {database.total_disk_size_gb} GB
                <TooltipIcon
                  status="help"
                  sxTooltipIcon={sxTooltipIcon}
                  text={STORAGE_COPY}
                />
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column">
              <Typography className={classes.label}>Used</Typography>
              <Typography sx={{ fontSize: '1.25rem' }}>
                {database.used_disk_size_gb} GB
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column">
            <Typography className={classes.label}>Storage</Typography>
            <Typography sx={{ fontSize: '1.25rem' }}>
              {convertMegabytesTo(type.disk, true)}
            </Typography>
          </Box>
        )}
      </div> */}
    </>
  );
};

export default DatabaseSummaryClusterConfiguration;
