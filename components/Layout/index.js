import Head from "next/head";
import { Container } from "react-bootstrap";

import Header from "./Header";

export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <title>{`${title} | Fat Cat Feeder`}</title>
      </Head>

      <Header />
      <Container fluid>
        <main>{children}</main>
      </Container>
    </>
  );
}
