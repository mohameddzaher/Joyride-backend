// ============================================
// JOYRIDE API - Database Seed Script
// ============================================

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Review } from '../models/Review';
import { Order } from '../models/Order';
import { Offer } from '../models/Offer';
import { Banner } from '../models/Banner';
import { BlogPost, BlogCategory } from '../models/Blog';
import { CMSContent, PolicyPage, FAQ } from '../models/CMS';
import { Notification } from '../models/Notification';

// Product image base paths
const GAMES_IMG = '/images/products/games';
const BOX_IMG = '/images/products/box';

const bannerImages = [
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1600',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1600',
  'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1600',
];

const blogImages = [
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800',
  'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=800',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
];

async function clearDatabase(): Promise<void> {
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Order.deleteMany({}),
    Offer.deleteMany({}),
    Banner.deleteMany({}),
    BlogPost.deleteMany({}),
    BlogCategory.deleteMany({}),
    CMSContent.deleteMany({}),
    PolicyPage.deleteMany({}),
    FAQ.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('✅ Database cleared');
}

async function seedUsers(): Promise<{
  superAdmin: any;
  admin: any;
  users: any[];
}> {
  console.log('👤 Seeding users...');

  const superAdmin = await User.create({
    email: 'admin@joyride.com',
    password: 'admin123',
    firstName: 'Joyride',
    lastName: 'Admin',
    phone: '+966501234567',
    role: 'super_admin',
    isActive: true,
    isEmailVerified: true,
    addresses: [
      {
        id: uuidv4(),
        label: 'Office',
        fullAddress: '123 Business Tower, Olaya District',
        city: 'Riyadh',
        area: 'Olaya',
        building: 'Tower A',
        floor: '15',
        isDefault: true,
      },
    ],
  });

  const admin = await User.create({
    email: 'staff@joyride.com',
    password: 'staff123',
    firstName: 'Joyride',
    lastName: 'Staff',
    phone: '+966501234568',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    createdBy: superAdmin._id,
    permissions: {
      orders: { read: true, write: true },
      products: { read: true, write: true },
      offers: { read: true, write: true },
      reviews: { moderate: true },
      analytics: { limited: true, full: false },
      staff: { read: false, write: false },
      cms: { read: true, write: true },
    },
  });

  const regularUsers = await User.create([
    {
      email: 'user@joyride.com',
      password: 'user123',
      firstName: 'Sarah',
      lastName: 'Ahmed',
      phone: '+966501234569',
      role: 'user',
      isActive: true,
      isEmailVerified: true,
      addresses: [
        {
          id: uuidv4(),
          label: 'Home',
          fullAddress: '45 King Fahd Road, Al Malaz',
          city: 'Riyadh',
          area: 'Al Malaz',
          building: '12',
          floor: '3',
          apartment: '5',
          isDefault: true,
        },
      ],
    },
    {
      email: 'fatma@example.com',
      password: 'password123',
      firstName: 'Fatma',
      lastName: 'Ali',
      phone: '+966501234570',
      role: 'user',
      isActive: true,
      isEmailVerified: true,
      addresses: [
        {
          id: uuidv4(),
          label: 'Home',
          fullAddress: '78 Prince Sultan Road, Al Rawdah',
          city: 'Jeddah',
          area: 'Al Rawdah',
          isDefault: true,
        },
      ],
    },
    {
      email: 'omar@example.com',
      password: 'password123',
      firstName: 'Omar',
      lastName: 'Mohamed',
      phone: '+966501234571',
      role: 'user',
      isActive: true,
      isEmailVerified: false,
    },
  ]);

  console.log(`✅ Created ${3 + regularUsers.length} users`);
  return { superAdmin, admin, users: regularUsers };
}

async function seedCategories(): Promise<any[]> {
  console.log('📁 Seeding categories...');

  const categories = await Category.create([
    {
      name: 'Sensory Toys',
      slug: 'sensory-toys',
      description: 'Tactile, visual, and auditory toys that stimulate the senses and support sensory processing development.',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400',
      icon: 'hand-sparkles',
      order: 1,
      isActive: true,
    },
    {
      name: 'Fine Motor Skills',
      slug: 'fine-motor-skills',
      description: 'Toys designed to strengthen hand-eye coordination, grip strength, and dexterity in children.',
      image: 'https://images.unsplash.com/photo-1596623941602-d89b5684ebad?w=400',
      icon: 'puzzle-piece',
      order: 2,
      isActive: true,
    },
    {
      name: 'Speech & Communication Tools',
      slug: 'speech-communication',
      description: 'Tools and toys that encourage language development, verbal expression, and social communication skills.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
      icon: 'comments',
      order: 3,
      isActive: true,
    },
    {
      name: 'Autism Support Toys',
      slug: 'autism-support',
      description: 'Specially designed toys to help children on the autism spectrum with calming, focus, and social interaction.',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400',
      icon: 'heart',
      order: 4,
      isActive: true,
    },
    {
      name: 'Cognitive Development Games',
      slug: 'cognitive-development',
      description: 'Games and activities that build problem-solving, memory, logic, and critical thinking skills.',
      image: 'https://images.unsplash.com/photo-1560859251-d563a49c0832?w=400',
      icon: 'brain',
      order: 5,
      isActive: true,
    },
    {
      name: 'Montessori Play Kits',
      slug: 'montessori-kits',
      description: 'Montessori-inspired materials that foster independent learning, exploration, and hands-on discovery.',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
      icon: 'seedling',
      order: 6,
      isActive: true,
    },
    {
      name: 'Therapy Support Tools',
      slug: 'therapy-support',
      description: 'Professional-grade tools for occupational therapy, physical therapy, and emotional regulation.',
      image: 'https://images.unsplash.com/photo-1566004100477-7b6fbb2895b4?w=400',
      icon: 'hands-helping',
      order: 7,
      isActive: true,
    },
    {
      name: 'Creative Learning Sets',
      slug: 'creative-learning',
      description: 'Art, music, and craft kits that inspire imagination, self-expression, and creative thinking.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
      icon: 'palette',
      order: 8,
      isActive: true,
    },
  ]);

  console.log(`✅ Created ${categories.length} categories`);
  return categories;
}

async function seedProducts(categories: any[]): Promise<any[]> {
  console.log('📦 Seeding products...');

  const sensoryCat = categories.find((c) => c.name === 'Sensory Toys');
  const fineMotorCat = categories.find((c) => c.name === 'Fine Motor Skills');
  const speechCat = categories.find((c) => c.name === 'Speech & Communication Tools');
  const autismCat = categories.find((c) => c.name === 'Autism Support Toys');
  const cognitiveCat = categories.find((c) => c.name === 'Cognitive Development Games');
  const montessoriCat = categories.find((c) => c.name === 'Montessori Play Kits');
  const therapyCat = categories.find((c) => c.name === 'Therapy Support Tools');
  const creativeCat = categories.find((c) => c.name === 'Creative Learning Sets');

  const products = await Product.create([
    // ========== SENSORY TOYS ==========

    // 1. Shadow Matching Wooden Tiles
    {
      title: 'Shadow Matching Wooden Tiles',
      brand: 'Joyride',
      sku: 'JR-SEN-001',
      description: 'A set of beautifully illustrated wooden tiles featuring fruits and everyday objects paired with their shadow silhouette cards. Children match each colorful tile to its correct shadow outline, strengthening visual discrimination, shape recognition, and early cognitive skills. This engaging activity builds focus and attention to detail while providing a calming, screen-free sensory experience.',
      shortDescription: 'Wooden fruit and object tiles with shadow silhouette matching cards for visual discrimination.',
      specs: [
        { name: 'Age Group', value: '2+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Visual Discrimination & Shape Recognition', group: 'Development' },
        { name: 'Material Safety', value: 'Non-toxic, BPA-free wood finish', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Sensory Integration', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, clinic, classroom', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Start with fewer tiles and gradually increase difficulty; name objects aloud during play', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      deliveryNotes: 'Free delivery. Gift wrapping available.',
      price: 55,
      compareAtPrice: 75,
      discount: 27,
      stockQuantity: 80,
      lowStockThreshold: 12,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17844967242447527.jpg`, alt: 'Shadow Matching Wooden Tiles - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/17860371969384745.jpg`, alt: 'Shadow Matching Tiles - Matching in Progress', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${GAMES_IMG}/18036572192552437.jpg`, alt: 'Shadow Matching Tiles - Close Up', isPrimary: false, order: 2 },
        { id: uuidv4(), url: `${GAMES_IMG}/18039446573212857.jpg`, alt: 'Shadow Matching Tiles - All Pieces', isPrimary: false, order: 3 },
      ],
      categoryId: sensoryCat._id,
      tags: ['sensory', 'shadow-matching', 'visual-discrimination', 'wooden-toy'],
      faqs: [
        { id: uuidv4(), question: 'How many tile pairs are included?', answer: 'The set includes multiple fruit and object tiles with their corresponding shadow silhouette cards, providing varied matching challenges.', order: 0 },
        { id: uuidv4(), question: 'Is this suitable for toddlers?', answer: 'Yes, the chunky wooden tiles are designed for small hands and the simple matching concept is ideal for children aged 2 and above.', order: 1 },
      ],
      isActive: true,
      isFeatured: true,
      averageRating: 4.8,
      reviewCount: 156,
      soldCount: 340,
      viewCount: 4500,
    },

    // 2. Color Ball Sorting Game
    {
      title: 'Color Ball Sorting Game',
      brand: 'Joyride',
      sku: 'JR-SEN-002',
      description: 'A vibrant sorting activity set featuring colored balls, child-safe tweezers, test tube holders, and pattern cards. Children use the tweezers to pick up and sort colorful balls into matching test tubes following the pattern cards. This game strengthens fine motor grip, color recognition, and hand-eye coordination while providing satisfying sensory feedback.',
      shortDescription: 'Colored balls with tweezers, test tubes, and pattern cards for sorting and fine motor practice.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Color Sorting & Sensory Processing', group: 'Development' },
        { name: 'Material Safety', value: 'BPA-free plastic, non-toxic materials', group: 'Safety' },
        { name: 'Certification', value: 'CE, ASTM F963', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Sensory Integration, Occupational Therapy', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, daycare, therapy clinic', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Encourage using tweezers for extra fine motor challenge; count balls aloud for math practice', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 59,
      stockQuantity: 70,
      lowStockThreshold: 10,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17908067562099786.jpg`, alt: 'Color Ball Sorting Game - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18471368395065650.jpg`, alt: 'Color Ball Sorting Game - Close Up', isPrimary: false, order: 1 },
      ],
      categoryId: sensoryCat._id,
      tags: ['sensory', 'sorting', 'colors', 'tweezers'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.7,
      reviewCount: 89,
      soldCount: 210,
      viewCount: 2900,
    },

    // 3. Stacking Cups
    {
      title: 'Stacking Cups with Pattern Cards',
      brand: 'Joyride',
      sku: 'JR-SEN-003',
      description: 'A delightful set of colorful stacking cups paired with pattern cards that guide children to build specific sequences and towers. Stacking activities develop spatial awareness, size sequencing, and color recognition while providing rich sensory input through the varied textures and bright colors. The pattern cards add a cognitive challenge that keeps children engaged and learning.',
      shortDescription: 'Colorful stacking cups with guided pattern cards for sequencing and spatial awareness.',
      specs: [
        { name: 'Age Group', value: '18 months+', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Spatial Awareness & Sequencing', group: 'Development' },
        { name: 'Material Safety', value: 'BPA-free, food-grade plastic', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Early Intervention, Sensory Play', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, daycare, bath time', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Use during bath time for water play; practice nesting and stacking in different orders', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 39,
      stockQuantity: 100,
      lowStockThreshold: 15,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17926534353022304.jpg`, alt: 'Stacking Cups - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18003934049749257.jpg`, alt: 'Stacking Cups - Pattern Cards', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${GAMES_IMG}/18036784634541883.jpg`, alt: 'Stacking Cups - Stacked Tower', isPrimary: false, order: 2 },
      ],
      categoryId: sensoryCat._id,
      tags: ['sensory', 'stacking', 'cups', 'sequencing'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.6,
      reviewCount: 72,
      soldCount: 280,
      viewCount: 2100,
    },

    // ========== FINE MOTOR SKILLS ==========

    // 4. Spike the Hedgehog Fine Motor Toy
    {
      title: 'Spike the Hedgehog Fine Motor Toy',
      brand: 'Joyride',
      sku: 'JR-FM-001',
      description: 'An adorable hedgehog-shaped toy with colorful pegs that children insert into the hedgehog body. Each peg requires a precise pincer grasp to push in and pull out, building the hand strength and dexterity needed for writing, buttoning, and other daily tasks. The bright colors and friendly hedgehog character make repetitive fine motor practice feel like pure play.',
      shortDescription: 'Colorful peg-insertion hedgehog toy for building pincer grasp and hand strength.',
      specs: [
        { name: 'Age Group', value: '18 months+', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Pincer Grasp & Hand Strength', group: 'Development' },
        { name: 'Material Safety', value: 'BPA-free, phthalate-free plastic', group: 'Safety' },
        { name: 'Certification', value: 'CE, ASTM F963, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Early Intervention', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, therapy sessions', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Name colors while inserting pegs; count pegs for early math; sort by color for extra challenge', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 65,
      compareAtPrice: 85,
      discount: 24,
      stockQuantity: 60,
      lowStockThreshold: 10,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17853651462377619.jpg`, alt: 'Spike the Hedgehog - Full Toy', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18057910481283625.jpg`, alt: 'Spike the Hedgehog - Pegs Detail', isPrimary: false, order: 1 },
      ],
      categoryId: fineMotorCat._id,
      tags: ['fine-motor', 'hedgehog', 'pincer-grasp', 'toddler'],
      faqs: [
        { id: uuidv4(), question: 'Are the pegs a choking hazard?', answer: 'The pegs are designed to be large enough for safe play for children 18 months and older. Always supervise young children during play.', order: 0 },
        { id: uuidv4(), question: 'How does this help with writing readiness?', answer: 'The pincer grasp used to insert and remove pegs is the same grip pattern needed for holding a pencil, making this excellent pre-writing practice.', order: 1 },
      ],
      isActive: true,
      isFeatured: true,
      averageRating: 4.9,
      reviewCount: 198,
      soldCount: 450,
      viewCount: 4800,
    },

    // 5. Threading / Lacing Beads
    {
      title: 'Threading & Lacing Beads Set',
      brand: 'Joyride',
      sku: 'JR-FM-002',
      description: 'A rich collection of wooden beads shaped like fruits, animals, and vehicles, each with a large threading hole and colorful laces. Threading beads develops bilateral coordination, hand-eye coordination, and the concentration needed for pre-writing skills. The variety of bead shapes keeps children engaged while the chunky lace tips make threading accessible for beginners.',
      shortDescription: 'Wooden fruit, animal, and vehicle beads with laces for threading and coordination practice.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Bilateral Coordination & Pre-Writing', group: 'Development' },
        { name: 'Material Safety', value: 'Smooth sanded hardwood, non-toxic finishes', group: 'Safety' },
        { name: 'Certification', value: 'CE, ASTM F963, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Pre-Writing Skills', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, school, therapy clinic', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Start with fewer beads; create patterns for added challenge; great travel activity', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 49,
      compareAtPrice: 65,
      discount: 25,
      stockQuantity: 75,
      lowStockThreshold: 12,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17905087677121097.jpg`, alt: 'Threading Beads Set - Full Collection', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/17985868106800116.jpg`, alt: 'Threading Beads - Fruit Shapes', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${GAMES_IMG}/18003668687740636.jpg`, alt: 'Threading Beads - Animals', isPrimary: false, order: 2 },
        { id: uuidv4(), url: `${GAMES_IMG}/18497995588053022.jpg`, alt: 'Threading Beads - Vehicles', isPrimary: false, order: 3 },
      ],
      categoryId: fineMotorCat._id,
      tags: ['fine-motor', 'threading', 'lacing', 'beads'],
      faqs: [
        { id: uuidv4(), question: 'How many beads are included?', answer: 'The set includes a generous collection of wooden beads in fruit, animal, and vehicle shapes along with multiple colorful laces.', order: 0 },
      ],
      isActive: true,
      isFeatured: true,
      averageRating: 4.8,
      reviewCount: 167,
      soldCount: 380,
      viewCount: 4200,
    },

    // 6. Animal Paper Cutting Cards
    {
      title: 'Animal Paper Cutting Cards',
      brand: 'Joyride',
      sku: 'JR-FM-003',
      description: 'A creative set of animal-themed cutting cards featuring butterflies, elephants, swans, and other fun designs, paired with child-safe scissors. Cutting along the guided lines builds hand strength, bilateral coordination, and scissor skills essential for school readiness. The progressive difficulty levels help children advance from simple straight cuts to complex curves.',
      shortDescription: 'Animal-themed cutting practice cards with child-safe scissors for scissor skill development.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Scissor Skills & Hand Strength', group: 'Development' },
        { name: 'Material Safety', value: 'Rounded-tip scissors, thick card stock', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, School Readiness', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, therapy sessions', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Supervise scissor use; start with straight lines before progressing to curves', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 35,
      stockQuantity: 90,
      lowStockThreshold: 15,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17864234223368311.jpg`, alt: 'Animal Paper Cutting Cards - Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18294449404168362.jpg`, alt: 'Animal Paper Cutting Cards - In Use', isPrimary: false, order: 1 },
      ],
      categoryId: fineMotorCat._id,
      tags: ['fine-motor', 'cutting', 'scissors', 'animals'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.6,
      reviewCount: 58,
      soldCount: 165,
      viewCount: 1800,
    },

    // 7. Dinosaur Screwdriver Board
    {
      title: 'Dinosaur Screwdriver Board',
      brand: 'Joyride',
      sku: 'JR-FM-004',
      description: 'A wooden dinosaur-shaped board with colorful screws and bolts that children fasten and unfasten using the included child-safe screwdriver and wrench. This hands-on STEM activity builds wrist rotation, tool use, and bilateral coordination while feeding a child\'s natural fascination with dinosaurs and construction. The satisfying click of each screw tightening provides excellent sensory feedback.',
      shortDescription: 'Wooden dinosaur board with screws, bolts, and tools for wrist strength and STEM exploration.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Wrist Rotation & Tool Use', group: 'Development' },
        { name: 'Material Safety', value: 'Smooth sanded wood, child-safe plastic tools', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71, ASTM F963', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, STEM Learning', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, therapy sessions', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Encourage both hands for bilateral coordination; name colors and count screws', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 69,
      compareAtPrice: 89,
      discount: 22,
      stockQuantity: 45,
      lowStockThreshold: 8,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18035243531294708.jpg`, alt: 'Dinosaur Screwdriver Board - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18272685316269907.jpg`, alt: 'Dinosaur Screwdriver Board - Tools', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${GAMES_IMG}/18114800686456860.jpg`, alt: 'Dinosaur Screwdriver Board - In Use', isPrimary: false, order: 2 },
      ],
      categoryId: fineMotorCat._id,
      tags: ['fine-motor', 'dinosaur', 'screwdriver', 'STEM'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.7,
      reviewCount: 94,
      soldCount: 220,
      viewCount: 3100,
    },

    // 8. Wooden Color Clip Palette
    {
      title: 'Wooden Color Clip Palette',
      brand: 'Joyride',
      sku: 'JR-FM-005',
      description: 'A Montessori-inspired clothespin color matching activity where children clip wooden clothespins to the matching color sections on a circular palette board. Squeezing clothespins is one of the best exercises for developing the hand strength and pinch grip needed for writing. The simple, self-correcting design allows independent play and builds confidence.',
      shortDescription: 'Montessori clothespin color matching palette for pinch grip and color recognition.',
      specs: [
        { name: 'Age Group', value: '2+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Pinch Grip & Color Matching', group: 'Development' },
        { name: 'Material Safety', value: 'Natural beechwood, water-based paints', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Montessori', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, Montessori classroom', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Encourage thumb and index finger grip; time the activity for added fun', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 45,
      stockQuantity: 55,
      lowStockThreshold: 10,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18093614125499697.jpg`, alt: 'Wooden Color Clip Palette', isPrimary: true, order: 0 },
      ],
      categoryId: fineMotorCat._id,
      tags: ['fine-motor', 'clothespin', 'color-matching', 'montessori'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.5,
      reviewCount: 42,
      soldCount: 130,
      viewCount: 1500,
    },

    // ========== COGNITIVE DEVELOPMENT GAMES ==========

    // 9. Memory Board Game
    {
      title: 'Memory Board Game',
      brand: 'Joyride',
      sku: 'JR-COG-001',
      description: 'An interactive flip-top memory board game where children lift wooden flaps to reveal hidden images and find matching pairs against a sand timer. The physical board with hinged lids adds a tactile dimension that digital memory games cannot replicate. This game strengthens working memory, concentration, and turn-taking skills while providing hours of family fun.',
      shortDescription: 'Flip-top wooden memory board with hidden images, timer, and matching cards.',
      specs: [
        { name: 'Age Group', value: '4+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Working Memory & Concentration', group: 'Development' },
        { name: 'Material Safety', value: 'FSC-certified wood, soy-based inks', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71, CPSIA', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Cognitive Therapy, ADHD Support', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, school, family game night', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Start without the timer for beginners; use timer to build speed and excitement', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 79,
      compareAtPrice: 99,
      discount: 20,
      stockQuantity: 50,
      lowStockThreshold: 8,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17999505935775545.jpg`, alt: 'Memory Board Game - Top View', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18040308419563605.jpg`, alt: 'Memory Board Game - Playing', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${GAMES_IMG}/18133713400410173.jpg`, alt: 'Memory Board Game - Cards', isPrimary: false, order: 2 },
      ],
      categoryId: cognitiveCat._id,
      tags: ['cognitive', 'memory', 'board-game', 'concentration'],
      faqs: [
        { id: uuidv4(), question: 'How many players can play?', answer: 'The game is designed for 2-4 players, making it perfect for family game time or small group therapy sessions.', order: 0 },
        { id: uuidv4(), question: 'Can the image cards be swapped?', answer: 'Yes, the board uses interchangeable image cards so you can refresh the game with new themes to maintain engagement.', order: 1 },
      ],
      isActive: true,
      isFeatured: true,
      averageRating: 4.8,
      reviewCount: 145,
      soldCount: 320,
      viewCount: 4100,
    },

    // 10. Dinosaur Memory Game
    {
      title: 'Dinosaur Memory Game',
      brand: 'Joyride',
      sku: 'JR-COG-002',
      description: 'A charming wooden disc memory game featuring beautifully illustrated dinosaur pairs. Children flip over round wooden discs to find matching dinosaur illustrations, exercising visual memory and recall. The dinosaur theme captivates young learners while the wooden pieces provide a satisfying tactile experience that keeps children coming back for more practice.',
      shortDescription: 'Wooden disc pairs with dinosaur illustrations for memory training and visual recall.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Visual Memory & Recall', group: 'Development' },
        { name: 'Material Safety', value: 'Smooth sanded wood, non-toxic inks', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Cognitive Therapy, Early Intervention', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, therapy sessions', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Start with 4-6 pairs; name the dinosaurs to build vocabulary', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 45,
      stockQuantity: 65,
      lowStockThreshold: 10,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17914090881068008.jpg`, alt: 'Dinosaur Memory Game - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18060568354875453.jpg`, alt: 'Dinosaur Memory Game - Playing', isPrimary: false, order: 1 },
      ],
      categoryId: cognitiveCat._id,
      tags: ['cognitive', 'memory', 'dinosaur', 'wooden-toy'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.7,
      reviewCount: 83,
      soldCount: 195,
      viewCount: 2600,
    },

    // 11. Shapes Puzzle Tin / Tangram
    {
      title: 'Shapes Puzzle Tin - Tangram Set',
      brand: 'Joyride',
      sku: 'JR-COG-003',
      description: 'A portable tin containing colorful geometric tangram pieces and a deck of pattern cards showing animal figures, objects, and abstract designs to recreate. Children arrange the shapes to match the patterns, developing spatial reasoning, geometric awareness, and creative problem-solving. The compact tin makes it an ideal travel companion for screen-free entertainment.',
      shortDescription: 'Geometric tangram pieces with pattern cards in a portable tin for spatial reasoning.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Spatial Reasoning & Problem-Solving', group: 'Development' },
        { name: 'Material Safety', value: 'Non-toxic painted wood, rounded edges', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71, CPSIA', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Cognitive Therapy, Visual-Spatial Training', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, school, travel', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Start with simpler patterns and progress to complex ones; encourage creating original designs', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 55,
      compareAtPrice: 69,
      discount: 20,
      stockQuantity: 70,
      lowStockThreshold: 12,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17869475205253823.jpg`, alt: 'Shapes Puzzle Tin - Closed', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/17871032100244720.jpg`, alt: 'Shapes Puzzle Tin - Open with Pieces', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${GAMES_IMG}/17955391178791519.jpg`, alt: 'Tangram Pattern Cards', isPrimary: false, order: 2 },
        { id: uuidv4(), url: `${GAMES_IMG}/18040693115428211.jpg`, alt: 'Tangram - Building a Figure', isPrimary: false, order: 3 },
      ],
      categoryId: cognitiveCat._id,
      tags: ['cognitive', 'tangram', 'shapes', 'puzzle'],
      faqs: [
        { id: uuidv4(), question: 'How many pattern cards are included?', answer: 'The set includes a generous deck of pattern cards with progressive difficulty levels, from simple outlines to complex multi-piece figures.', order: 0 },
      ],
      isActive: true,
      isFeatured: true,
      averageRating: 4.8,
      reviewCount: 132,
      soldCount: 290,
      viewCount: 3800,
    },

    // 12. Shadow Match 2-Piece Puzzles
    {
      title: 'Shadow Match 2-Piece Puzzles',
      brand: 'Joyride',
      sku: 'JR-COG-004',
      description: 'A set of simple two-piece puzzles where children match object cards to their corresponding shadow silhouette cards. This introductory puzzle activity develops visual discrimination, logical thinking, and early problem-solving skills. The large, sturdy pieces are perfect for little hands, and the self-correcting design builds independence and confidence.',
      shortDescription: 'Two-piece object-to-shadow matching puzzles for early problem-solving skills.',
      specs: [
        { name: 'Age Group', value: '2+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Visual Discrimination & Logic', group: 'Development' },
        { name: 'Material Safety', value: 'Thick laminated cardboard, rounded corners', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Early Intervention, Cognitive Development', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, daycare, therapy sessions', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Name objects and shadows aloud; ask "which shadow belongs to this?"', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 39,
      stockQuantity: 85,
      lowStockThreshold: 15,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17962354430899241.jpg`, alt: 'Shadow Match Puzzles - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18055046896957169.jpg`, alt: 'Shadow Match Puzzles - Matching', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${GAMES_IMG}/18288966922223564.jpg`, alt: 'Shadow Match Puzzles - Close Up', isPrimary: false, order: 2 },
        { id: uuidv4(), url: `${GAMES_IMG}/18336223456080113.jpg`, alt: 'Shadow Match Puzzles - All Pairs', isPrimary: false, order: 3 },
      ],
      categoryId: cognitiveCat._id,
      tags: ['cognitive', 'puzzle', 'shadow-matching', 'toddler'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.6,
      reviewCount: 67,
      soldCount: 175,
      viewCount: 2000,
    },

    // 13. Wooden Jigsaw Puzzles
    {
      title: 'Wooden Jigsaw Puzzles - Animal Collection',
      brand: 'Joyride',
      sku: 'JR-COG-005',
      description: 'A collection of small, chunky wooden jigsaw puzzles featuring adorable animal illustrations. Each puzzle has just the right number of pieces for young learners, making completion achievable and rewarding. The thick wooden pieces are easy to grip and the vibrant animal images hold children\'s attention while they develop problem-solving and spatial awareness skills.',
      shortDescription: 'Chunky wooden animal jigsaw puzzles for early problem-solving and spatial skills.',
      specs: [
        { name: 'Age Group', value: '2+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Problem-Solving & Spatial Awareness', group: 'Development' },
        { name: 'Material Safety', value: 'Smooth sanded wood, non-toxic paints', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Cognitive Development, Early Intervention', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, therapy', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Name the animals; describe their features; celebrate puzzle completion', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 35,
      stockQuantity: 95,
      lowStockThreshold: 15,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17958902498778709.jpg`, alt: 'Wooden Jigsaw Puzzles - Animal Collection', isPrimary: true, order: 0 },
      ],
      categoryId: cognitiveCat._id,
      tags: ['cognitive', 'jigsaw', 'puzzle', 'animals'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.5,
      reviewCount: 54,
      soldCount: 150,
      viewCount: 1700,
    },

    // ========== MONTESSORI PLAY KITS ==========

    // 14. Wooden Sorting Box
    {
      title: 'Wooden Sorting Box',
      brand: 'Joyride',
      sku: 'JR-MON-001',
      description: 'A classic Montessori shape and color sorting box designed for babies and toddlers aged 12 months and up. Children drop colorful wooden blocks through matching openings in the lid, learning about shapes, colors, and cause-and-effect relationships. The hinged lid opens for easy retrieval, and the smooth sanded edges ensure completely safe handling for the youngest learners.',
      shortDescription: 'Montessori shape and color sorting box for babies 12M+ with smooth wooden blocks.',
      specs: [
        { name: 'Age Group', value: '12 months+', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Shape Recognition & Cause-Effect', group: 'Development' },
        { name: 'Material Safety', value: 'Natural beechwood, water-based non-toxic paints', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71, CPSIA', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Montessori, Early Intervention', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, Montessori classroom, daycare', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Let the child explore independently; name shapes and colors as they play', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 59,
      stockQuantity: 60,
      lowStockThreshold: 10,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17854674078410286.jpg`, alt: 'Wooden Sorting Box - Front View', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/17946044858974835.jpg`, alt: 'Wooden Sorting Box - Blocks Detail', isPrimary: false, order: 1 },
      ],
      categoryId: montessoriCat._id,
      tags: ['montessori', 'sorting', 'shapes', 'baby'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.7,
      reviewCount: 112,
      soldCount: 260,
      viewCount: 3200,
    },

    // 15. Dinosaur Color Sorting
    {
      title: 'Dinosaur Color Sorting Set',
      brand: 'Joyride',
      sku: 'JR-MON-002',
      description: 'A playful Montessori sorting activity featuring miniature dinosaur figures, colored sorting bowls, and child-safe tweezers. Children sort dinosaurs by color into matching bowls, developing color recognition, classification skills, and fine motor control. The dinosaur theme makes learning irresistible while the tweezers add an extra fine motor challenge that therapists love.',
      shortDescription: 'Colored dinosaur figures with sorting bowls and tweezers for color classification.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Color Classification & Fine Motor', group: 'Development' },
        { name: 'Material Safety', value: 'BPA-free plastic, non-toxic', group: 'Safety' },
        { name: 'Certification', value: 'CE, ASTM F963', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Montessori, Occupational Therapy', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, Montessori classroom, therapy', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Use tweezers for fine motor challenge; count dinosaurs for early math; name colors and dinosaur types', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 65,
      compareAtPrice: 79,
      discount: 18,
      stockQuantity: 55,
      lowStockThreshold: 8,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18026168783420766.jpg`, alt: 'Dinosaur Color Sorting - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18063610414974468.jpg`, alt: 'Dinosaur Color Sorting - Bowls', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${GAMES_IMG}/18066588268766089.jpg`, alt: 'Dinosaur Color Sorting - Tweezers', isPrimary: false, order: 2 },
        { id: uuidv4(), url: `${GAMES_IMG}/18081820969629450.jpg`, alt: 'Dinosaur Color Sorting - In Use', isPrimary: false, order: 3 },
        { id: uuidv4(), url: `${GAMES_IMG}/18495012997032424.jpg`, alt: 'Dinosaur Color Sorting - Close Up', isPrimary: false, order: 4 },
      ],
      categoryId: montessoriCat._id,
      tags: ['montessori', 'sorting', 'dinosaur', 'colors'],
      faqs: [
        { id: uuidv4(), question: 'How many dinosaurs and bowls are included?', answer: 'The set includes multiple dinosaur figures in various colors with matching colored bowls, tweezers, and a sorting guide.', order: 0 },
      ],
      isActive: true,
      isFeatured: true,
      averageRating: 4.9,
      reviewCount: 178,
      soldCount: 390,
      viewCount: 5000,
    },

    // 16. Animal Peg Puzzle Board
    {
      title: 'Animal Peg Puzzle Board',
      brand: 'Joyride',
      sku: 'JR-MON-003',
      description: 'A beautifully illustrated wooden puzzle board with animal pieces that lift out using easy-grip knob pegs. Each piece reveals the animal\'s silhouette underneath, creating a self-correcting puzzle experience. The knob pegs develop the pincer grasp essential for writing, while the animal identification builds vocabulary and cognitive skills.',
      shortDescription: 'Wooden animal puzzle board with knob pegs for pincer grasp and animal recognition.',
      specs: [
        { name: 'Age Group', value: '18 months+', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Pincer Grasp & Animal Recognition', group: 'Development' },
        { name: 'Material Safety', value: 'Smooth sanded plywood, non-toxic inks', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Montessori, Early Intervention', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, Montessori classroom, daycare', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Name animals and make their sounds; encourage using thumb and index finger on pegs', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      price: 42,
      stockQuantity: 70,
      lowStockThreshold: 12,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18109954225488536.jpg`, alt: 'Animal Peg Puzzle Board - Complete', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18282460345301413.jpg`, alt: 'Animal Peg Puzzle Board - Pieces Out', isPrimary: false, order: 1 },
      ],
      categoryId: montessoriCat._id,
      tags: ['montessori', 'puzzle', 'animals', 'peg-board'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.6,
      reviewCount: 76,
      soldCount: 200,
      viewCount: 2400,
    },

    // ========== CREATIVE LEARNING SETS ==========

    // 17. Number Tracing Cards
    {
      title: 'Number Tracing Cards',
      brand: 'Joyride',
      sku: 'JR-CL-001',
      description: 'A set of wipe-clean number tracing cards with dry-erase markers that allow children to practice writing numbers 0-9 over and over. Each card features clear directional arrows showing proper stroke order, dotted lines for tracing, and fun counting illustrations. The reusable design means unlimited practice without wasting paper, making these an eco-friendly learning tool.',
      shortDescription: 'Wipe-clean number tracing cards with markers for reusable handwriting practice.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Number Formation & Pre-Writing', group: 'Development' },
        { name: 'Material Safety', value: 'Laminated card stock, non-toxic dry-erase markers', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, School Readiness', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, tutoring', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Follow the directional arrows; wipe clean with a cloth; practice daily for best results', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 39,
      stockQuantity: 80,
      lowStockThreshold: 15,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17888226156227925.jpg`, alt: 'Number Tracing Cards - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/17954060813929605.jpg`, alt: 'Number Tracing Cards - In Use', isPrimary: false, order: 1 },
      ],
      categoryId: creativeCat._id,
      tags: ['creative-learning', 'numbers', 'tracing', 'pre-writing'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.6,
      reviewCount: 65,
      soldCount: 180,
      viewCount: 2200,
    },

    // 18. Letter Tracing Cards
    {
      title: 'Letter Tracing Cards',
      brand: 'Joyride',
      sku: 'JR-CL-002',
      description: 'A comprehensive set of wipe-clean letter tracing cards covering the full alphabet with both uppercase and lowercase formations. Each card includes directional arrows for proper stroke order and an associated picture for phonics reinforcement. The dry-erase surface allows endless practice, building the muscle memory needed for fluent handwriting.',
      shortDescription: 'Wipe-clean alphabet tracing cards with stroke guides for letter formation practice.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Letter Formation & Phonics', group: 'Development' },
        { name: 'Material Safety', value: 'Laminated card stock, non-toxic markers', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Literacy Support', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, tutoring', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Say the letter sound while tracing; practice a few letters daily rather than all at once', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 39,
      stockQuantity: 80,
      lowStockThreshold: 15,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18059405534009502.jpg`, alt: 'Letter Tracing Cards - Full Set', isPrimary: true, order: 0 },
      ],
      categoryId: creativeCat._id,
      tags: ['creative-learning', 'letters', 'tracing', 'alphabet'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.6,
      reviewCount: 58,
      soldCount: 160,
      viewCount: 1900,
    },

    // 19. Shape Tracing Cards
    {
      title: 'Shape Tracing Cards - Draw With Me',
      brand: 'Joyride',
      sku: 'JR-CL-003',
      description: 'A "Draw With Me" wipe-clean shape tracing card set that guides children through tracing circles, squares, triangles, and more complex shapes. Each card features fun illustrations that incorporate the shapes into recognizable objects, making abstract geometry concrete and engaging. The progressive difficulty builds from basic shapes to multi-step drawings.',
      shortDescription: 'Wipe-clean "Draw With Me" shape tracing cards with fun illustrated guides.',
      specs: [
        { name: 'Age Group', value: '2+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Shape Formation & Drawing Skills', group: 'Development' },
        { name: 'Material Safety', value: 'Laminated card stock, non-toxic markers', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Pre-Writing', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, therapy', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Start with large shapes; celebrate attempts not perfection; trace together as a bonding activity', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 39,
      stockQuantity: 75,
      lowStockThreshold: 12,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18119708167446080.jpg`, alt: 'Shape Tracing Cards - Draw With Me', isPrimary: true, order: 0 },
      ],
      categoryId: creativeCat._id,
      tags: ['creative-learning', 'shapes', 'tracing', 'drawing'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.5,
      reviewCount: 47,
      soldCount: 140,
      viewCount: 1600,
    },

    // 20. Path Tracing Cards
    {
      title: 'Path Tracing Cards',
      brand: 'Joyride',
      sku: 'JR-CL-004',
      description: 'A set of wipe-clean curvy path tracing cards that challenge children to follow winding lines from start to finish. These pre-writing exercises build the hand control and visual tracking skills needed for handwriting. The curvy paths progress from simple wide trails to narrow, complex routes, providing appropriate challenge at every skill level.',
      shortDescription: 'Wipe-clean curvy path tracing cards for pre-writing hand control practice.',
      specs: [
        { name: 'Age Group', value: '2+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Hand Control & Visual Tracking', group: 'Development' },
        { name: 'Material Safety', value: 'Laminated card stock, non-toxic markers', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Pre-Writing Skills', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, therapy', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Encourage slow, careful tracing; wipe and repeat for confidence building', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 35,
      stockQuantity: 80,
      lowStockThreshold: 15,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18061817219493321.jpg`, alt: 'Path Tracing Cards - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18061261706085499.jpg`, alt: 'Path Tracing Cards - In Use', isPrimary: false, order: 1 },
      ],
      categoryId: creativeCat._id,
      tags: ['creative-learning', 'path-tracing', 'pre-writing', 'hand-control'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.5,
      reviewCount: 41,
      soldCount: 120,
      viewCount: 1400,
    },

    // 21. Multi-Activity Tracing Cards
    {
      title: 'Multi-Activity Tracing Cards',
      brand: 'Joyride',
      sku: 'JR-CL-005',
      description: 'A comprehensive ring-bound set of wipe-clean tracing cards covering numbers, letters, shapes, and dot patterns all in one convenient pack. The ring binding keeps cards organized and allows easy flipping between activities. This all-in-one set provides a complete pre-writing curriculum in a portable, reusable format that children can practice with again and again.',
      shortDescription: 'Ring-bound multi-activity tracing set covering numbers, letters, shapes, and dots.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Comprehensive Pre-Writing Skills', group: 'Development' },
        { name: 'Material Safety', value: 'Laminated cards, metal ring binding, non-toxic markers', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, School Readiness', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, travel', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Do a few cards daily; the ring-bound format is perfect for on-the-go practice', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 49,
      compareAtPrice: 65,
      discount: 25,
      stockQuantity: 65,
      lowStockThreshold: 10,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18025269812442732.jpg`, alt: 'Multi-Activity Tracing Cards - Ring Bound', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/18045085220582512.jpg`, alt: 'Multi-Activity Tracing Cards - Open', isPrimary: false, order: 1 },
      ],
      categoryId: creativeCat._id,
      tags: ['creative-learning', 'tracing', 'multi-activity', 'school-readiness'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.7,
      reviewCount: 86,
      soldCount: 210,
      viewCount: 2800,
    },

    // 22. Dot Connection / Pattern Drawing Cards
    {
      title: 'Dot Connection & Pattern Drawing Cards',
      brand: 'Joyride',
      sku: 'JR-CL-006',
      description: 'A creative set of wipe-clean cards where children connect dots and follow visual patterns to complete drawings. Each card presents a partially complete image that children finish by connecting numbered dots or copying patterns. This activity builds number sequencing, visual-motor integration, and the controlled hand movements essential for handwriting success.',
      shortDescription: 'Wipe-clean dot-to-dot and pattern drawing cards for visual-motor integration.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Visual-Motor Integration & Sequencing', group: 'Development' },
        { name: 'Material Safety', value: 'Laminated card stock, non-toxic markers', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Visual-Motor Training', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, preschool, therapy', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Help children follow number sequence; celebrate the revealed image at the end', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 39,
      stockQuantity: 70,
      lowStockThreshold: 12,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/17955246524923569.jpg`, alt: 'Dot Connection Cards - Full Set', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${GAMES_IMG}/17950561157814062.jpg`, alt: 'Dot Connection Cards - In Use', isPrimary: false, order: 1 },
      ],
      categoryId: creativeCat._id,
      tags: ['creative-learning', 'dot-connection', 'patterns', 'visual-motor'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.6,
      reviewCount: 53,
      soldCount: 145,
      viewCount: 1700,
    },

    // 23. Maze Activity Book
    {
      title: 'Maze Activity Book',
      brand: 'Joyride',
      sku: 'JR-CL-007',
      description: 'A wipe-clean maze activity book filled with engaging mazes of progressive difficulty, from simple paths for beginners to complex labyrinths for more advanced children. Solving mazes develops planning skills, visual scanning, hand control, and perseverance. The dry-erase format means children can retry mazes to improve speed and accuracy, building confidence with each attempt.',
      shortDescription: 'Wipe-clean maze activity book with progressive difficulty for planning and hand control.',
      specs: [
        { name: 'Age Group', value: '3+ years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Planning & Visual Scanning', group: 'Development' },
        { name: 'Material Safety', value: 'Laminated pages, non-toxic markers', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'Occupational Therapy, Cognitive Development', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, travel, therapy sessions', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Encourage planning before drawing; trace the path with a finger first, then use the marker', group: 'Guidance' },
      ],
      warranty: '6 Months Manufacturer Warranty',
      price: 35,
      stockQuantity: 75,
      lowStockThreshold: 12,
      images: [
        { id: uuidv4(), url: `${GAMES_IMG}/18075638395787579.jpg`, alt: 'Maze Activity Book', isPrimary: true, order: 0 },
      ],
      categoryId: creativeCat._id,
      tags: ['creative-learning', 'mazes', 'planning', 'hand-control'],
      isActive: true,
      isFeatured: false,
      averageRating: 4.5,
      reviewCount: 38,
      soldCount: 110,
      viewCount: 1300,
    },

    // ========== THERAPY SUPPORT TOOLS ==========

    // 24. Joyride Complete Box
    {
      title: 'Joyride Complete Box',
      brand: 'Joyride',
      sku: 'JR-BOX-001',
      description: 'The ultimate developmental play package containing a curated selection of our most popular games and activities all in one beautifully designed box. The Joyride Complete Box is assembled by child development specialists to provide a comprehensive toolkit covering sensory exploration, fine motor skills, cognitive development, creative learning, and Montessori-inspired play. This all-in-one set makes the perfect gift and provides months of purposeful, screen-free learning for children.',
      shortDescription: 'Complete curated box with all Joyride games for comprehensive developmental play.',
      specs: [
        { name: 'Age Group', value: '2-6 years', group: 'Suitability' },
        { name: 'Skill Focus', value: 'Multi-Domain Development', group: 'Development' },
        { name: 'Material Safety', value: 'All materials non-toxic, BPA-free, child-safe', group: 'Safety' },
        { name: 'Certification', value: 'CE, EN71, ASTM F963', group: 'Safety' },
        { name: 'Therapy Recommendation', value: 'All Therapy Domains, Home Program Support', group: 'Therapeutic' },
        { name: 'Usage', value: 'Home, therapy center, gift', group: 'Therapeutic' },
        { name: 'Parent Notes', value: 'Introduce one game at a time; follow the included activity guide for age-appropriate suggestions', group: 'Guidance' },
      ],
      warranty: '1 Year Manufacturer Warranty',
      deliveryNotes: 'Free delivery. Premium gift wrapping included.',
      price: 499,
      compareAtPrice: 699,
      discount: 29,
      stockQuantity: 30,
      lowStockThreshold: 5,
      images: [
        { id: uuidv4(), url: `${BOX_IMG}/18135044722410733.jpg`, alt: 'Joyride Complete Box - Front', isPrimary: true, order: 0 },
        { id: uuidv4(), url: `${BOX_IMG}/17982737654691363.jpg`, alt: 'Joyride Complete Box - Contents Spread', isPrimary: false, order: 1 },
        { id: uuidv4(), url: `${BOX_IMG}/18044685860625663.jpg`, alt: 'Joyride Complete Box - Open View', isPrimary: false, order: 2 },
        { id: uuidv4(), url: `${BOX_IMG}/18146610124381347.jpg`, alt: 'Joyride Complete Box - Side Angle', isPrimary: false, order: 3 },
      ],
      categoryId: therapyCat._id,
      tags: ['complete-box', 'gift', 'all-in-one', 'therapy-support'],
      faqs: [
        { id: uuidv4(), question: 'What games are included in the Complete Box?', answer: 'The Complete Box includes a curated selection of our most popular sensory, fine motor, cognitive, creative learning, and Montessori games. Contents may vary slightly based on availability but always cover all developmental domains.', order: 0 },
        { id: uuidv4(), question: 'Is this suitable as a gift?', answer: 'Absolutely! The Complete Box comes in premium gift wrapping with a personalized activity guide, making it the perfect gift for birthdays, holidays, or any special occasion.', order: 1 },
      ],
      isActive: true,
      isFeatured: true,
      averageRating: 4.9,
      reviewCount: 203,
      soldCount: 480,
      viewCount: 5200,
    },
  ]);

  console.log(`✅ Created ${products.length} products`);
  return products;
}

async function seedReviews(products: any[], users: any[]): Promise<void> {
  console.log('⭐ Seeding reviews...');

  const reviewsData = [];
  const comments = [
    'My child absolutely loves this! We have seen real progress in therapy sessions.',
    'Excellent quality and thoughtfully designed. Our therapist recommended it.',
    'A wonderful developmental tool. My daughter uses it every day.',
    'Great product for the price. Shipping was fast and packaging was careful.',
    'This has been a game-changer for our daily routine. Highly recommended for special needs families.',
    'Solid build quality and safe materials. I feel confident letting my toddler play independently.',
    'We bought this on our OT\'s recommendation and it has exceeded our expectations.',
    'Beautiful design and my son engages with it for long periods. Worth every riyal.',
  ];

  for (const product of products) {
    const reviewCount = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < reviewCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      reviewsData.push({
        productId: product._id,
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        orderId: new mongoose.Types.ObjectId(), // Placeholder order ID for seeding
        rating: Math.floor(Math.random() * 2) + 4,
        comment: comments[Math.floor(Math.random() * comments.length)],
        status: 'approved',
        isVerifiedPurchase: Math.random() > 0.3,
        helpfulCount: Math.floor(Math.random() * 20),
      });
    }
  }

  await Review.create(reviewsData);
  console.log(`✅ Created ${reviewsData.length} reviews`);
}

async function seedOrders(products: any[], users: any[], admins: { admin: any; superAdmin: any }): Promise<void> {
  console.log('📋 Seeding orders...');

  const statuses: Array<'new' | 'accepted' | 'in_progress' | 'out_for_delivery' | 'delivered' | 'cancelled'> = [
    'new',
    'accepted',
    'in_progress',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ];

  const ordersData = [];

  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, itemCount);

    const items = selectedProducts.map((product: any) => ({
      productId: product._id,
      title: product.title,
      sku: product.sku,
      price: product.price,
      quantity: Math.floor(Math.random() * 2) + 1,
      image: product.images[0]?.url,
    }));

    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const shippingCost = subtotal > 2000 ? 0 : 50;
    const discount = Math.random() > 0.7 ? Math.floor(subtotal * 0.1) : 0;
    const total = subtotal + shippingCost - discount;

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const statusHistory: Array<{
      status: 'new' | 'accepted' | 'in_progress' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed';
      timestamp: Date;
      updatedBy: any;
      note?: string;
    }> = [
      {
        status: 'new',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        updatedBy: user._id,
      },
    ];

    if (status !== 'new') {
      const statusOrder = ['accepted', 'in_progress', 'out_for_delivery', 'delivered'];
      const cancelledIndex = statusOrder.indexOf(status);

      for (let j = 0; j <= cancelledIndex && j < statusOrder.length; j++) {
        if (status === 'cancelled' && j === cancelledIndex) {
          statusHistory.push({
            status: 'cancelled' as const,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)),
            updatedBy: admins.admin._id,
          });
        } else if (statusOrder[j]) {
          statusHistory.push({
            status: statusOrder[j] as any,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * (7 - j) * 24 * 60 * 60 * 1000)),
            updatedBy: admins.admin._id,
          });
        }
      }
    }

    ordersData.push({
      userId: user._id,
      items,
      subtotal,
      shippingCost,
      discount,
      discountCode: discount > 0 ? 'JOYRIDE10' : undefined,
      total,
      status,
      statusHistory,
      paymentMethod: Math.random() > 0.5 ? 'cash_on_delivery' : 'card',
      paymentStatus: status === 'delivered' ? 'paid' : status === 'cancelled' ? 'refunded' : 'pending',
      shippingAddress: {
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.phone || '+966501234567',
        email: user.email,
        fullAddress: user.addresses?.[0]?.fullAddress || '123 Sample Street',
        city: user.addresses?.[0]?.city || 'Riyadh',
        area: user.addresses?.[0]?.area || 'Olaya',
      },
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      deliveredAt: status === 'delivered' ? new Date() : undefined,
      cancelledAt: status === 'cancelled' ? new Date() : undefined,
      cancelReason: status === 'cancelled' ? 'Customer requested cancellation' : undefined,
    });
  }

  await Order.create(ordersData);
  console.log(`✅ Created ${ordersData.length} orders`);
}

async function seedOffers(): Promise<void> {
  console.log('🏷️  Seeding offers...');

  const offers = await Offer.create([
    {
      title: 'Welcome to Joyride',
      description: 'Get 10% off your first order',
      code: 'JOYRIDE10',
      type: 'percentage',
      value: 10,
      maxDiscount: 500,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      title: 'Therapy Tools Discount',
      description: '20% off all therapy support tools',
      code: 'THERAPY20',
      type: 'percentage',
      value: 20,
      maxDiscount: 1000,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      title: 'Sensory Play Sale',
      description: '15% off sensory toys collection',
      code: 'SENSORY15',
      type: 'percentage',
      value: 15,
      maxDiscount: 750,
      usageLimit: 100,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  ]);

  console.log(`✅ Created ${offers.length} offers`);
}

async function seedBanners(): Promise<void> {
  console.log('🖼️  Seeding banners...');

  const banners = await Banner.create([
    {
      title: 'Therapeutic Toys That Build Skills',
      subtitle: 'Discover our curated collection of developmental toys recommended by therapists',
      image: bannerImages[0],
      link: '/products?category=therapy-support',
      position: 'hero_main',
      order: 1,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      title: 'Montessori Learning Kits',
      subtitle: 'Hands-on materials for independent discovery and growth',
      image: bannerImages[1],
      link: '/products?category=montessori-kits',
      position: 'hero_secondary',
      order: 2,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      title: 'Sensory Play Collection',
      subtitle: 'Tactile, visual, and auditory toys for sensory development',
      image: bannerImages[2],
      link: '/products?category=sensory-toys',
      position: 'home_middle',
      order: 1,
      isActive: true,
    },
  ]);

  console.log(`✅ Created ${banners.length} banners`);
}

async function seedBlog(authorId: mongoose.Types.ObjectId): Promise<void> {
  console.log('📝 Seeding blog posts...');

  const posts = await BlogPost.create([
    {
      title: 'How Sensory Toys Support Child Development',
      slug: 'how-sensory-toys-support-child-development',
      excerpt: 'Understanding the science behind sensory play and how the right toys can make a meaningful difference in your child\'s development.',
      authorId,
      content: `
# How Sensory Toys Support Child Development

Sensory play is not just fun — it is a critical part of healthy child development. Here is how the right sensory toys can support your child:

## 1. What Is Sensory Processing?

Sensory processing is the brain's ability to receive, organize, and respond to information from the senses. Children with sensory processing differences may be over-sensitive or under-sensitive to touch, sound, light, or movement.

## 2. How Sensory Toys Help

- **Tactile Toys** (fidget boards, textured balls): Help children who seek or avoid touch to regulate their sensory input
- **Visual Toys** (sensory bottles, light-up toys): Provide calming visual stimulation
- **Auditory Toys** (musical instruments, sound tubes): Support auditory processing and attention
- **Vestibular Toys** (balance boards, swings): Develop balance and spatial awareness

## 3. Signs Your Child May Benefit from Sensory Toys

- Frequently seeks or avoids certain textures
- Becomes overwhelmed in noisy or crowded environments
- Has difficulty sitting still or focusing
- Craves movement or deep pressure
- Is unusually sensitive to clothing tags or seams

## 4. Choosing the Right Sensory Toy

Consider your child's specific sensory preferences:
- **Sensory seekers**: Textured toys, weighted items, vibrating toys
- **Sensory avoiders**: Soft, predictable toys with gentle feedback
- **Mixed profiles**: Adjustable or multi-sensory toys

## 5. Tips for Parents

- Introduce new sensory experiences gradually
- Follow your child's lead — if they pull away, do not force interaction
- Create a sensory-friendly space at home
- Consult with an occupational therapist for personalized recommendations
- Make sensory play a daily routine
      `,
      image: blogImages[0],
      author: 'Joyride Team',
      tags: ['sensory-play', 'child-development', 'occupational-therapy', 'parenting'],
      status: 'published',
      publishedAt: new Date(),
    },
    {
      title: 'Choosing the Right Therapy Toys for Your Child',
      slug: 'choosing-right-therapy-toys-for-your-child',
      excerpt: 'A parent\'s guide to selecting therapeutic toys that align with your child\'s developmental goals and therapy plan.',
      authorId,
      content: `
# Choosing the Right Therapy Toys for Your Child

Selecting therapy toys can feel overwhelming. This guide helps you make informed choices that support your child's unique needs.

## 1. Start with Your Child's Goals

Before buying, identify what skills you want to develop:
- **Fine Motor**: Lacing, stacking, putty, beading
- **Gross Motor**: Balance boards, trampolines, obstacle courses
- **Speech & Language**: Puppets, communication cards, story sets
- **Social Skills**: Turn-taking games, cooperative play sets
- **Emotional Regulation**: Weighted toys, sensory bottles, fidgets

## 2. Consult with Your Child's Therapist

Your child's occupational therapist, speech therapist, or psychologist can recommend specific types of toys that complement their therapy program.

## 3. Age and Safety Considerations

- Always check age recommendations
- Look for non-toxic, BPA-free materials
- Verify safety certifications (CE, EN71, ASTM)
- Avoid small parts for children under 3

## 4. Quality Over Quantity

Invest in fewer, high-quality toys rather than many cheap ones:
- Durable materials that withstand heavy use
- Open-ended toys that grow with your child
- Professional-grade tools that therapists trust

## 5. Creating a Therapeutic Play Space

- Designate a calm, organized area for therapy play
- Rotate toys to maintain interest
- Store toys at child-accessible height for independence
- Include a mix of active and calming activities

## 6. Tracking Progress

- Take photos and videos of your child using toys
- Note new skills or increased engagement
- Share observations with your child's therapy team
- Celebrate small wins — every step forward matters
      `,
      image: blogImages[1],
      author: 'Joyride Team',
      tags: ['therapy-toys', 'buying-guide', 'special-needs', 'parenting'],
      status: 'published',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: '5 Montessori Activities for Home Learning',
      slug: '5-montessori-activities-for-home-learning',
      excerpt: 'Simple, effective Montessori-inspired activities you can set up at home to support your child\'s natural curiosity and independence.',
      authorId,
      content: `
# 5 Montessori Activities for Home Learning

You do not need a Montessori classroom to apply Montessori principles at home. Here are 5 simple activities:

## 1. Pouring and Transferring

Set up a tray with two small pitchers — one with water or dried beans. Let your child pour from one to the other. This develops:
- Fine motor control
- Concentration
- Independence
- Hand-eye coordination

## 2. Sorting by Color or Shape

Provide a muffin tin and a bowl of colorful items (pom-poms, buttons, or beads). Ask your child to sort by color or shape. Benefits:
- Classification skills
- Color and shape recognition
- Logical thinking
- Patience

## 3. Practical Life: Folding Cloths

Start with small washcloths. Show your child how to fold step by step, then let them practice. This builds:
- Sequencing skills
- Care for the environment
- Fine motor precision
- Sense of accomplishment

## 4. Nature Walk Treasure Hunt

Go on a walk and collect natural items: leaves, rocks, sticks, flowers. Back home, sort and classify them. This encourages:
- Observation skills
- Vocabulary development
- Scientific thinking
- Connection with nature

## 5. Bead Stringing

Provide large wooden beads and a thick string. Progress to smaller beads as skill improves. This strengthens:
- Bilateral coordination
- Pincer grasp
- Pattern recognition
- Patience and persistence

## Getting Started

The Montessori approach is about following the child. Observe what interests them, prepare the environment, and step back to let them explore independently. Remember: the process matters more than the product.
      `,
      image: blogImages[2],
      author: 'Joyride Team',
      tags: ['montessori', 'home-learning', 'activities', 'parenting', 'independence'],
      status: 'published',
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log(`✅ Created ${posts.length} blog posts`);
}

async function seedCMS(updatedBy: mongoose.Types.ObjectId): Promise<void> {
  console.log('📄 Seeding CMS content...');

  const cms = await CMSContent.create([
    {
      key: 'about',
      type: 'html',
      updatedBy,
      value: `
# About Joyride

**Joyride** is Saudi Arabia's trusted destination for therapeutic and developmental toys. Founded by parents and therapists who believe every child deserves access to high-quality tools that support growth, learning, and joy.

## Our Mission

To empower Saudi families with carefully curated therapeutic toys and developmental tools that help every child reach their full potential — at home, in school, and in therapy.

## Our Values

- **Child-First Design**: Every product is selected with your child's safety and development in mind
- **Therapist-Approved**: Our catalog is curated with input from occupational therapists, speech-language pathologists, and child psychologists
- **Inclusive Play**: We believe every child deserves toys that meet them where they are
- **Family Support**: We are here to guide you, not just sell to you

## Why Choose Joyride?

- Curated selection of therapist-recommended toys
- Detailed developmental information for every product
- Competitive prices with regular offers
- Free delivery on orders over SAR 500
- Gift wrapping and personalized recommendations
- Dedicated parent support team
- Products certified for child safety (CE, EN71, ASTM)

## Our Story

Joyride was born from a simple realization: finding quality therapeutic toys in Saudi Arabia should not be this hard. As parents of children with different developmental needs, our founders experienced firsthand the challenge of sourcing safe, effective, and engaging toys. Joyride bridges that gap — bringing the world's best developmental toys to Saudi families, with expert guidance every step of the way.

## Testimonials

> "Joyride changed everything for us. Our son's therapist recommended the sensory fidget board, and we saw improvements in his focus within weeks." — **Dina M., Riyadh**

> "As a pediatric OT, I recommend Joyride to all my clients' families. The quality is excellent and the product descriptions are genuinely helpful." — **Dr. Hala S., Occupational Therapist**

> "My daughter loves her weighted bear. It has become part of her bedtime routine and helps her calm down after a busy day." — **Mona K., Jeddah**
      `,
    },
    {
      key: 'privacy-policy',
      type: 'html',
      updatedBy,
      value: `
# Privacy Policy

Last updated: ${new Date().toLocaleDateString()}

## Information We Collect

We collect information you provide directly, including:
- Name, email, phone number
- Shipping and billing addresses
- Payment information
- Order history
- Information about your child's age and developmental needs (optional, to provide better recommendations)

## How We Use Your Information

We use your information to:
- Process and fulfill orders
- Send order confirmations and updates
- Provide personalized product recommendations
- Provide customer support
- Send marketing communications (with your consent)
- Improve our services and product selection

## Data Security

We implement industry-standard security measures to protect your data. Payment information is processed securely through our payment partners. We never store your full payment card details.

## Children's Privacy

We are especially committed to protecting children's privacy. We do not knowingly collect personal information from children. Any developmental information you share about your child is used solely to provide better product recommendations and is never shared with third parties.

## Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Opt-out of marketing communications

## Contact Us

For privacy-related inquiries, contact us at privacy@joyride.com
      `,
    },
    {
      key: 'terms-conditions',
      type: 'html',
      updatedBy,
      value: `
# Terms & Conditions

## General

By using Joyride's website and services, you agree to these terms and conditions.

## Orders

- All orders are subject to availability
- Prices are in Saudi Riyals (SAR) and include VAT
- We reserve the right to cancel orders due to pricing errors

## Delivery

- Standard delivery: 3-5 business days
- Express delivery available for select areas
- Free delivery on orders over SAR 500

## Returns

- 14-day return policy for unopened items
- Items must be in original packaging
- Defective items will be replaced or refunded
- Opened toys may be returned if defective or not as described

## Product Safety

- All products are certified for child safety
- Age recommendations should be followed
- Adult supervision is recommended for children under 3
- Products are tested to meet CE, EN71, and ASTM standards

## Limitation of Liability

Joyride provides developmental toys and tools as supportive aids. Our products are not a substitute for professional therapy or medical advice. Always consult with qualified healthcare professionals for your child's specific developmental needs.
      `,
    },
    {
      key: 'return-policy',
      type: 'html',
      updatedBy,
      value: `
# Return Policy

## Return Window

You have 14 days from delivery to return eligible items.

## Eligibility

Items must be:
- Unopened in original packaging, OR
- Defective or damaged on arrival

## Non-Returnable Items

- Therapy putty or similar consumable items once opened
- Items without original packaging
- Items damaged by misuse
- Personalized or custom items

## How to Return

1. Contact customer service to initiate return
2. Receive return authorization number
3. Pack item securely in original packaging
4. Schedule pickup or drop off at our location

## Refunds

- Refunds processed within 7-10 business days
- Original shipping fees non-refundable
- Refund issued to original payment method

## Exchanges

We are happy to exchange items for a different product if the original does not suit your child's needs. Contact our parent support team for personalized recommendations.
      `,
    },
    {
      key: 'shipping-info',
      type: 'html',
      updatedBy,
      value: `
# Shipping Information

## Delivery Areas

We deliver across Saudi Arabia, including:
- Riyadh and Central Region (1-2 business days)
- Jeddah and Western Region (2-3 business days)
- Other regions (3-5 business days)

## Shipping Costs

- Orders over SAR 500: FREE delivery
- Orders under SAR 500: SAR 25 flat rate

## Packaging

All items are carefully packaged to ensure they arrive in perfect condition:
- Eco-friendly packaging materials
- Gift wrapping available on request
- Fragile items double-boxed for protection

## Gift Orders

We offer gift wrapping and can include a personal message card. Perfect for birthdays, therapy milestones, and special occasions. Select the gift wrap option at checkout.

## Tracking Your Order

Track your order status:
- In your account dashboard
- Via email and SMS updates
- By contacting customer service

## Special Delivery Notes

If your child has sensory sensitivities (e.g., doorbell sounds), you can add delivery instructions at checkout. Our delivery team will follow your preferences.
      `,
    },
  ]);

  console.log(`✅ Created ${cms.length} CMS pages`);
}

async function main(): Promise<void> {
  console.log('\n🌱 JOYRIDE Database Seed Script\n');
  console.log('================================\n');

  try {
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    await clearDatabase();

    // Seed data
    const { superAdmin, admin, users } = await seedUsers();
    const categories = await seedCategories();
    const products = await seedProducts(categories);
    await seedReviews(products, users);
    await seedOrders(products, users, { admin, superAdmin });
    await seedOffers();
    await seedBanners();
    await seedBlog(superAdmin._id);
    await seedCMS(superAdmin._id);

    console.log('\n================================');
    console.log('✅ Database seeded successfully!\n');
    console.log('Demo Accounts:');
    console.log('--------------------------------');
    console.log('Super Admin: admin@joyride.com / admin123');
    console.log('Admin: staff@joyride.com / staff123');
    console.log('User: user@joyride.com / user123');
    console.log('================================\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

main();
