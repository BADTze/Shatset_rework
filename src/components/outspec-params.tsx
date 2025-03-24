"use client";

import data from "@/data/data.json";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Parameter {
  name: string;
  // description: string;
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

export function OutspecParameters() {
  const router = useRouter();

  return (
    <Card className=" w-full p-6 shadow-md bg-[#f8da91]">
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">List Outspec Parameters</h2>
        {data.map((ring: RingData) => (
          <div key={ring.ring} className="mb-6">
            <h3 className="mb-2">{ring.ring}</h3>

            {ring.machines.map((machine: Machine) => (
              <div key={machine.id}>
                {machine.parameters
                  .filter(
                    (param) =>
                      param.currentValue > param.std_max ||
                      param.currentValue < param.std_min
                  )
                  .map((param) => (
                    <div
                      key={`${machine.id}-${param.name}`}
                      className="bg-gray-100 p-4 rounded-lg flex items-center justify-between gap-4 mb-2"
                    >
                      <div className="w-1/3">
                        <h4 className="font-medium">
                          {machine.name} - {param.name}
                        </h4>
                        {/* <p className="text-sm text-gray-600">
                          {param.description}
                        </p> */}
                      </div>
                      <div className="w-1/6">
                        <p className="text-sm text-gray-600">UOM: {param.uom}</p>
                      </div>
                      <div className="w-1/6">
                        <p
                          className={`text-sm font-semibold ${
                            param.currentValue > param.std_max ||
                            param.currentValue < param.std_min
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          Current: {param.currentValue}
                        </p>
                        <p className="text-sm text-gray-600">
                          Range: {param.std_min} - {param.std_max}
                        </p>
                      </div>
                      <div className="w-1/6 flex justify-end">
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
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}