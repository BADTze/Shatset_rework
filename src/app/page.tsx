import Image from "next/image";
import * as React from "react";
import { MachinesCarousel } from "@/components/machines-carousel";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <MachinesCarousel />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
