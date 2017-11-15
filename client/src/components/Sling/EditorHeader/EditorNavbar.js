import React from 'react';

const EditorNavbar = (props) => (
  <nav className="editor-navbar">
    <ul>
      <button onClick={props.openWindow}>Start Video Chat</button>
    </ul>
  </nav>
);

export default EditorNavbar;
