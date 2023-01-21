import React, { FC, PropsWithChildren } from "react";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { AdminLayout } from "../../layouts";
import { useGetStatsQuery } from "../../redux/services";

const Item: FC<PropsWithChildren> = ({ children }) => {
  return <Paper sx={{ p: 3, m: 2 }}>{children}</Paper>;
};

export default function AdminPanel() {
  const { data: statsData } = useGetStatsQuery();
  return (
    <AdminLayout title="Admin Panel" pageDescription="Admin panel for FanShop">
      <Grid container columns={4}>
        <Grid>
          <Item>
            <Typography variant={"h4"}>{statsData?.products}</Typography>
            <Typography variant={"overline"} p={0} m={0}>
              PRODUCTS
            </Typography>
          </Item>
        </Grid>
        <Grid>
          <Item>
            <Box>
              <Typography variant={"h4"}>{statsData?.totalUsers}</Typography>
              <Stack spacing={0}>
                <Typography variant={"overline"} p={0} m={0}>
                  USERS
                </Typography>
                <Typography variant={"overline"} p={0} m={0}>
                  Regular Users: {statsData?.normalUsers}
                </Typography>
                <Typography variant={"overline"} p={0} m={0}>
                  Admin Users: {statsData?.adminUsers}
                </Typography>
              </Stack>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
