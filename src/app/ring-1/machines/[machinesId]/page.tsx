import { notFound } from "next/navigation";
import data from "@/data/data.json";

interface Machine {
  id: number;
  name: string;
  status: string;
}

export async function generateStaticParams() {
  return data.map((machine) => ({
    machinesId: machine.id.toString(),
  }));
}

export default function MachineDetail({
  params,
}: {
  params: { machinesId: string };
}) {

  const machinesId = parseInt(params.machinesId);
  const machine: Machine | undefined = data.find((m) => m.id === machinesId);

  if (!machine) {
    notFound();
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Detail Mesin</h1>
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold">{machine.name}</h2>
        <p className="text-sm text-gray-500">Status: {machine.status}</p>
      </div>
    </div>
  );
}
