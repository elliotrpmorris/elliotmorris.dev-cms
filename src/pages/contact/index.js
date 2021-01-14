import React from 'react'
import { navigate } from 'gatsby-link'
import Layout from '../../components/Layout'
import { Grid, Col, Row } from "react-styled-flexboxgrid";
import styled from "styled-components";

export const Title = styled.h1`
  line-height: 1;
  margin: 0.5rem 0;
  font-size: 2.5rem;
`;

export const SubTitle = styled.h2`
  color: #20232a;
  margin-bottom: 0;
  font-size: .5rem;

  @media (min-width: 360px) {
    font-size: .75rem;
  }
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 1;
  position: relative;
  padding: 2.5rem;
  background-color: #d8d8d8;
  color: black;
  @media (min-width: 768px) {
    padding: 5rem;
  }

  &:hover {
    &::before {
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
        0 10px 10px rgba(0, 0, 0, 0.22);
      transform: rotate(2deg) scale(1.01);
    }
  }
  &::before {
    content: " ";
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
    transform: rotate(-2deg);
    box-shadow: -1px 1px 24px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
  }

    &::before {
      background-color: #d8d8d8;
    }
  }
`;

export const Box = styled.input`
  color: #323741;
  display: block;
  width: 100%;
  background: 0 0;
  line-height: 1.2;
  padding: 5px 5px 0 5px;
  outline: none;
  border: none;
  font-size: 1rem;
  @media (min-width: 414px) {
    font-size: 1.1rem;
  }
`;

export const InputLabel = styled.label`
  font-size: 1rem;
`;

export const WrapInput = styled.div`
  position: relative;
  border-bottom: 1px solid #323741;
  padding-bottom: 10px;
  font-size: 3rem;
  width: 100%;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

export const Focus = styled.span`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  &:before {
    content: "";
    display: block;
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    transition: all 0.4s;
    background: #323741;
  }
`;

export const TextBox = styled.textarea`
  color: #323741;
  font-size: 1.1rem;
  min-height: 110px;
  display: block;
  width: 100%;
  background: 0 0;
  line-height: 1.2;
  padding: 5px 5px 0 5px;
  outline: none;
  border: none;
  resize: vertical;
  ::placeholder{
    font-family: "Work Sans", sans-serif;
  }
`;

export const Btn = styled.button`
  margin-top: 1rem;
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  height: 50px;
  border-radius: 27px;
  background: #323741;
  outline: none;
  border: none;
  position: relative;
  z-index: 1;
  transition: all 0.4s;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isValidated: false }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...this.state,
      }),
    })
      .then(() => navigate(form.getAttribute('action')))
      .catch((error) => alert(error))
  }

  render() {
    return (
      <Layout>
        <section>
          <Grid>
            <Row>  
              <Col xs={12}>
                <Card>
                  <Title>Contact</Title>
                  <SubTitle>Interested in working together or just fancy a chat? Send me a message!</SubTitle>
                  <form
                    name="contact"
                    method="post"
                    action="/contact/thanks/"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={this.handleSubmit}
                  >
                    {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
                    <input type="hidden" name="form-name" value="contact" />
                    <div hidden>
                      <label>
                        Don’t fill this out:{' '}
                        <input name="bot-field" onChange={this.handleChange} />
                      </label>
                    </div>
                     <WrapInput>
                    <InputLabel>Your Name:</InputLabel>
                    <Box
                      placeholder="Enter your name..."
                      type={'text'}
                      name={'name'}
                      onChange={this.handleChange}
                      id={'name'}
                      required={true}
                    />
                    <Focus></Focus>
                  </WrapInput> 
                  <WrapInput>
                    <InputLabel>Your Email:</InputLabel>
                    <Box
                      placeholder="Enter your email..."
                      type={'email'}
                      name={'email'}
                      onChange={this.handleChange}
                      id={'email'}
                      required={true}
                    />
                    <Focus></Focus>
                  </WrapInput>
                  <WrapInput>
                    <InputLabel>Message:</InputLabel>
                    <TextBox
                      placeholder="Enter your message..."
                      name={'message'}
                      onChange={this.handleChange}
                      id={'message'}
                      required={true}
                    />
                  </WrapInput>
                  <br></br>
                    <div className="field">
                      <Btn type="submit">
                        Send
                      </Btn>
                    </div>
                  </form>
                </Card>
              </Col>
            </Row>
          </Grid>
        </section>
      </Layout>
    )
  }
}
