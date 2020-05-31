import React from "react";

import { FaTwitter, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Socials(props) {
  const { twitter, github, linkedin, email } = props;

  let socials = [];
  if (github) {
    socials.push(
      <a key="github" className="panel-block" href={`https://github.com/${github}`}>
        <span className="panel-icon">
          <FaGithub />
        </span>
        GitHub
      </a>
    );
  }
  if (twitter) {
    socials.push(
      <a key="twitter" className="panel-block" href={`https://twitter.com/${twitter}`}>
        <span className="panel-icon">
          <FaTwitter />
        </span>
        Twitter
      </a>
    );
  }
  if (linkedin) {
    socials.push(
      <a key="linkedin" className="panel-block" href={`https://linkedin.com/in/${linkedin}`}>
        <span className="panel-icon">
          <FaLinkedin />
        </span>
        Linkedin
      </a>
    );
  }
  if (email) {
    socials.push(
      <a key="email" className="panel-block" href={`mailto:${email}`}>
        <span className="panel-icon">
          <FaEnvelope />
        </span>
        Email
      </a>
    );
  }

  return (
    <div className="panel">
      <p className="panel-heading">Socials</p>
      {socials}
    </div>
  );
}
