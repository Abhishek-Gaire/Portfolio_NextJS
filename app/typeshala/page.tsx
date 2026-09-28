import { getTypeshalaPageData } from "./_lib/release";
import TypeshalaPageClient from "./TypeshalaPageClient";

export default async function TypeshalaPage() {
  const data = await getTypeshalaPageData();

  return <TypeshalaPageClient data={data} />;
}
