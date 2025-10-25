import ProductsList from '@/components/__pageCommons/ProductsList';
import api from '@/lib/api';

export default async function ProductsPage({searchParams }) {
  const q = searchParams.q || '';
  const category = searchParams.category || '';

  console.log(`query: ${q}, category: ${category}`);

  // Server-side data fetch
  const res = await api.get('/product/', {
    params: { q, category },
  });

  const products = res.data.products || [];


  return (
    <main className="max-w-7xl mx-auto px-4 py-10 mt-10 ">
      <h1 className="text-3xl font-semibold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductsList key={p._id} product={p} />
        ))}
      </div>    </main>
  );
}
