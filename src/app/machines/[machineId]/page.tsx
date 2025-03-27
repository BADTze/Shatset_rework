import { notFound } from "next/navigation";
import data from "@/data/data.json";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/date-picker";

interface Parameter {
  name: string;
  description: string;
  uom: string;
  currentValue: number;
  std_max: number;
  std_min: number;
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

export default async function MachineDetail({
  params,
  searchParams,
}: {
  params: { machineId: string };
  searchParams: { ring: string };
}) {
  const awaitedparams = await params
  const machineId = parseInt(awaitedparams.machineId);
  const awaitedsearchparams= await searchParams
  const ring = awaitedsearchparams.ring;

  const ringData: RingData | undefined = data.find(
    (r) => r.ring.toLowerCase() === ring.toLowerCase()
  );
  const machine: Machine | undefined = ringData?.machines.find(
    (m) => m.id === machineId
  );
  if (!machine) {
    notFound();
  }

  return (
    <div className="p-5">
      <header className="flex justify-between items-center py-4 px-6 mb-4 border-gray-800 bg-gray-100 shadow-md">
        <Link href="/">
          <Button className="btn text-black font-bold px-6 py-2 rounded-full bg-[#f8da91] hover:bg-[#ebc979] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#f8da91]">
            Back to Home
          </Button>
        </Link>
        <DateRangePicker/>
      </header>

      <div className="bg-[#2c3e3a] text-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold">{machine.name}</h2>
        <p className="text-sm">Status: {machine.status}</p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Parameters</h3>
          <div className="space-y-2">
            {machine.parameters.map((param, index) => {
              const isOutspec =
                param.currentValue >= param.std_max ||
                param.currentValue <= param.std_min;
              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-black">{param.name}</h4>
                    {/* <p className="text-sm text-gray-600">{param.description}</p> */}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">UOM: {param.uom}</p>
                  </div>
                  <div className="flex-1 ">
                    <p
                      className={`text-sm font-semibold ${
                        isOutspec ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      Current: {param.currentValue}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isOutspec ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {isOutspec ? "Outspec" : "Normal"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
