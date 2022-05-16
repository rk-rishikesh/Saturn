import React, { useState, useEffect } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardImg,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useMoralis } from "react-moralis";

// core components
import NoLoginNav from "components/Navbars/NoLoginNav.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { Link } from "react-router-dom";


//classss hai broooooo setStae aise nai na hotee

function Login() {
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    // this.refs.main.scrollTop = 0;
  });

  const {
    Moralis,
    authenticate,
    signup,
    login,
    isAuthenticated,
    user,
    setUserData,
    userError,
    isUserUpdating,
    logout,
    isAuthenticating,
    enableWeb3,
  } = useMoralis();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      await login(username, password)
        .then(function (user) {
          console.log("logged in user:", user);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    console.log(username);
    console.log("Login Successull");
  };

  return (
    <>
      <NoLoginNav />
      {/* <main useRef="main"> */}
      <section className="section section-shaped section-lg">
        <div className="shape shape-style-1 bg-gradient-default">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <Container className="pt-lg-7">
          <Row className="justify-content-center">
            <Col lg="5">
              <Card className="bg-secondary shadow border-0">
                <CardHeader className="bg-white pb-5">
                  <CardImg
                    alt="..."
                    src={require("assets/img/theme/saturn.png")}
                    top
                  />
                </CardHeader>
                <CardBody className="px-lg-5 py-lg-5">
                  <Form role="form">
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">
                        <div addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </div>
                        <Input
                          placeholder="Username"
                          type="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <div addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                        </div>
                        <Input
                          placeholder="Password"
                          type="password"
                          autoComplete="off"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id=" customCheckLogin"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor=" customCheckLogin"
                      >
                        <span>Remember me</span>
                      </label>
                    </div>
                    <div className="text-center">
                      <Button
                        className="my-4"
                        color="primary"
                        type="button"
                        onClick={handleLogin}
                      >
                        Sign in
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <Row className="mt-3">
                <Col xs="6">
                  <a
                    className="text-light"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <small>Forgot password?</small>
                  </a>
                </Col>
                <Col className="text-right" xs="6">
                  <a
                    className="text-light"
                    href="/register-page"
                    to="/login-page"
                    tag={Link}
                  >
                    <small>Create new account</small>
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      {/* </main> */}
      <SimpleFooter />
    </>
  );
}

export default Login;
