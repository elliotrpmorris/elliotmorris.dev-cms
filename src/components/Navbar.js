import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components";

export const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  flex-wrap: wrap;
`;

export const Page = styled(Link)`
    cursor: pointer;
    margin: 1.5rem 1rem 1.5rem 1rem;
    font-size: 1.25rem;
    
    &:last-child {
      margin-right: 0;
    }

    &:after {
      content: "";
      display: block;
      width: 0;
      height: 2px;
      background: #000000;
      transition: width 0.3s;
      transform: background 0.5s;
      position: relative;
      z-index: 2;
    }

    @media (hover) {
      &:hover,
      &:focus {
        color: #000000;
        transition: color 0.6s;
        &:after {
          width: 100%;
        }
      }
`;

const Navbar = class extends React.Component {
  render() {
    return (
      <NavBar
        role="navigation"
        aria-label="main-navigation"
      >
        <Page to="/">
          Home
        </Page>
        <Page to="/about">
          About
        </Page>
        <Page to="/blog">
          Blog
        </Page>
        <Page to="/contact">
          Contact
        </Page>
      </NavBar>
    )
  }
}

export default Navbar
