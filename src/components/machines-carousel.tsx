"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import data from "@/data/data.json"; 
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";

export function MachinesCarousel() {
  const router = useRouter(); 

  return (
    <Carousel className="w-full max-w-[1700px] mx-auto">
      <CarouselContent>
        {data.map((machine) => (
          <CarouselItem key={machine.id} className="basis-1/5">
            <div className="p-1">
              <div className="group h-48 w-full bg-gray-100 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
                {/* Bagian atas: Ikon dan status */}
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full ${
                      machine.status === "on" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="ml-2 text-sm font-medium">
                    {machine.status}
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{machine.name}</h3>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => router.push(`/machines/${machine.id}`)} 
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Detail
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}