"use client";

import React, { useState, useEffect } from 'react';
import Login from "./components/(pages)/loginPage"
import LoggedIn from "./components/(pages)/loggedinPage"

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { CheckCircle } from 'react-bootstrap-icons';
import { Envelope } from 'react-bootstrap-icons';

import getTokenFromUrl from './libs/GetTokenFromURL';

function App() {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const hash = getTokenFromUrl();
    setTimeout(() => {
      window.location.hash = "";
    }, 0);
    const tokenFromAuth: string = hash.access_token as string;

    if (tokenFromAuth) {
      // auth後
      sessionStorage.setItem('temp_token', tokenFromAuth);
      setToken(tokenFromAuth);
    } else {
      const tokenFromSession = sessionStorage.getItem('temp_token');
      if (tokenFromSession) {
        setToken(tokenFromSession);
      }
    }
    setLoading(false);
  }, [])

  const [expanded, setExpanded] = useState<boolean>(false);

  const handleNavClose = () => setExpanded(false);
  const sectionStyle = {
    paddingTop: "3em",
    marginTop: "-2.2em",
  };


  return (
    <>
      {loading ? (
        <div></div>
      ) : (
        <>
          <Navbar expand="lg" className="bg-body-tertiary" fixed="top" bg="light" variant="light" expanded={expanded} onToggle={setExpanded}
            style={{
              zIndex: 1000,
              borderBottom: "2px solid #ffc4f2"
            }}
          >
            <Container>
              <Navbar.Brand href="">だいたいBPM</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" onClick={handleNavClose}
                >
                  <Nav.Item className="nav-item">
                    <Nav.Link onClick={() => {
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                      });
                    }
                    }
                    >TOP</Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="nav-item">
                    <Nav.Link href="/contact">お問い合わせ</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Navbar.Collapse>
            </Container >
          </Navbar >
          <div style={{ paddingTop: "5em" }}
          >
            <Container>
              注意： BPMはlibrosaによる自動推定のため、2,3ほどずれていたり、2倍になっていたりすることがあります。
              <br />
              BPMが間違っている場合は遠慮なくお問い合わせください。
              <br />
              本サイトはあくまで目安としてお使いください。
              <br />
              <br />
              <CheckCircle color='green' />の付いているものは、人の手またはデータベースによりBPMが確認されたものです。
              <br />
              <Envelope />をクリックすると、その情報に対してお問い合わせができます。
              <br />
              <br />
              {token ? (
                <LoggedIn token={token} />
              ) : (
                <Login />
              )}
            </Container>
          </div>
          <div>
            <Container style={{
              width: "100%",
              textAlign: "center",
            }}
              className="mt-4 mb-4"
            >
              Made with <a href="https://nico.kubosho.com/" target="_blank">Nico</a>
            </Container>
          </div>
        </>
      )}
    </>
  );
}

export default App;