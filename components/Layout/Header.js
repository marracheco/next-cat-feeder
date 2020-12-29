import { Container } from "react-bootstrap";

export default function Header() {
  return (
    <header className="header">
      <Container fluid className="container">
        <img
          className="logo"
          src="/images/fat-cat.png"
          alt="Fat Cat Feeder logo"
        />
        <div className="title">
          <h1>Fat Cat Feeder &nbsp;</h1>
        </div>
      </Container>
    </header>
  );
}
