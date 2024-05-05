"use client";

import { useEffect } from "react";

export default function Chat({ accessToken }: { accessToken?: string }) {
  useEffect(() => {
    const fetchTest = async () => {
      if (!accessToken) return;
      await (
        await fetch("http://localhost:8000/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      ).json();
    };

    fetchTest();
  }, [accessToken]);

  console.log(accessToken)

  return null;
}
