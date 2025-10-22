import Categories from './common/Categories';

const categories = [
    {
        name: 'Clothes',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?&auto=format&fit=crop&q=80&w=735',
        alt: 'Clothes',
    },
    {
        name: 'Sneakers',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
        alt: 'Sneakers',
    },
    {
        name: 'Watches',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200&auto=format&fit=crop',
        alt: 'Watches',
    },
    {
        name: 'Handbags',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
        alt: 'Handbags',
    },
    {
        name: 'Accessories',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop',
        alt: 'Accessories',
    },
    {
        name: 'Beauty',
        href: '#',
        imageSrc: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
        alt: 'Beauty',
    },
];

const PopularCategories = () => {
    return (
        <Categories categories={categories} title="Explore Popular Categories" />
    );
};

export default PopularCategories;
