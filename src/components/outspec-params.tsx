"use client";

import data from "@/data/data.json"; 
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button"; 
import { Card } from "./ui/card";

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

export function OutspecParameters() {
  const router = useRouter();

  return (
    <Card className="mt-8 w-full p-6 shadow-md">
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">List Outspec Parameter</h2>
        {data.map((ring: RingData) => (
          <div key={ring.ring} className="mb-6">
            <h3
              className={`text-lg font-semibold mb-2 ${
                ring.ring === "Ring 1"
                  ? "text-blue-500"
                  : ring.ring === "Ring 2"
                  ? "text-green-500"
                  : "text-orange-500"
              }`}
            >
              {ring.ring}
            </h3>
            {ring.machines.map((machine: Machine) => (
              <div key={machine.id}>
                {machine.parameters
                  .filter((param) => param.isOutspec)
                  .map((param, index) => (
                    <div
                      key={`${machine.id}-${param.name}`} 
                      className="bg-gray-100 p-4 rounded-lg flex items-center justify-between gap-4 mb-2"
                    >
                      {/* Bagian 1: Nama Mesin dan Parameter */}
                      <div className="w-1/3">
                        <h4 className="font-medium">
                          {machine.name} - {param.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {param.description}
                        </p>
                      </div>

                      <div className="w-1/6">
                        <p className="text-sm text-gray-600">
                          UOM: {param.uom}
                        </p>
                      </div>

                      <div className="w-1/6">
                        <p
                          className={`text-sm font-semibold ${
                            param.currentValue > parseInt(param.uom)
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          Current: {param.currentValue}
                        </p>
                      </div>

                      {/* Bagian 4: Tombol Detail */}
                      <div className="w-1/6 flex justify-end">
                        <Button
                          onClick={() =>
                            router.push(
                              `/machines/${
                                machine.id
                              }?ring=${ring.ring.toLowerCase()}`
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
