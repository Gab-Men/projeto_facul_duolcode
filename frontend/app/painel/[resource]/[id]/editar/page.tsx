import { notFound } from "next/navigation";
import { isResource } from "../../../../../lib/resources";
import { RecordForm } from "../../../../../components/admin/record-form";
export default async function Page({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource, id } = await params;
  if (
    !isResource(resource) ||
    !/^\d+$/.test(id) ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) < 1
  )
    notFound();
  return <RecordForm key={`${resource}-${id}`} resource={resource} id={Number(id)} />;
}
