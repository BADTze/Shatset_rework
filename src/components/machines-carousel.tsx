"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RMachines } from "@/types/strapi";
import { STRAPI_API_TOKEN, STRAPI_URL } from "@/constants";
import { useEffect, useState } from "react";

export function MachinesCarousel() {
  const router = useRouter();
  const [machinesData, setMachinesData] = useState<RMachines | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/shatset-machines?populate[photo_asset][fields][0]=name&populate[photo_asset][fields][1]=url&populate[shatset_data_trends]=1`,
          {
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: RMachines = await response.json();
        setMachinesData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!machinesData) return null;

  return (
    <Carousel className="relative w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <CarouselContent>
        {machinesData.data.map((machine) => (
          <CarouselItem key={machine.id} className="basis-1/3">
            <div className="p-1">
              <div className="group h-64 w-full bg-[#3c5652] rounded-lg flex flex-col justify-between relative overflow-hidden">
                {/* Gambar Mesin dengan Opacity Rendah */}
                <div className="absolute inset-0 z-0">
                  {machine.attributes.photo_asset.data?.length > 0 && (
                    <img
                      src={`${STRAPI_URL}${machine.attributes.photo_asset.data[0].attributes.url}`}
                      alt={machine.attributes.photo_asset.data[0].attributes.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                  )}
                </div>

                {/* Overlay untuk Teks */}
                <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        machine.attributes.aveva_tag_status === "on"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="ml-2 text-sm font-medium text-white">
                      {machine.attributes.aveva_tag_status}
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">
                      {machine.attributes.asset_name}
                    </h3>
                  </div>
                </div>

                {/* Tombol Detail (Muncul saat Hover) */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Button
                    onClick={() =>
                      router.push(
                        `/machines/${machine.id}`
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
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute w-12 h-12 top-1/2 left-2 transform -translate-y-1/2 z-10"/>
      <CarouselNext className="absolute w-12 h-12 top-1/2 right-2 transform -translate-y-1/2 z-10"/>
    </Carousel>
  );
}