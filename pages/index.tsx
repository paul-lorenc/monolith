import Head from "next/head";
import ScrollbarSize from "react-scrollbar-size";
import { useState } from "react";
import useSWR, { mutate } from "swr";

export default function Home() {
  const [scrollWidth, setScrollWidth] = useState("0");

  const [inputState, setInputState] = useState("");

  const handleChange = (e) => {
    console.log(e.target.value);
    setInputState(e.target.value);
  };

  const onScrollBarChange = ({ width }: any) => {
    setScrollWidth(width.toString() + "px");
  };

  const fetcher = (url: any) => fetch(url).then((r) => r.json());

  const onSubmit = () => {
    fetch("/api/add", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ poem: inputState }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setInputState("");
    mutate("/api/blockchain");
  };

  const { data, error } = useSWR("/api/blockchain", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  var scrollStyle = { "--scrollbarWidth": scrollWidth } as React.CSSProperties;

  return (
    <>
      <ScrollbarSize onChange={onScrollBarChange} />
      <div className="ZRoot" style={scrollStyle}>
        <form className="Input--Container">
          <textarea
            className="text Textbox--Styles"
            value={inputState}
            onChange={handleChange}
          />
          <button className="Submit--Button" onClick={onSubmit}>
            Submit
          </button>

          {data.map((d) => {
            return (
              <div key={d.prevHash}>
                <h4>{d.poem}</h4>
                <p>{d.ts}</p>
                <p>{d.prevHash}</p>
              </div>
            );
          })}
        </form>
      </div>
    </>
  );
}
