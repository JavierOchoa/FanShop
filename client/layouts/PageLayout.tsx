import Head from "next/head";
import { FC, PropsWithChildren } from "react";

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const PageLayout: FC<PropsWithChildren<Props>> = ({
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
      <main>{children}</main>
    </>
  );
};
