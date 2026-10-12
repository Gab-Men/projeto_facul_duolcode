import { notFound } from "next/navigation";
import { isResource } from "../../../lib/resources";
import { RecordList } from "../../../components/admin/record-list";
export default async function Page({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResource(resource)) notFound();
  return <RecordList key={resource} resource={resource} />;
}
