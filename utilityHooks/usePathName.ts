import React, { useState, useEffect } from "react";

const usePathname = () => {
  const [postId, setPostId] = useState("");

  useEffect(() => {
    const pathname = window.location.pathname;
    const splittedPathname = pathname.split("/");
    console.log("pathanme", splittedPathname);

    const dynamicId = splittedPathname[2];
    setPostId(dynamicId);
  }, []);

  return { postId };
};

export default usePathname;
