import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const SCRAPBOX_ROOT = "https://scrapbox.io";

/**
 * @param {Date} date
 */
const createDateString = (date) => {
  // Extract year, month and day components
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const day = date.getDate().toString().padStart(2, "0");

  // Concatenate the components to create the desired string
  const dateString = [year, month, day].join("/");

  return dateString;
};

function App() {
  const dialogRef = useRef();

  const [projectId, setProjectId] = useState(localStorage.getItem("projectId"));
  const [now, setNow] = useState(new Date());
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const dateString = useMemo(() => createDateString(now), [now]);
  const timeString = useMemo(
    () =>
      now
        .toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
        .slice(0, 5),
    [now]
  );

  const urlParams = useMemo(() => {
    const url = new URL(location.href);
    const params = url.searchParams;
    return params;
  }, []);

  const linkLiteral = useMemo(() => {
    if (urlParams.get("text") && urlParams.get("title")) {
      return `[${urlParams.get("text")} ${urlParams.get("title")}]`;
    }
  }, [urlParams]);

  const body = useMemo(() => {
    const textLines = text.split("\n");
    const maybeLinkLiteral = linkLiteral ? [linkLiteral] : [];
    const bodyLines = [timeString, ...maybeLinkLiteral, ...textLines];
    const quoteLines = bodyLines.map((line) => "> " + line);
    return quoteLines.join("\n");
  }, [linkLiteral, text, timeString]);

  const newPagePath = useMemo(
    () =>
      [
        SCRAPBOX_ROOT,
        projectId,
        encodeURIComponent(title || dateString) +
          "?body=" +
          encodeURIComponent(body),
      ].join("/"),
    [projectId, title, dateString, body]
  );

  const createPage = useCallback(
    (e) => {
      e.preventDefault();
      setText("");
      window.open(newPagePath, "_blank");
    },
    [newPagePath]
  );

  const updateProjectId = useCallback((e) => {
    const newProjectId = e.target.value;
    setProjectId(newProjectId);
    localStorage.setItem("projectId", newProjectId);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!projectId) {
      dialogRef.current.showModal();
    }
  }, [projectId]);

  return (
    <>
      <h1>
        {linkLiteral ? (
          <a href={urlParams.get("text")}>{urlParams.get("title")}</a>
        ) : (
          "Scrapbox Lifelog"
        )}
      </h1>
      <div className="card">
        <form onSubmit={createPage}>
          <label className="right">
            <input
              type="text"
              name="title"
              placeholder={dateString}
              value={title}
              onInput={(e) => setTitle(e.target.value)}
            />
          </label>
          <textarea
            value={text}
            name="body"
            placeholder="..."
            onChange={(e) => setText(e.target.value)}
            autoFocus={true}
          />
          <button type="submit" className="wide" onClick={createPage}>
            Post
          </button>
        </form>
      </div>
      <div className="card">
        <button type="button" onClick={() => dialogRef.current.showModal()}>
          Settings
        </button>
      </div>
      <dialog ref={dialogRef}>
        <p>
          <input
            type="text"
            name="project-id"
            placeholder="project-id"
            value={projectId}
            onInput={updateProjectId}
            required={true}
            autoFocus={true}
          />
        </p>
        <p>
          <button
            type="button"
            onClick={() => dialogRef.current.close()}
            disabled={!projectId}
          >
            OK
          </button>
        </p>
      </dialog>
    </>
  );
}

export default App;
