import { Toolbar, Box, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect } from "react";
import { AdminNav, AdminDrawer } from "../components/admin";
import useAuth from "../utils/hooks/useAuth";

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const AdminLayout: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  const { isLoading, isAuthenticated } = useAuth();
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
  if (!isLoading && !isAuthenticated) {
    router.push(`/admin/login?p=${router.pathname}`);
    return <></>;
  }
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>
      <main>
        <AdminNav />
        <Box sx={{ display: "flex" }}>
          <AdminDrawer />
          <Box component={"main"} sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            {children}
          </Box>
        </Box>
      </main>
    </>
  );
};
