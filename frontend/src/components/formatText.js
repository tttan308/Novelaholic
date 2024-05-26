import React from "react";
function formatText(text) {
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== lines.length - 1 && <br />}
      </React.Fragment>
    ));
  }

export default formatText;
