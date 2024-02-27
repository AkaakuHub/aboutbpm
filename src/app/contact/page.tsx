"use client";

import React, { use } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { X } from "react-bootstrap-icons"

const Page = () => {
  const mainTextFromQuery = useSearchParams().get("mainText") || "";
  const kindFromQuery = useSearchParams().get("kind") || "";

  const [mainText, setMainText] = useState("");
  const [optionValue, setOptionValue] = useState("2");
  const [isValidate, setIsValidate] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const [alertMessages, setAlertMessages] = useState([] as { id: number, msg: string }[]);

  const setAlertMessagesFunc = (msg: string) => {
    const newAlert = { id: Date.now(), msg: msg };
    setAlertMessages(alertMessages => [...alertMessages, newAlert]);
    setTimeout(() => {
      setAlertMessages(alertMessages => alertMessages.filter(alert => alert.id !== newAlert.id));
    }, 5000);
  }

  const sendContactMailAPI = async (mainText: string, optionValue: string) => {
    console.log(mainText, optionValue, "です");
    const res = await fetch("api/sendContactMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mainText: mainText, optionValue: optionValue })
    });
    const status = res.status;
    if (status === 200) {
      const json = await res.json();
      const msg = json.msg;
      setMainText("");
      setAlertMessagesFunc(msg);
    } else {
      setAlertMessagesFunc("エラーが発生しました。しばらくしてから再度お試しください。")
    }
    setIsSending(false);
  }

  // mainTextFromQueryがあったら、mainTextにセット
  useEffect(() => {
    if (mainTextFromQuery !== "") {
      setMainText(mainTextFromQuery);
    }
  }, []);
  useEffect(() => {
    if (kindFromQuery !== "") {
      setOptionValue(kindFromQuery);
    }
  }, []);

  // URLの欄からクエリを消す
  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  // mainTextが300文字以上だったら、送信ボタンを無効にする, 300文字に強制
  useEffect(() => {
    if (mainText.length > 300) {
      setMainText(mainText.slice(0, 301));
      setAlertMessagesFunc("300文字を超えています。")
      setIsValidate(false);
    } else {
      setIsValidate(!/^\s*$/.test(mainText));
    }
  }, [mainText]);

  const [expanded, setExpanded] = useState(false);

  const handleNavClose = () => setExpanded(false);
  const sectionStyle = {
    paddingTop: "3em",
    marginTop: "-2.2em",
  };

  return (
    <div style={{ paddingTop: "5em" }}
    >
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top" bg="light" variant="light" expanded={expanded} onToggle={setExpanded}
        style={{
          zIndex: 1000,
          borderBottom: "2px solid #ffc4f2"
        }}
      >
        <Container>
          <Navbar.Brand href="">だいたいBPM - お問い合わせ</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" onClick={handleNavClose}
            >
              <Nav.Item className="nav-item">
                <Nav.Link onClick={() => {
                  window.location.href = "/";
                }
                }
                >TOP</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container >
      </Navbar >
      <Container
      >
        {/* <Button variant="primary" href="/"
        >
          TOPに戻る
        </Button> */}
        <Form>
          <Form.Group className="mb-3" style={{ maxWidth: "300px" }}
          >
            <Form.Label>お問い合わせ内容を選択してください。</Form.Label>
            <Form.Control as="select" onChange={e => {
              setOptionValue(e.target.value);
            }
            }
              value={optionValue}
              disabled={isSending}
            >
              <option disabled >選択してください</option>
              <option value="1">情報の修正</option>
              <option value="2">曲の追加</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}
          >
            <Form.Label>本文を入力してください。&#040;300文字以内&#041;</Form.Label>
            <Form.Control as="textarea" rows={10} onChange={e => {
              setMainText(e.target.value);
              setIsValidate(!/^\s*$/.test(e.target.value));
            }}
              value={mainText}
              disabled={isSending}
            />
          </Form.Group>
          <Button variant="primary" type="submit"
            disabled={!isValidate || isSending}
            onClick={(e) => {
              e.preventDefault();
              setIsSending(true);
              setAlertMessagesFunc("送信しています...(しばらくしても完了しない場合は時間を開けて再度お願いいたします。)");
              sendContactMailAPI(mainText, optionValue);
            }}
          >
            送信
          </Button>
          <br />
          {isSending && (
            <div className="spinner-border text-primary" role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {/* {!isValidate && (
            <span style={{ paddingLeft: "0.5em", color: "red" }}>内容を入力してください</span>
          )} */}
        </Form>
        <br />
        {alertMessages.length > 0 && (
          alertMessages.map((item, index) => (
            <div className='toast fade show' role='alert' aria-live='assertive' aria-atomic='true' key={index}>
              <div className='toast-header'>
                <strong className='mr-auto'>メッセージ</strong>
                <small>今</small>
                <button type='button' className='ml-2 mb-1 close' data-dismiss='toast' aria-label='Close'
                  onClick={() => {
                    // 自分自身のidに対応するものを削除
                    setAlertMessages(alertMessages => alertMessages.filter(alert => alert.id !== item.id));
                  }}>
                  <span aria-hidden='true'><X /> </span>
                </button>
              </div>
              <div className='toast-body'>
                {item.msg}
              </div>
            </div>
          ))
        )}
      </Container>
    </div>
  );
}

export default Page;