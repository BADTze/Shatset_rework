"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import data from "@/data/data.json"; 
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";

interface Parameter {
  name: string;
  description: string;
  uom: string;
  currentValue: number;
  isOutspec: boolean;
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
    <Carousel className=" w-full max-w-8xl mx-auto">
      <CarouselContent>
        {data.flatMap((ring: RingData) =>
          ring.machines.map((machine: Machine) => (
            <CarouselItem key={machine.id} className="basis-1/5">
              <div className="p-1">
                <div className="group h-48 w-full bg-gray-100 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
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
                      onClick={() =>
                        router.push(`/machines/${machine.id}?ring=${ring.ring.toLowerCase()}`)
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