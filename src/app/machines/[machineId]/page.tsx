// app/machines/[machineId]/page.tsx
import { notFound } from "next/navigation";
import data from "@/data/data.json";
import Link from "next/link";
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

export default function MachineDetail({
  params,
  searchParams,
}: {
  params: { machineId: string };
  searchParams: { ring: string };
}) {
  const machineId = parseInt(params.machineId);
  const { ring } = searchParams;

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
    <div className="p-8">

      <Link href={"/"}>
        <Button className="mb-4 bg-gray-500 text-white hover:bg-gray-600">
          Back to Home
        </Button>
      </Link>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold">{machine.name}</h2>
        <p className="text-sm text-gray-500">Status: {machine.status}</p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Parameters</h3>
          <div className="space-y-2">
            {machine.parameters.map((param, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{param.name}</h4>
                  <p className="text-sm text-gray-600">{param.description}</p>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-600">UOM: {param.uom}</p>
                </div>

                <div className="flex-1 text-right">
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

                <div className="flex-1 text-right">
                  <p
                    className={`text-sm font-semibold ${
                      param.isOutspec ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {param.isOutspec ? "Outspec" : "Normal"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
