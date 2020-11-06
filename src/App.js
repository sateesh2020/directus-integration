import React, { useState, useEffect, useRef } from "react";

import Directus from "./directus";

const App = () => {
  const [webinars, setWebinars] = useState([]);
  const [more, setMore] = useState("false");
  const componentIsMounted = useRef(true);

  useEffect(() => {
    // each useEffect can return a cleanup function
    return () => {
      componentIsMounted.current = false;
    };
  }, []); // no extra deps => the cleanup function run this on component unmount

  useEffect(() => {
    async function fetchWebinars() {
      try {
        const directUsClient = await Directus.getInstance();
        const webinarsResp = await directUsClient.getItems("webinars", {
          fields: "*,image.*,speakers.*.*",
        });

        if (componentIsMounted.current) {
          setWebinars(webinarsResp.data);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchWebinars();
  }, [more]);
  return (
    <div>
      <pre>{JSON.stringify(webinars, null, 2)}</pre>
    </div>
  );
};

export default App;
