import React from 'react'
import Categories from './common/Categories';

const newArrivalsData = [
    {
        id: 1,
        name: 'Kitchen',
        alt: 'Kitchen',
        imageSrc: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
        href: '#'
    },
    {
        id: 2,
        name: 'Furniture',
        alt: 'Furniture',
        imageSrc: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
        href: '#'
    },
    {
        id: 3,
        name: 'Bedding',
        alt: 'Bedding',
        imageSrc: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1200&auto=format&fit=crop',
        href: '#'
    },
    {
        id: 4,
        name: 'Décor',
        alt: 'Décor',
        imageSrc: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop',
        href: '#'
    },
    {
        id: 5,
        name: 'Lighting',
        alt: 'Lighting',
        imageSrc: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
        href: '#'
    }
];

const NewArrivals = () => {
  return (
    <Categories categories={newArrivalsData} title={"New Arrivals From Home"} />
  )
}

export default NewArrivals
