"use client";

import React, { useState, useEffect } from 'react';
import Login from "./components/(pages)/loginPage"
import LoggedIn from "./components/(pages)/loggedinPage"

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Modal from 'react-bootstrap/Modal';

import { CheckCircle } from 'react-bootstrap-icons';
import { Envelope } from 'react-bootstrap-icons';
import { X } from "react-bootstrap-icons"

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

  const [isNotificationClosed, setIsNotificationClosed] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

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
              <Navbar.Brand href=""><h3>だいたいBPM</h3></Navbar.Brand>
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
              <br />
              注意：BPM, キーは
              {/*librosaで仮推定したのち、*/}
              spotifyから取得しているため、BPMが2,3ほどずれていたり、2倍になっていたりすることがあります。
              <br />
              また、キーは全然合っていません。
              そのため、BPMやキーが間違っている場合は遠慮なくお問い合わせください。
              <br />
              <br />
              また、曲の追加のリクエストも受け付けています。お問い合わせフォームからお知らせください。
              <br />
              本サイトはあくまで目安としてお使いください。
              <br />
              <br />
              <CheckCircle color='green' />の付いているものは、人の手またはデータベースによりBPMが確認されたものです。
              <br />
              <Envelope />をクリックすると、その情報に対してお問い合わせができます。
              <br />
              <br />
              {/** ここにお知らせなど */}
              {/* {!isNotificationClosed && (
                <div className="alert alert-dismissible alert-info row align-items-center">
                  <span className='col-2'
                  ><strong>お知らせ</strong>
                  </span>
                  <span className='col'
                  >現在、データベースからキーの取得作業を行っています(API制限)。もうしばらくお待ちください。
                  </span>
                  <span className='col-0.3'
                  >
                    <Button type='button' className='ml-2 close' data-dismiss='toast' variant='link' aria-label='お知らせをとじる'
                      onClick={() => {
                        setIsNotificationClosed(true);
                      }}>
                      <span><X /> </span>
                    </Button>
                  </span>
                </div>
              )} */}
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
              <br />
              <br />
              <a href="#" onClick={handleOpen} style={{ cursor: "pointer" }}>プライバシーポリシー</a>
              <br />
              <br />
              <a href="https://twitter.com/akaakuhub" target="_blank">Akaaku</a>&apos;s product
            </Container>
          </div>
          <Modal show={isModalOpen} onHide={handleClose} centered>
            <Modal.Header>
              <Modal.Title>プライバシーポリシー</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              本サイトでは、ユーザー体験の向上やサイトの最適化のため、Googleアナリティクスを使用しています。
              <br />
              Googleアナリティクスでは、Cookieを使用して、個人を特定できない形で匿名データを収集しています。
              <br />
              もしデータ収集を拒否したい場合は、お使いのブラウザの設定を変更してください。
              <br />
              <br />
              詳しくは、
              <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank">Googleアナリティクス利用規約</a>
              や
              <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank">Googleのポリシーと規約</a>
              をご確認ください。
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>閉じる</Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default App;