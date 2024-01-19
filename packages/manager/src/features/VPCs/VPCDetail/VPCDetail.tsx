import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import { DateTime } from 'luxon';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import { Box } from 'src/components/Box';
import { StyledLinkButton } from 'src/components/Button/StyledLinkButton';
import { CircleProgress } from 'src/components/CircleProgress/CircleProgress';
import { DismissibleBanner } from 'src/components/DismissibleBanner/DismissibleBanner';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { EntityHeader } from 'src/components/EntityHeader/EntityHeader';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { LandingHeader } from 'src/components/LandingHeader';
import {
  VPC_DOCS_LINK,
  VPC_FEEDBACK_FORM_URL,
  VPC_LABEL,
} from 'src/features/VPCs/constants';
import { useProfile } from 'src/queries/profile';
import { useRegionsQuery } from 'src/queries/regions';
import { useVPCQuery } from 'src/queries/vpcs';
import { truncate } from 'src/utilities/truncate';

import { VPCDeleteDialog } from '../VPCLanding/VPCDeleteDialog';
import { VPCEditDrawer } from '../VPCLanding/VPCEditDrawer';
import { REBOOT_LINODE_WARNING_VPCDETAILS } from '../constants';
import { getUniqueLinodesFromSubnets } from '../utils';
import {
  StyledActionButton,
  StyledDescriptionBox,
  StyledPaper,
  StyledSummaryBox,
  StyledSummaryTextTypography,
} from './VPCDetail.styles';
import { VPCSubnetsTable } from './VPCSubnetsTable';

const VPCDetail = () => {
  const { vpcId } = useParams<{ vpcId: string }>();
  const theme = useTheme();

  const { data: vpc, error, isLoading } = useVPCQuery(+vpcId);
  const { data: regions } = useRegionsQuery();
  const { data: profile } = useProfile();

  const [editVPCDrawerOpen, setEditVPCDrawerOpen] = React.useState(false);
  const [deleteVPCDialogOpen, setDeleteVPCDialogOpen] = React.useState(false);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  if (isLoading) {
    return <CircleProgress />;
  }

  if (!vpc || error) {
    return (
      <ErrorState errorText="There was a problem retrieving your VPC. Please try again." />
    );
  }

  const description =
    vpc.description.length < 150 || showFullDescription
      ? vpc.description
      : truncate(vpc.description, 150);

  const regionLabel =
    regions?.find((r) => r.id === vpc.region)?.label ?? vpc.region;

  const numLinodes = getUniqueLinodesFromSubnets(vpc.subnets);

  const summaryData = [
    [
      {
        label: 'Subnets',
        value: vpc.subnets.length,
      },
      {
        label: 'Linodes',
        value: numLinodes,
      },
    ],
    [
      {
        label: 'Region',
        value: regionLabel,
      },
      {
        label: 'VPC ID',
        value: vpc.id,
      },
    ],
    [
      {
        label: 'Created',
        value: DateTime.fromISO(vpc.created, {
          zone: profile?.timezone,
        }).toLocaleString(DateTime.DATE_MED),
      },

      {
        label: 'Updated',
        value: DateTime.fromISO(vpc.updated, {
          zone: profile?.timezone,
        }).toLocaleString(DateTime.DATE_MED),
      },
    ],
  ];

  return (
    <>
      <DocumentTitleSegment segment={vpc.label} />
      <LandingHeader
        breadcrumbProps={{
          crumbOverrides: [
            {
              label: VPC_LABEL,
              position: 1,
            },
          ],
          labelOptions: { noCap: true },
          pathname: `/vpcs/${vpc.label}`,
        }}
        betaFeedbackLink={VPC_FEEDBACK_FORM_URL}
        docsLabel="Docs"
        docsLink={VPC_DOCS_LINK}
      />
      <EntityHeader>
        <Box>
          <Typography
            sx={(theme) => ({
              color: theme.textColors.headlineStatic,
              fontFamily: theme.font.bold,
              fontSize: '1rem',
              padding: '6px 16px',
            })}
          >
            Summary
          </Typography>
        </Box>
        <Box display="flex" justifyContent="end">
          <StyledActionButton onClick={() => setEditVPCDrawerOpen(true)}>
            Edit
          </StyledActionButton>
          <StyledActionButton onClick={() => setDeleteVPCDialogOpen(true)}>
            Delete
          </StyledActionButton>
        </Box>
      </EntityHeader>
      <StyledPaper>
        <StyledSummaryBox data-qa-vpc-summary display="flex" flex={1}>
          <Card>
            <CardContent sx={{ padding: '0 !important' }}>
              <Box display="flex">
                <Box marginRight={4}>
                  <Typography color="text.secondary">Subnets</Typography>
                  <Typography component="div" variant="h5">
                    {vpc.subnets.length}
                  </Typography>
                </Box>
                <Box marginRight={4}>
                  <Typography color="text.secondary">Linodes</Typography>
                  <Typography component="div" variant="h5">
                    {numLinodes}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" marginTop={1}>
                <Typography
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: 14 }}
                >
                  {regionLabel}
                </Typography>
              </Box>
              <Typography color="text.secondary" marginTop={1}>
                Created on{' '}
                {DateTime.fromISO(vpc.created, {
                  zone: profile?.timezone,
                }).toLocaleString(DateTime.DATE_MED)}
              </Typography>
              <Typography color="text.secondary">
                Updated on{' '}
                {DateTime.fromISO(vpc.updated, {
                  zone: profile?.timezone,
                }).toLocaleString(DateTime.DATE_MED)}
              </Typography>
            </CardContent>
          </Card>
          {/* {summaryData.map((col) => {
            return (
              <Box key={col[0].label} paddingRight={6}>
                <Box marginBottom={1}>
                  <Typography>
                    <strong>{col[0].label}</strong>{' '}
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', padding: 1 }}>
                    {col[0].value}
                  </Typography>
                </Box>
                <Box>
                  <Typography>
                    <strong>{col[1].label}</strong>{' '}
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', padding: 1 }}>
                    {col[1].value}
                  </Typography>
                </Box>
              </Box>
            );
          })} */}
        </StyledSummaryBox>
        {vpc.description.length > 0 && (
          <StyledDescriptionBox display="flex" flex={1}>
            <Box>
              <Typography>
                <span style={{ fontFamily: theme.font.bold, paddingRight: 8 }}>
                  Description
                </span>{' '}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '1rem',
                  overflowWrap: 'anywhere',
                  wordBreak: 'normal',
                }}
              >
                {description}{' '}
                {description.length > 150 && (
                  <StyledLinkButton
                    onClick={() => setShowFullDescription((show) => !show)}
                    sx={{ fontSize: '0.875rem' }}
                  >
                    Read {showFullDescription ? 'Less' : 'More'}
                  </StyledLinkButton>
                )}
              </Typography>
            </Box>
          </StyledDescriptionBox>
        )}
      </StyledPaper>
      <VPCDeleteDialog
        id={vpc.id}
        label={vpc.label}
        onClose={() => setDeleteVPCDialogOpen(false)}
        open={deleteVPCDialogOpen}
      />
      <VPCEditDrawer
        onClose={() => setEditVPCDrawerOpen(false)}
        open={editVPCDrawerOpen}
        vpc={vpc}
      />
      <Box
        sx={(theme) => ({
          [theme.breakpoints.up('lg')]: {
            paddingLeft: 0,
          },
        })}
        padding={`${theme.spacing(2)} ${theme.spacing()}`}
      >
        <Typography sx={{ fontSize: '1rem' }} variant="h2">
          Subnets ({vpc.subnets.length})
        </Typography>
      </Box>
      {numLinodes > 0 && (
        <DismissibleBanner
          preferenceKey={`reboot-linodes-warning-banner`}
          sx={{ marginBottom: theme.spacing(2) }}
          variant="warning"
        >
          <Typography variant="body1">
            {REBOOT_LINODE_WARNING_VPCDETAILS}
          </Typography>
        </DismissibleBanner>
      )}
      <VPCSubnetsTable vpcId={vpc.id} vpcRegion={vpc.region} />
    </>
  );
};

export default VPCDetail;
