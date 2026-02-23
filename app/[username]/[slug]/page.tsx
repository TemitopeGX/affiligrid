
import ProductClient from './ProductClient';
import { Metadata, ResolvingMetadata } from 'next';

async function getProduct(username: string, slug: string) {
    try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const apiUrl = `${apiBase}/v1`;
        // Ensure strictly constructed URL to avoid double slashes or missing parts
        const endpoint = `${apiUrl}/products/${username}/${slug}`;

        const res = await fetch(endpoint, { cache: 'no-store' });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (e) {
        console.error('Failed to fetch product', e);
        return null;
    }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const resolvedParams = await params;
    const data = await getProduct(resolvedParams.username, resolvedParams.slug);

    if (!data || !data.product) {
        return {
            title: 'Product Not Found - AffiliGrid',
            description: 'The requested product could not be found.',
        };
    }

    const { product } = data;
    // Format: Product Name ($Price) - Description Snippet
    const priceStr = product.price ? `($${Number(product.price).toLocaleString()})` : '';
    const cleanDesc = product.description
        ? product.description
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 150)
        : 'Check out this product on AffiliGrid';

    const title = `${product.title} ${priceStr}`;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')?.replace('/api', '') || 'http://localhost:8000';
    const imageUrl = product.image_path ? `${baseUrl}/storage/${product.image_path}` : null;

    return {
        title: title,
        description: cleanDesc,
        openGraph: {
            title: title,
            description: cleanDesc,
            images: imageUrl ? [{ url: imageUrl }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: cleanDesc,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export default async function Page({ params }: any) {
    const resolvedParams = await params;
    const data = await getProduct(resolvedParams.username, resolvedParams.slug);

    return (
        <ProductClient
            username={resolvedParams.username}
            slug={resolvedParams.slug}
            product={data?.product || null}
            stats={{
                avg_rating: data?.avg_rating || 0,
                reviews_count: data?.reviews_count || 0
            }}
            reviews={data?.product?.reviews || []}
            store={data?.store || null}
        />
    );
}
