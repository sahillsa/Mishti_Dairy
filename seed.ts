import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7jloW1-RJPeD07hheqyjkh38ppfn72r0",
  authDomain: "mishti-farmer.firebaseapp.com",
  projectId: "mishti-farmer",
  storageBucket: "mishti-farmer.firebasestorage.app",
  messagingSenderId: "291007971927",
  appId: "1:291007971927:web:b499846c4f5de98bb41912",
  measurementId: "G-FV23FWJFJH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PRODUCTS = [
  {
    id: 101,
    name: 'A2 Desi Cow Milk',
    category: 'Milk',
    description: 'Farm chilled A2 cow milk collected every morning from grass-fed herds.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',
    price: 92,
    unit: '1 litre',
    tag: 'Daily fresh',
    stock: 42,
    isOutOfStock: false,
    rating: 4.9,
  },
  {
    id: 102,
    name: 'Buffalo Milk',
    category: 'Milk',
    description: 'Rich full-cream buffalo milk for tea, sweets, curd, and thick malai.',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=900&q=80',
    price: 98,
    unit: '1 litre',
    tag: 'Full cream',
    stock: 35,
    isOutOfStock: false,
    rating: 4.8,
  },
  {
    id: 103,
    name: 'Fresh Paneer',
    category: 'Paneer',
    description: 'Soft hand-cut paneer made in small batches with fresh whole milk.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    price: 190,
    unit: '500 g',
    tag: 'High protein',
    stock: 26,
    isOutOfStock: false,
    rating: 4.8,
  },
  {
    id: 104,
    name: 'Mishti Doi',
    category: 'Curd',
    description: 'Bengal-style caramelized sweet curd set slowly for a creamy finish.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
    price: 145,
    unit: '400 g',
    tag: 'Signature',
    stock: 30,
    isOutOfStock: false,
    rating: 4.9,
  },
  {
    id: 105,
    name: 'Bilona Ghee',
    category: 'Ghee',
    description: 'Slow-cultured ghee with a nutty aroma, prepared using the bilona method.',
    image: 'https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80',
    price: 740,
    unit: '500 ml',
    tag: 'Premium',
    stock: 18,
    isOutOfStock: false,
    rating: 4.9,
  },
  {
    id: 106,
    name: 'White Butter',
    category: 'Butter',
    description: 'Unsalted freshly churned makhan for parathas, dal, and everyday cooking.',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80',
    price: 260,
    unit: '250 g',
    tag: 'Churned fresh',
    stock: 21,
    isOutOfStock: false,
    rating: 4.7,
  },
  {
    id: 107,
    name: 'Set Curd',
    category: 'Curd',
    description: 'Naturally set dahi with a clean tang and smooth spoonable body.',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=900&q=80',
    price: 88,
    unit: '500 g',
    tag: 'No stabilizers',
    stock: 50,
    isOutOfStock: false,
    rating: 4.7,
  },
  {
    id: 108,
    name: 'Kesar Lassi',
    category: 'Beverages',
    description: 'Thick sweet lassi with saffron notes, packed chilled for a quick treat.',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80',
    price: 75,
    unit: '250 ml',
    tag: 'Ready to drink',
    stock: 64,
    isOutOfStock: false,
    rating: 4.6,
  },
  {
    id: 109,
    name: 'Masala Chaas',
    category: 'Beverages',
    description: 'Light buttermilk with roasted cumin, mint, and black salt.',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',
    price: 55,
    unit: '300 ml',
    tag: 'Summer pick',
    stock: 58,
    isOutOfStock: false,
    rating: 4.6,
  },
  {
    id: 110,
    name: 'Khoa Mawa',
    category: 'Sweets base',
    description: 'Reduced milk solids for laddoo, barfi, gujiya, and festive desserts.',
    image: 'https://images.unsplash.com/photo-1605197161470-b6b79c99a5a2?auto=format&fit=crop&w=900&q=80',
    price: 310,
    unit: '500 g',
    tag: 'Festive',
    stock: 16,
    isOutOfStock: false,
    rating: 4.8,
  },
  {
    id: 111,
    name: 'Malai Kulfi',
    category: 'Dessert',
    description: 'Dense milk kulfi with cardamom and pistachio, made without shortcuts.',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=900&q=80',
    price: 120,
    unit: '2 pieces',
    tag: 'Frozen',
    stock: 22,
    isOutOfStock: false,
    rating: 4.7,
  },
  {
    id: 112,
    name: 'Rose Badam Milk',
    category: 'Beverages',
    description: 'Chilled flavored milk with rose, almond, and a gentle cardamom finish.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    price: 95,
    unit: '250 ml',
    tag: 'Chef choice',
    stock: 38,
    isOutOfStock: false,
    rating: 4.6,
  },
];

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(app);

async function seed() {
  console.log('Registering users...');
  
  try {
    const adminCred = await createUserWithEmailAndPassword(auth, 'admin@mishti.in', 'admin123');
    await setDoc(doc(db, 'users', adminCred.user.uid), {
      id: adminCred.user.uid,
      email: 'admin@mishti.in',
      name: 'Mishti Admin',
      mobile: '+91 90000 11122',
      address: 'Mishti Farmer Operations Hub, Gurugram',
      role: 'admin'
    });
    console.log('Created admin account: admin@mishti.in / admin123');
  } catch (e: any) {
    if (e.code === 'auth/email-already-in-use') {
      console.log('Admin already exists.');
    } else {
      console.error('Error creating admin:', e);
    }
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, 'user@mishti.in', 'user123');
    await setDoc(doc(db, 'users', userCred.user.uid), {
      id: userCred.user.uid,
      email: 'user@mishti.in',
      name: 'Aarav Sharma',
      mobile: '+91 98765 43210',
      address: 'Flat 204, Green Park, New Delhi',
      role: 'user'
    });
    console.log('Created user account: user@mishti.in / user123');
  } catch (e: any) {
    if (e.code === 'auth/email-already-in-use') {
      console.log('User already exists.');
    } else {
      console.error('Error creating user:', e);
    }
  }

  console.log('Seeding products...');
  for (const product of PRODUCTS) {
    await setDoc(doc(db, 'products', product.id.toString()), product);
    console.log(`Added ${product.name}`);
  }
  
  console.log('Done!');
  process.exit(0);
}

seed().catch(console.error);
