import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import MacWindow from "./MacWindow";
import axios from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierDuneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Note = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {

    const fetchNotes = async () => {
      try {

        const response = await axios.get("/documents/Notes.md");

        setMarkdown(response.data);

      } catch (error) {
        console.log("Error Fetching Notes:", error);
      }
    };

    fetchNotes();

  }, []);

  return (
    <MacWindow>

      <div className="w-full h-full overflow-y-auto bg-[#0d1117] text-white ">
       {markdown? <SyntaxHighlighter language="typescript" style={atelierDuneDark}>{markdown}</SyntaxHighlighter> : <p>Loading...</p>}
        
      </div>

    </MacWindow>
  );
};

export default Note;