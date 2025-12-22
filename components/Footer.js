import React from "react";

const Footer = () => {
  return (
    <footer>
      <div>© 2025 Playlist Anatomy</div>
      <div>
        <a href="/terms">Terms of Service</a>
        {" · "}
        <a href="/privacy">Privacy Policy</a>
        {" · "}
        <a href="https://github.com/rencewang/spotlist-analysis" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
