import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Design from '../models/Design';
import User from '../models/User';
import connectDB from '../config/db';

dotenv.config();

const seedDesigns = async () => {
    await connectDB();

    // Find users to assign as uploaders
    const adminUser = await User.findOne({ email: 'admin@teestore.com' });
    const influencerUser = await User.findOne({ role: 'influencer' });
    const designerUser = await User.findOne({ role: 'designer' });

    if (!adminUser) {
        console.log('Admin user not found! Please create an admin user first.');
        process.exit(1);
    }

    // Use admin as fallback if no influencer or designer exists
    const uploaderInfluencer = influencerUser || adminUser;
    const uploaderDesigner = designerUser || adminUser;

    const sampleDesigns = [
        {
            title: 'Cherry Blossom Moonlight',
            description: 'Pixel art tasarımı - Ay ışığında pembe kiraz ağacı. Sakin ve huzurlu bir atmosfer.',
            price: 299.00,
            category: 'tshirt',
            tags: ['pixel-art', 'nature', 'moon', 'cherry-blossom', 'pink'],
            images: {
                original: '/uploads/cherry-blossom-tree.jpg',
                thumbnail: '/uploads/cherry-blossom-tree.jpg',
                preview: '/uploads/cherry-blossom-tree.jpg'
            },
            uploadedBy: uploaderInfluencer._id,
            userRole: 'influencer',
            status: 'published',
            stock: 50
        },
        {
            title: 'Sunset Road Trip',
            description: 'Pixel art tasarımı - Gün batımında nostaljik bir yolculuk. Retro araba ve turuncu gökyüzü.',
            price: 289.00,
            category: 'tshirt',
            tags: ['pixel-art', 'sunset', 'car', 'retro', 'orange'],
            images: {
                original: '/uploads/sunset-car.jpg',
                thumbnail: '/uploads/sunset-car.jpg',
                preview: '/uploads/sunset-car.jpg'
            },
            uploadedBy: uploaderInfluencer._id,
            userRole: 'influencer',
            status: 'published',
            stock: 45
        },
        {
            title: 'Minimalist Mountain Hoodie',
            description: 'Sade ve şık dağ manzarası tasarımı. Doğa severler için ideal.',
            price: 450.00,
            category: 'hoodie',
            tags: ['minimalist', 'mountain', 'nature', 'clean'],
            images: {
                original: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                preview: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            uploadedBy: uploaderDesigner._id,
            userRole: 'designer',
            status: 'published',
            stock: 30
        },
        {
            title: 'Retro Wave 80s',
            description: '80\'lerin nostaljik retro wave tasarımı. Canlı renkler ve geometrik şekiller.',
            price: 275.00,
            category: 'tshirt',
            tags: ['retro', '80s', 'wave', 'vintage', 'neon'],
            images: {
                original: 'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                preview: 'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            uploadedBy: uploaderInfluencer._id,
            userRole: 'influencer',
            status: 'published',
            stock: 60
        },
        {
            title: 'Abstract Art Sweatshirt',
            description: 'Modern soyut sanat tasarımı. Stilize yüz detayları ile dikkat çekici.',
            price: 420.00,
            category: 'sweatshirt',
            tags: ['abstract', 'art', 'modern', 'face'],
            images: {
                original: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                preview: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            uploadedBy: uploaderDesigner._id,
            userRole: 'designer',
            status: 'published',
            stock: 25
        },
        {
            title: 'Urban Street Art',
            description: 'Sokak sanatı esintili cesur tasarım. Grafiti elementleri ve şehir kültürü.',
            price: 265.00,
            category: 'tshirt',
            tags: ['street', 'urban', 'graffiti', 'bold'],
            images: {
                original: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                preview: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            uploadedBy: uploaderInfluencer._id,
            userRole: 'influencer',
            status: 'published',
            stock: 55
        },
        {
            title: 'Geometric Coffee Mug',
            description: 'Uyumlu renk paletinde karmaşık geometrik desenler. Desen severler için mükemmel.',
            price: 120.00,
            category: 'mug',
            tags: ['geometric', 'pattern', 'shapes', 'modern'],
            images: {
                original: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            uploadedBy: uploaderDesigner._id,
            userRole: 'designer',
            status: 'published',
            stock: 80
        },
        {
            title: 'Space Explorer Poster',
            description: 'Gezegenler, yıldızlar ve galaksiler içeren kozmik tasarım. Hayalperestler için.',
            price: 180.00,
            category: 'poster',
            tags: ['space', 'cosmic', 'planets', 'stars'],
            images: {
                original: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                preview: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            uploadedBy: uploaderInfluencer._id,
            userRole: 'influencer',
            status: 'published',
            stock: 40
        },
        {
            title: 'Vintage Typography Sticker Pack',
            description: 'Retro fontlar ve yıpranmış efektlerle klasik vintage tipografi.',
            price: 65.00,
            category: 'sticker',
            tags: ['vintage', 'typography', 'retro', 'classic'],
            images: {
                original: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                preview: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            uploadedBy: uploaderDesigner._id,
            userRole: 'designer',
            status: 'published',
            stock: 100
        },
        {
            title: 'Neon Cyberpunk',
            description: 'Fütüristik neon tasarım, cyberpunk estetiğinden ilham alınmıştır.',
            price: 310.00,
            category: 'tshirt',
            tags: ['cyberpunk', 'neon', 'futuristic', 'tech'],
            images: {
                original: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                preview: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            uploadedBy: uploaderInfluencer._id,
            userRole: 'influencer',
            status: 'published',
            stock: 35
        }
    ];

    // Clear existing designs
    await Design.deleteMany({});
    console.log('Cleared existing designs.');

    // Insert sample designs
    const createdDesigns = await Design.insertMany(sampleDesigns);
    console.log(`✅ Successfully created ${createdDesigns.length} sample designs!`);

    createdDesigns.forEach(design => {
        console.log(`- ${design.title} (${design.category}) - Stock: ${design.stock}`);
    });

    process.exit();
};

seedDesigns();
