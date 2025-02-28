import Image from "next/image";
import * as React from "react";
import { MachinesCarousel } from "@/components/machines-carousel";
import { OutspecParameters } from "@/components/outspec-params";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px]">
      <main className="flex flex-col gap-8 row-start-2 mx-3 items-center sm:items-start">
        <MachinesCarousel />
        <OutspecParameters/>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
