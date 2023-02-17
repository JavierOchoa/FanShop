import { SpacedSubTypography } from "../components";
import { PageLayout } from "../layouts";
import { DashboardTabs } from "../components/User/";

export default function Dashboard() {
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
