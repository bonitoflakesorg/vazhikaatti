"use client";

import { HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex w-full h-screen items-center justify-center bg-white flex-col gap-6" style={{ fontFamily: "var(--font-josefin-sans), 'Josefin Sans', sans-serif" }}>
      <HashLoader color="#10b981" size={50} />
    </div>
  );
}
