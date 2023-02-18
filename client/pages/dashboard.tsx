import { SpacedSubTypography } from "../components";
import { PageLayout } from "../layouts";
import { DashboardTabs } from "../components/User/";
import useAuth from "../utils/hooks/useAuth";
import { useRouter } from "next/router";
import { Box, CircularProgress } from "@mui/material";

export default function Dashboard() {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!user) {
    router.push(`/`).catch((e) => console.log(e));
    return <></>;
  }
  return (
    <PageLayout
      title={"Account Page"}
      pageDescription={"Page with user information and account data."}
    >
      <SpacedSubTypography>user information</SpacedSubTypography>
      <DashboardTabs />
    </PageLayout>
  );
}
