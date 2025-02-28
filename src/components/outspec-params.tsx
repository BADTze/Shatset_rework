"use client";

import data from "@/data/outspec-params.json";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MachineParameter {
  id: string; 
  name: string;
  description: string;
  stdMax: string;
  currentValue: number;
}

interface RingData {
  ring: string;
  parameters: MachineParameter[];
}

export function OutspecParameters() {
  const router = useRouter();

  return (
    <Card className="mt-8 w-full p-6 shadow-md">
      <div className=" w-full">
        <h2 className="text-xl font-bold mb-4">List Outspec Parameter</h2>
        {(data as RingData[]).map((ring) => (
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
            {ring.parameters.length > 0 ? (
              <div className="space-y-3">
                {ring.parameters.map((param, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg flex items-center justify-between gap-x-4 shadow-sm border"
                  >
                    <div className="w-1/5">
                      <h4 className="font-medium text-base">{param.name}</h4>
                    </div>
                    <div className="w-1/3">
                      <p className="text-sm text-gray-600">{param.description}</p>
                    </div>
                    <div className="w-1/6">
                      <p className="text-sm text-gray-600 font-medium">
                        Max: {param.stdMax}
                      </p>
                    </div>
                    <div className="w-1/6">
                      <p
                        className={`text-sm font-semibold ${
                          param.currentValue > parseInt(param.stdMax)
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        Current: {param.currentValue}
                      </p>
                    </div>
                    <div className="w-1/6 flex justify-end">
                      <Button
                        onClick={() =>
                          router.push(
                            `/ring-${ring.ring.toLowerCase()}/machines/${param.id}`
                          )
                        }
                        className="bg-white text-black hover:bg-gray-200 px-4 py-2"
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No outspec parameters.</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
