import Head from "next/head";
import { Container } from "react-bootstrap";

import Header from "./Header";

export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <title>{`${title} | Fat Cat Feeder`}</title>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        ></meta>
      </Head>

      <Header />
      <Container fluid>
        <main>{children}</main>
      </Container>
    </>
  );
}
