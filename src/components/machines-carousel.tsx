"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import data from "@/data/data.json";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Parameter {
  name: string;
  description: string;
  uom: string;
  std_max: number;
  std_min: number;
  currentValue: number;
}

interface Machine {
  id: number;
  name: string;
  status: string;
  parameters: Parameter[];
}

interface RingData {
  ring: string;
  machines: Machine[];
}

export function MachinesCarousel() {
  const router = useRouter();

  return (
    <Carousel className="w-full max-w-8xl mx-auto">
      <CarouselContent>
        {data.flatMap((ring: RingData) =>
          ring.machines.map((machine: Machine) => (
            <CarouselItem key={machine.id} className="basis-1/5">
              <div className="p-1">
                <div className="group h-64 w-full bg-[#3c5652] rounded-lg flex flex-col justify-between relative overflow-hidden">
                  {/* Gambar Mesin dengan Opacity Rendah */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src="/CompressorABC.png"
                      alt={machine.name}
                      className="w-full h-full object-cover opacity-50" 
                    />
                  </div>
  
                  {/* Overlay untuk Teks */}
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full ${
                          machine.status === "on" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="ml-2 text-sm font-medium text-white">
                        {machine.status}
                      </span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white">
                        {machine.name}
                      </h3>
                    </div>
                  </div>
  
                  {/* Tombol Detail (Muncul saat Hover) */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <Button
                      onClick={() =>
                        router.push(
                          `/machines/${machine.id}?ring=${ring.ring.toLowerCase()}`
                        )
                      }
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      Detail
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
