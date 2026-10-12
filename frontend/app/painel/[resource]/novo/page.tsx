import { notFound } from "next/navigation";
import { isResource } from "../../../../lib/resources";
import { RecordForm } from "../../../../components/admin/record-form";
export default async function Page({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResource(resource)) notFound();
  return <RecordForm key={resource} resource={resource} />;
}
