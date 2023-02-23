import React, { FC, PropsWithChildren } from "react";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { AdminLayout } from "../../layouts";
import { useGetStatsQuery } from "../../redux/services";
import Link from "next/link";

const Item: FC<PropsWithChildren> = ({ children }) => {
  return <Paper sx={{ p: 3, m: 2 }}>{children}</Paper>;
};

export default function AdminPanel() {
  const { data: statsData } = useGetStatsQuery();
  return (
    <AdminLayout title="Admin Panel" pageDescription="Admin panel for FanShop">
      {!statsData && <>Loading</>}
      {statsData && (
        <Grid container columns={4}>
          <Grid item xs={6} md={1}>
            <Link href={"/admin/products"}>
              <Item>
                <Typography variant={"h4"}>{statsData.data.products}</Typography>
                <Typography variant={"overline"} p={0} m={0}>
                  PRODUCTS
                </Typography>
              </Item>
            </Link>
          </Grid>
          <Grid item xs={6} md={1}>
            <Link href={"/admin/users"}>
              <Item>
                <Box>
                  <Typography variant={"h4"}>{statsData.data.totalUsers}</Typography>
                  <Stack spacing={0}>
                    <Typography variant={"overline"} p={0} m={0}>
                      USERS
                    </Typography>
                    <Typography variant={"overline"} p={0} m={0}>
                      Regular Users: {statsData.data.normalUsers}
                    </Typography>
                    <Typography variant={"overline"} p={0} m={0}>
                      Admin Users: {statsData.data.adminUsers}
                    </Typography>
                  </Stack>
                </Box>
              </Item>
            </Link>
          </Grid>
          <Grid item xs={6} md={1}>
            <Item>
              <Typography variant={"h4"}>{statsData.data.completedOrders}</Typography>
              <Typography variant={"overline"}>Completed Orders</Typography>
              <Stack spacing={0}>
                <Typography variant={"overline"} p={0} m={0}>
                  Incomplete Orders: {statsData.data.unfinishedOrders}
                </Typography>
                <Typography variant={"overline"} p={0} m={0}>
                  Total Orders: {statsData.data.totalOrders}
                </Typography>
              </Stack>
            </Item>
          </Grid>
          <Grid item xs={6} md={1}>
            <Item>
              <Typography variant={"h4"}>${statsData.data.totalRevenue}</Typography>
              <Typography variant={"overline"}>Total Revenue</Typography>
            </Item>
          </Grid>
        </Grid>
      )}
    </AdminLayout>
  );
}
