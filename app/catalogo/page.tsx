import { getCategoriesWithItems } from "@/lib/actions/catalog"
import { CatalogClient } from "./catalog-client"

export default async function CatalogoPage() {
  const categories = await getCategoriesWithItems()
  
  return <CatalogClient categories={categories} />
}
