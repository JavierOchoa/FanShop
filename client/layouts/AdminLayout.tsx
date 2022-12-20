import { Toolbar, Box } from "@mui/material";
import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import { AdminNav, AdminDrawer } from "../components/admin";

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
