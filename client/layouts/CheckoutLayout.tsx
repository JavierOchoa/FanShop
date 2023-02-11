import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import useAuth from "../utils/hooks/useAuth";
import { useRouter } from "next/router";
import { Box, CircularProgress } from "@mui/material";

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const CheckoutLayout: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  pageDescription,
}) => {
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
    router.push(`/`);
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
      </Head>
      <main
        style={{
          margin: "40px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        {children}
      </main>
    </>
  );
};
