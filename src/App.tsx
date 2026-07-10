import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import {
  Store,
  Monitor,
  Package,
  TrendingUp,
  Settings,
  ShoppingCart,
  User,
  MapPin,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  Clock,
  FileText,
  PlusCircle,
  Edit3,
  Trash2,
  DollarSign,
  ChevronRight,
  Copy,
  Check,
  Building,
  Menu,
  X,
  RefreshCw,
  Eye
} from 'lucide-react';

// ==========================================
// TYPES & SCHEMAS
// ==========================================
interface MenuItem {
  id: string;
  name: string;
  category: 'salad' | 'steamed' | 'package';
  description: string;
  price: number;
  image: string; // Emoji representing healthy food
  packageName: 'Paket 1' | 'Paket 2' | 'Paket 3' | 'Ala Carte';
  stock?: number;
  calories?: number;
  isRecommendation?: boolean;
}

interface OrderItem {
  productId: string;
  productName: string;
  packageName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  invoiceId: string;
  customerName: string;
  address: string;
  items: OrderItem[];
  paymentMethod: 'COD' | 'Mandiri' | 'BNI' | 'BCA' | 'BRI';
  totalPrice: number;
  status: 'Sedang dikemas' | 'Pesanan sedang diantar' | 'Pesanan tiba di alamat tujuan';
  createdAt: string;
  type: 'Webstore' | 'POS'; // Webstore order or physical POS order
}

// ==========================================
// INITIAL SEED DATA
// ==========================================
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'prod-1',
    name: 'JAGUNG',
    category: 'steamed',
    description: 'Menu sehat dan bergizi pilihan terbaik dari dapur Aimee Food, dikukus hangat tanpa minyak jenuh.',
    price: 40000,
    image: '/src/assets/images/steamed_corn_1783656731075.jpg',
    packageName: 'Ala Carte',
    stock: 14,
    calories: 420,
    isRecommendation: true
  },
  {
    id: 'prod-2',
    name: 'AIMEE SALAD SAYUR ORGANIK (PAKET 1)',
    category: 'salad',
    description: 'Campuran selada segar, tomat ceri, mentimun Jepang, wortel organik, jagung manis, dilengkapi dressing lemon zesty.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    packageName: 'Paket 1',
    stock: 24,
    calories: 220,
    isRecommendation: false
  },
  {
    id: 'prod-3',
    name: 'AIMEE SALAD BUAH & YOGURT HONEY (PAKET 2)',
    category: 'salad',
    description: 'Paduan buah apel segar, anggur merah, kiwi, stroberi, buah naga dengan siraman Greek Yogurt premium dan madu hutan.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=600&q=80',
    packageName: 'Paket 2',
    stock: 20,
    calories: 220,
    isRecommendation: true
  },
  {
    id: 'prod-4',
    name: 'AIMEE SALAD DADA AYAM PANGGANG (PAKET 3)',
    category: 'salad',
    description: 'Fillet dada ayam panggang rendah garam di atas hamparan kale, romaine lettuce, telur rebus organic, dan taburan biji chia.',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    packageName: 'Paket 3',
    stock: 15,
    calories: 380,
    isRecommendation: true
  },
  {
    id: 'prod-5',
    name: 'AIMEE SALAD ALPUKAT SEHAT (ALA CARTE)',
    category: 'salad',
    description: 'Alpukat mentega matang dengan paduan edamame, jagung manis pipil, romaine lettuce segar, dan olive oil murni.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    packageName: 'Ala Carte',
    stock: 18,
    calories: 220,
    isRecommendation: false
  },
  {
    id: 'prod-7',
    name: 'BENTO AYAM SAUS ASAM MANIS (PAKET 2)',
    category: 'steamed',
    description: 'Kombinasi brokoli, baby corn, dada ayam bumbu asam manis kukus rendah kalori dengan nasi premium rendah indeks glikemik.',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=600&q=80',
    packageName: 'Paket 2',
    stock: 12,
    calories: 420,
    isRecommendation: false
  },
  {
    id: 'prod-8',
    name: 'KUKUSAN SEHAT GYOSA AYAM SAYUR (PAKET 3)',
    category: 'steamed',
    description: 'Gyosa kukus lembut isi ayam jamur gurih rendah lemak, disajikan bersama brokoli kukus segar dan sup bening.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    packageName: 'Paket 3',
    stock: 16,
    calories: 290,
    isRecommendation: true
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'AMF-9921',
    invoiceId: 'INV-2026-001',
    customerName: 'Andi Pratama',
    address: 'Jl. Merdeka No. 45, Menteng, Jakarta Pusat',
    items: [
      {
        productId: 'prod-3',
        productName: 'Premium Fit Healthy Salmon',
        packageName: 'Paket 3',
        quantity: 2,
        price: 75000,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'prod-1',
        productName: 'Green Fresh Salad',
        packageName: 'Paket 1',
        quantity: 1,
        price: 35000,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
      }
    ],
    paymentMethod: 'BCA',
    totalPrice: 185000,
    status: 'Pesanan tiba di alamat tujuan',
    createdAt: '2026-07-01T11:20:00Z',
    type: 'Webstore'
  },
  {
    id: 'AMF-9925',
    invoiceId: 'INV-2026-002',
    customerName: 'Siti Rahmawati',
    address: 'Apartemen Kebayoran Height Lantai 12, Kebayoran Baru, Jakarta Selatan',
    items: [
      {
        productId: 'prod-2',
        productName: 'Protein Mix Steamed',
        packageName: 'Paket 2',
        quantity: 1,
        price: 48000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
      }
    ],
    paymentMethod: 'Mandiri',
    totalPrice: 48000,
    status: 'Pesanan sedang diantar',
    createdAt: '2026-07-08T09:15:00Z',
    type: 'Webstore'
  },
  {
    id: 'AMF-9928',
    invoiceId: 'INV-2026-003',
    customerName: 'Budi Santoso',
    address: 'Graha CIMB Niaga, Lantai 5, Sudirman, Jakarta',
    items: [
      {
        productId: 'prod-1',
        productName: 'Green Fresh Salad',
        packageName: 'Paket 1',
        quantity: 3,
        price: 35000,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'prod-4',
        productName: 'Dimsum Ayam Kukus Wortel',
        packageName: 'Ala Carte',
        quantity: 2,
        price: 28000,
        image: 'https://images.unsplash.com/photo-1496116211225-724a158ec0b1?auto=format&fit=crop&w=600&q=80'
      }
    ],
    paymentMethod: 'COD',
    totalPrice: 161000,
    status: 'Sedang dikemas',
    createdAt: '2026-07-09T06:45:00Z',
    type: 'Webstore'
  },
  {
    id: 'AMF-POS-100',
    invoiceId: 'INV-2026-004',
    customerName: 'Pelanggan POS (Walk-in)',
    address: 'Makan di tempat (Dine-In)',
    items: [
      {
        productId: 'prod-3',
        productName: 'Premium Fit Healthy Salmon',
        packageName: 'Paket 3',
        quantity: 1,
        price: 75000,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
      }
    ],
    paymentMethod: 'BCA',
    totalPrice: 75000,
    status: 'Pesanan tiba di alamat tujuan',
    createdAt: '2026-07-09T08:10:00Z',
    type: 'POS'
  }
];

// ==========================================
// REAL-TIME SYNC ENGINE (SIMULATED FIREBASE)
// ==========================================
const SYNC_EVENT_NAME = 'aimee_food_firebase_sync';

export default function App() {
  // DB States synchronized via LocalStorage & Custom Events
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Local/UI States
  const [currentView, setCurrentView] = useState<'webstore' | 'cart' | 'pos' | 'orders' | 'finance' | 'admin'>('webstore');
  const [persona, setPersona] = useState<'buyer' | 'merchant'>('buyer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'salad' | 'steamed' | 'package'>('all');
  const [selectedPackage, setSelectedPackage] = useState<'all' | 'Paket 1' | 'Paket 2' | 'Paket 3' | 'Ala Carte'>('all');
  
  // Cart state
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  
  // Webstore checkout states
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutPayment, setCheckoutPayment] = useState<'COD' | 'Mandiri' | 'BNI' | 'BCA' | 'BRI'>('COD');
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<Order | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // POS Checkout states
  const [posCart, setPosCart] = useState<{ [key: string]: number }>({});
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'COD' | 'Mandiri' | 'BNI' | 'BCA' | 'BRI'>('BCA');
  const [posSuccessOrder, setPosSuccessOrder] = useState<Order | null>(null);

  // Tracking search state
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackError, setTrackError] = useState(false);

  // Admin menu editor states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'salad' | 'steamed' | 'package'>('salad');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemImage, setNewItemImage] = useState('🥗');
  const [newItemPackage, setNewItemPackage] = useState<'Paket 1' | 'Paket 2' | 'Paket 3' | 'Ala Carte'>('Ala Carte');

  // Copy tracking states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active status syncing message
  const [isSyncing, setIsSyncing] = useState(false);

  // Merchant backoffice passcode security states
  const [merchantPasscode, setMerchantPasscode] = useState('');
  const [isMerchantUnlocked, setIsMerchantUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setMerchantPasscode(val);
    setPasscodeError(false);
  };

  const handleKeypadPress = (val: string) => {
    if (merchantPasscode.length < 4) {
      setMerchantPasscode((prev) => prev + val);
      setPasscodeError(false);
    }
  };

  const handleKeypadClear = () => {
    setMerchantPasscode('');
    setPasscodeError(false);
  };

  const handlePasscodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (merchantPasscode === '2026' || merchantPasscode === '1234') {
      setIsMerchantUnlocked(true);
      setPasscodeError(false);
      setMerchantPasscode('');
    } else {
      setPasscodeError(true);
      setMerchantPasscode('');
    }
  };

  // Initialize DB & Listen to updates (Real-time Firebase emulator)
  useEffect(() => {
    // Read from localStorage on mount
    const savedMenu = localStorage.getItem('aimee_food_menu');
    const savedOrders = localStorage.getItem('aimee_food_orders');

    let initialMenu = DEFAULT_MENU_ITEMS;
    if (savedMenu) {
      try {
        const parsed = JSON.parse(savedMenu);
        // Force migration to new menu items if old ones exist, don't have stock property, length changed, or the jagung image isn't updated
        if (parsed.some((item: any) => item.name === 'Green Fresh Salad' || item.name === 'Protein Mix Steamed' || !('stock' in item) || (item.id === 'prod-1' && item.image && !item.image.includes('steamed_corn_1783656731075'))) || parsed.length > DEFAULT_MENU_ITEMS.length) {
          localStorage.setItem('aimee_food_menu', JSON.stringify(DEFAULT_MENU_ITEMS));
          initialMenu = DEFAULT_MENU_ITEMS;
        } else {
          initialMenu = parsed;
        }
      } catch (e) {
        localStorage.setItem('aimee_food_menu', JSON.stringify(DEFAULT_MENU_ITEMS));
        initialMenu = DEFAULT_MENU_ITEMS;
      }
    } else {
      localStorage.setItem('aimee_food_menu', JSON.stringify(DEFAULT_MENU_ITEMS));
    }
    setMenuItems(initialMenu);

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      localStorage.setItem('aimee_food_orders', JSON.stringify(DEFAULT_ORDERS));
      setOrders(DEFAULT_ORDERS);
    }

    // Listener for cross-tab or cross-component real-time Firebase emulation
    const handleSync = () => {
      setIsSyncing(true);
      const updatedMenu = localStorage.getItem('aimee_food_menu');
      const updatedOrders = localStorage.getItem('aimee_food_orders');
      if (updatedMenu) setMenuItems(JSON.parse(updatedMenu));
      if (updatedOrders) setOrders(JSON.parse(updatedOrders));
      
      setTimeout(() => {
        setIsSyncing(false);
      }, 600);
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync); // Works across tabs!

    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Helper to publish updates (triggers Firebase synchronization event)
  const publishDatabaseUpdates = (updatedMenu: MenuItem[], updatedOrders: Order[]) => {
    localStorage.setItem('aimee_food_menu', JSON.stringify(updatedMenu));
    localStorage.setItem('aimee_food_orders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
  };

  // Switch View handler
  const handleViewChange = (view: 'webstore' | 'cart' | 'pos' | 'orders' | 'finance' | 'admin') => {
    setCurrentView(view);
    // Reset specific search and success outputs
    setCheckoutSuccessOrder(null);
    setPosSuccessOrder(null);
  };

  // Reset tracking state
  const handleResetTracking = () => {
    setTrackedOrder(null);
    setTrackingIdInput('');
    setTrackError(false);
  };

  // Switch persona (Buyer vs Merchant)
  const handlePersonaSwitch = (newPersona: 'buyer' | 'merchant') => {
    setPersona(newPersona);
    if (newPersona === 'buyer') {
      setCurrentView('webstore');
      setIsMerchantUnlocked(false); // Relock merchant backoffice for security
    } else {
      setCurrentView('pos');
    }
  };

  // ==========================================
  // WEBSTORE CART LOGIC
  // ==========================================
  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  const totalCartItems = (Object.values(cart) as number[]).reduce((a: number, b: number) => a + b, 0);

  const cartDetails = useMemo(() => {
    return Object.entries(cart).map(([id, quantity]) => {
      const product = menuItems.find((item) => item.id === id);
      const q = quantity as number;
      return {
        product,
        quantity: q,
        total: product ? product.price * q : 0
      };
    }).filter((item) => item.product !== undefined) as { product: MenuItem; quantity: number; total: number }[];
  }, [cart, menuItems]);

  const totalCartPrice = cartDetails.reduce((sum, item) => sum + item.total, 0);

  // ==========================================
  // WEBSTORE CHECKOUT SUBMISSION
  // ==========================================
  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cartDetails.length === 0 || !checkoutName || !checkoutAddress) return;

    const invoiceNumber = `INV-2026-0${orders.length + 1}`;
    const trackingCode = `AMF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: trackingCode,
      invoiceId: invoiceNumber,
      customerName: checkoutName,
      address: checkoutAddress,
      items: cartDetails.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        packageName: c.product.packageName,
        quantity: c.quantity,
        price: c.product.price,
        image: c.product.image
      })),
      paymentMethod: checkoutPayment,
      totalPrice: totalCartPrice,
      status: 'Sedang dikemas',
      createdAt: new Date().toISOString(),
      type: 'Webstore'
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    publishDatabaseUpdates(menuItems, updatedOrders);

    // Set success & Clear Cart
    setCheckoutSuccessOrder(newOrder);
    setCart({});
    setCheckoutName('');
    setCheckoutAddress('');
    setShowCheckoutModal(false);
  };

  // ==========================================
  // POS TERMINAL LOGIC
  // ==========================================
  const handleAddToPosCart = (productId: string) => {
    setPosCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleRemoveFromPosCart = (productId: string) => {
    setPosCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const posCartDetails = useMemo(() => {
    return Object.entries(posCart).map(([id, quantity]) => {
      const product = menuItems.find((item) => item.id === id);
      const q = quantity as number;
      return {
        product,
        quantity: q,
        total: product ? product.price * q : 0
      };
    }).filter((item) => item.product !== undefined) as { product: MenuItem; quantity: number; total: number }[];
  }, [posCart, menuItems]);

  const totalPosPrice = posCartDetails.reduce((sum, item) => sum + item.total, 0);

  const handlePosCheckout = () => {
    if (posCartDetails.length === 0) return;

    const invoiceNumber = `INV-2026-0${orders.length + 1}`;
    const trackingCode = `AMF-POS-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: trackingCode,
      invoiceId: invoiceNumber,
      customerName: posCustomerName.trim() || 'Pelanggan POS (Walk-in)',
      address: 'Makan di tempat (Dine-In)',
      items: posCartDetails.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        packageName: c.product.packageName,
        quantity: c.quantity,
        price: c.product.price,
        image: c.product.image
      })),
      paymentMethod: posPaymentMethod,
      totalPrice: totalPosPrice,
      status: 'Pesanan tiba di alamat tujuan', // Immediate dine-in fulfillment
      createdAt: new Date().toISOString(),
      type: 'POS'
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    publishDatabaseUpdates(menuItems, updatedOrders);

    setPosSuccessOrder(newOrder);
    setPosCart({});
    setPosCustomerName('');
  };

  // ==========================================
  // BUYER DELIVERY TRACKING & INVOICE LOOKUP
  // ==========================================
  const handleTrackOrder = (e: FormEvent) => {
    e.preventDefault();
    const searchId = trackingIdInput.trim().toUpperCase();
    const found = orders.find((o) => o.id === searchId || o.invoiceId === searchId);
    
    if (found) {
      setTrackedOrder(found);
      setTrackError(false);
    } else {
      setTrackedOrder(null);
      setTrackError(true);
    }
  };

  // ==========================================
  // MERCHANT ORDER STATUS MANAGEMENT
  // ==========================================
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updatedOrders);
    publishDatabaseUpdates(menuItems, updatedOrders);

    // If currently tracking the same order, update the tracking screen in real-time as well!
    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder({ ...trackedOrder, status: newStatus });
    }
  };

  // Delete Order
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini dari rekap?')) {
      const updatedOrders = orders.filter((o) => o.id !== orderId);
      setOrders(updatedOrders);
      publishDatabaseUpdates(menuItems, updatedOrders);
      if (trackedOrder && trackedOrder.id === orderId) {
        setTrackedOrder(null);
      }
    }
  };

  // ==========================================
  // ADMIN MENU EDITOR CRUD
  // ==========================================
  const handleAddOrEditMenuItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItemName || newItemPrice <= 0) return;

    if (editingItem) {
      // Edit mode
      const updatedMenu = menuItems.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            name: newItemName,
            category: newItemCategory,
            description: newItemDescription,
            price: newItemPrice,
            image: newItemImage,
            packageName: newItemPackage
          };
        }
        return item;
      });
      setMenuItems(updatedMenu);
      publishDatabaseUpdates(updatedMenu, orders);
      setEditingItem(null);
    } else {
      // Add mode
      const newItem: MenuItem = {
        id: `prod-${Date.now()}`,
        name: newItemName,
        category: newItemCategory,
        description: newItemDescription,
        price: newItemPrice,
        image: newItemImage,
        packageName: newItemPackage
      };
      const updatedMenu = [...menuItems, newItem];
      setMenuItems(updatedMenu);
      publishDatabaseUpdates(updatedMenu, orders);
    }

    // Reset fields
    setNewItemName('');
    setNewItemDescription('');
    setNewItemPrice(0);
    setNewItemImage('🥗');
    setNewItemPackage('Ala Carte');
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemCategory(item.category);
    setNewItemDescription(item.description);
    setNewItemPrice(item.price);
    setNewItemImage(item.image);
    setNewItemPackage(item.packageName);
    // Auto-scroll or pivot views
    document.getElementById('menu-editor-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteMenuItem = (itemId: string) => {
    if (window.confirm('Yakin ingin menghapus produk sehat ini dari daftar menu?')) {
      const updatedMenu = menuItems.filter((item) => item.id !== itemId);
      setMenuItems(updatedMenu);
      publishDatabaseUpdates(updatedMenu, orders);
      
      // Cancel edit if deleting the editing item
      if (editingItem && editingItem.id === itemId) {
        setEditingItem(null);
        setNewItemName('');
        setNewItemDescription('');
        setNewItemPrice(0);
      }
    }
  };

  // Copy tracking code indicator helper
  const triggerCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ==========================================
  // FINANCE REPORT & ANALYTICS
  // ==========================================
  // Calculate analytics
  const financeAnalytics = useMemo(() => {
    // Total gross sales
    const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    
    // Assume 45% Net Profit Margin for Healthy Foods
    const profitMarginPercentage = 45;
    const totalProfit = Math.round(totalSales * (profitMarginPercentage / 100));

    // Grouping by package sales count
    const packageStats: { [key: string]: number } = {
      'Paket 1': 0,
      'Paket 2': 0,
      'Paket 3': 0,
      'Ala Carte': 0
    };

    orders.forEach((o) => {
      o.items.forEach((item) => {
        const pkg = item.packageName || 'Ala Carte';
        if (packageStats[pkg] !== undefined) {
          packageStats[pkg] += item.quantity;
        } else {
          packageStats['Ala Carte'] += item.quantity;
        }
      });
    });

    // Monthly data simulation for graph (Week 1 to Week 4 based on order dates)
    const weeklySales = [0, 0, 0, 0];
    const weeklyProfit = [0, 0, 0, 0];

    orders.forEach((o) => {
      const date = new Date(o.createdAt);
      const day = date.getDate();
      
      let weekIdx = 0;
      if (day <= 7) weekIdx = 0;
      else if (day <= 14) weekIdx = 1;
      else if (day <= 21) weekIdx = 2;
      else weekIdx = 3;

      weeklySales[weekIdx] += o.totalPrice;
      weeklyProfit[weekIdx] += Math.round(o.totalPrice * (profitMarginPercentage / 100));
    });

    return {
      totalSales,
      totalProfit,
      packageStats,
      weeklySales,
      weeklyProfit,
      ordersCount: orders.length
    };
  }, [orders]);

  // Filter products based on search query, category, and package state
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'steamed') {
          matchesCategory = item.category === 'steamed' || item.category === 'package';
        } else {
          matchesCategory = item.category === selectedCategory;
        }
      }
      
      const matchesPackage = selectedPackage === 'all' || item.packageName === selectedPackage;
      
      return matchesSearch && matchesCategory && matchesPackage;
    });
  }, [menuItems, searchQuery, selectedCategory, selectedPackage]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Top Banner Role Switching */}
      <div className="bg-slate-950 text-white px-4 py-2 flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Aimee Food Realtime Database Link:</span>
          <button
            onClick={() => {
              setIsSyncing(true);
              const updatedMenu = localStorage.getItem('aimee_food_menu');
              const updatedOrders = localStorage.getItem('aimee_food_orders');
              if (updatedMenu) setMenuItems(JSON.parse(updatedMenu));
              if (updatedOrders) setOrders(JSON.parse(updatedOrders));
              window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
              setTimeout(() => {
                setIsSyncing(false);
              }, 600);
            }}
            title="Klik untuk menyegarkan database"
            className="font-mono bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            Cloud Firestore Simulator Active
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-md p-0.5 bg-slate-900 border border-slate-800">
            <button
              onClick={() => handlePersonaSwitch('buyer')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                persona === 'buyer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛍️ Webstore
            </button>
            <button
              onClick={() => handlePersonaSwitch('merchant')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                persona === 'merchant'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏪 Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-green-950 text-white flex flex-col shrink-0 border-r border-green-900 shadow-xl">
          {/* Brand Logo Header */}
          <div className="p-6 flex items-center gap-3 border-b border-green-900">
            <div className="relative w-12 h-12 flex shrink-0">
              {/* Salad image icon */}
              <div className="w-8 h-8 rounded-full border-2 border-green-900 overflow-hidden shadow-md absolute left-0 top-0 z-10 bg-emerald-700">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80" 
                  alt="Salad" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Kukusan image icon */}
              <div className="w-8 h-8 rounded-full border-2 border-green-900 overflow-hidden shadow-md absolute right-0 bottom-0 z-20 bg-emerald-700 animate-pulse">
                <img 
                  src="https://images.unsplash.com/photo-1496116211225-724a158ec0b1?auto=format&fit=crop&w=100&q=80" 
                  alt="Kukusan" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block text-white leading-none">Aimee Food</span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide">POS & Webstore Sehat</span>
            </div>
          </div>

          {/* Sidebar Menu Options */}
          <nav className="flex-1 py-6 px-4 space-y-1.5">
            {persona === 'buyer' ? (
              <>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-green-400">
                  Customer Menu
                </div>
                <button
                  onClick={() => handleViewChange('webstore')}
                  className={`w-full rounded-xl px-4 py-3 text-sm flex items-center gap-3 font-medium transition-all ${
                    currentView === 'webstore' && !trackedOrder
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'text-green-200 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4 text-emerald-400" />
                  Belanja Salad & Kukus
                </button>
                <button
                  onClick={() => handleViewChange('cart')}
                  className={`w-full rounded-xl px-4 py-3 text-sm flex items-center justify-between font-medium transition-all ${
                    currentView === 'cart'
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'text-green-200 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    <span>Keranjang Belanja</span>
                  </div>
                  {totalCartItems > 0 && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {totalCartItems}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    handleViewChange('webstore');
                    // Quick focus into tracking state
                    setTrackedOrder(null);
                    setTrackError(false);
                    const trackerElem = document.getElementById('tracking-section');
                    if (trackerElem) trackerElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-sm flex items-center gap-3 font-medium transition-all ${
                    currentView === 'webstore' && trackedOrder
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'text-green-200 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  Lacak Pengiriman
                </button>
              </>
            ) : (
              <>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-green-400">
                  Merchant POS & Backoffice
                </div>
                {!isMerchantUnlocked ? (
                  <div className="px-3 py-4 text-center rounded-2xl bg-green-950/60 border border-green-900/50 space-y-2 mt-2">
                    <span className="text-xl block animate-bounce">🔒</span>
                    <span className="text-xs font-bold text-emerald-400 block">Backoffice Terkunci</span>
                    <p className="text-[10px] text-green-300 leading-relaxed font-medium">Masukkan PIN "2026" di panel utama untuk mengaktifkan menu admin.</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleViewChange('pos')}
                      className={`w-full rounded-xl px-4 py-3 text-sm flex items-center gap-3 font-medium transition-all ${
                        currentView === 'pos'
                          ? 'bg-emerald-800 text-white shadow-md'
                          : 'text-green-200 hover:bg-emerald-900/40 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-4 h-4 text-emerald-400" />
                      POS Terminal Kasir
                    </button>
                    <button
                      onClick={() => handleViewChange('orders')}
                      className={`w-full rounded-xl px-4 py-3 text-sm flex items-center gap-3 font-medium transition-all ${
                        currentView === 'orders'
                          ? 'bg-emerald-800 text-white shadow-md'
                          : 'text-green-200 hover:bg-emerald-900/40 hover:text-white'
                      }`}
                    >
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span className="flex-1 text-left">Kelola Pesanan</span>
                      {orders.filter(o => o.status === 'Sedang dikemas').length > 0 && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {orders.filter(o => o.status === 'Sedang dikemas').length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleViewChange('finance')}
                      className={`w-full rounded-xl px-4 py-3 text-sm flex items-center gap-3 font-medium transition-all ${
                        currentView === 'finance'
                          ? 'bg-emerald-800 text-white shadow-md'
                          : 'text-green-200 hover:bg-emerald-900/40 hover:text-white'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Laporan Keuangan
                    </button>
                    <button
                      onClick={() => handleViewChange('admin')}
                      className={`w-full rounded-xl px-4 py-3 text-sm flex items-center gap-3 font-medium transition-all ${
                        currentView === 'admin'
                          ? 'bg-emerald-800 text-white shadow-md'
                          : 'text-green-200 hover:bg-emerald-900/40 hover:text-white'
                      }`}
                    >
                      <Settings className="w-4 h-4 text-emerald-400" />
                      Edit Menu & Harga
                    </button>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Cloud State Info */}
          <div className="p-4 border-t border-green-900 bg-green-950/70">
            <div className="text-[9px] text-emerald-400 font-mono uppercase tracking-widest mb-1.5 font-bold">
              Database Sync Connected
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-100">Firebase Real-time: Online</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 min-h-0">
          
          {/* Lock Screen for Merchant Mode */}
          {persona === 'merchant' && !isMerchantUnlocked && (
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-slate-100">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden transform transition-all">
                {/* Visual Header */}
                <div className="bg-gradient-to-r from-green-950 to-emerald-800 p-6 text-white text-center space-y-2 relative">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                    🔐
                  </div>
                  <h3 className="font-extrabold text-lg">Aimee Food - Backoffice Gate</h3>
                  <p className="text-emerald-100 text-xs">Sandi khusus mitra pengelola toko & kasir</p>
                </div>

                {/* Form Body */}
                <div className="p-6 md:p-8 space-y-6">
                  <div className="space-y-2 text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Masukkan Kode Akses Merchant</span>
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3].map((idx) => {
                        const char = merchantPasscode[idx];
                        return (
                          <div 
                            key={idx} 
                            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                              passcodeError ? 'border-red-300 bg-red-50 text-red-600 animate-bounce' :
                              char ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            {char ? '●' : ''}
                          </div>
                        );
                      })}
                    </div>
                    {passcodeError && (
                      <span className="text-xs text-red-500 font-bold block animate-pulse">⚠️ Kode Sandi Salah!</span>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                    <input
                      type="password"
                      maxLength={4}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="Ketik 4 digit sandi..."
                      value={merchantPasscode}
                      onChange={handlePasscodeChange}
                      className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs"
                      autoFocus
                    />

                    {/* Quick Numeric Keypad */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleKeypadPress(num.toString())}
                          className="py-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm transition-all"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleKeypadClear}
                        className="py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold text-xs transition-all uppercase"
                      >
                        Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadPress('0')}
                        className="py-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm transition-all"
                      >
                        0
                      </button>
                      <button
                        type="submit"
                        className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition-all uppercase tracking-wider shadow-md shadow-emerald-100"
                      >
                        Masuk
                      </button>
                    </div>

                    <div className="text-center pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block bg-amber-50 text-amber-800 py-1.5 px-3 rounded-lg border border-amber-100">
                        🔑 Kode PIN default mitra: <strong className="font-extrabold font-mono text-xs">2026</strong> atau <strong className="font-extrabold font-mono text-xs">1234</strong>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Webstore Client View */}
          {currentView === 'webstore' && (
            <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto w-full flex-1">
              {/* Webstore Hero Promo Card */}
              <div className="relative bg-[#f4fbf7] rounded-[32px] p-6 md:p-12 text-slate-800 overflow-hidden border border-emerald-100/60 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
                {/* Decorative Elements */}
                <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-green-400/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Left Column: Text & Badges & Actions */}
                <div className="relative z-10 max-w-2xl space-y-6 flex-1">
                  <div className="inline-flex items-center gap-1.5 bg-[#e8f7f0] text-[#00966b] text-[10px] md:text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full border border-[#cbeedc] select-none shadow-sm">
                    <span>✨</span> 100% Organik & Kukusan Rendah Kalori
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-[1.15]">
                    Catering Makanan Sehat <br/>
                    <span className="text-[#00966b] relative inline-block">
                      Aimee Food
                    </span> Untuk Dietmu
                  </h1>
                  
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xl font-medium">
                    Nikmati salad premium segar dari kebun hidroponik lokal dan aneka dimsum serta bento kukus nikmat tanpa tambahan MSG, pengawet, atau minyak jenuh berlebih. Diantar higienis langsung ke depan rumah!
                  </p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <span className="text-red-500">❤️</span> Rendah Kolesterol
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <span className="text-amber-500">⭐</span> Rating 4.9/5 Toko
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <span className="text-emerald-500">📋</span> Pengiriman Higienis
                    </span>
                  </div>

                  <div className="pt-3 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={() => {
                        const element = document.getElementById('menu-catalog');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-[#00966b] hover:bg-[#007f5a] text-white px-6 py-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/10 active:scale-95 transition-all"
                    >
                      Lihat Menu Lengkap <span className="text-lg">→</span>
                    </button>
                    <button
                      onClick={() => {
                        const element = document.getElementById('tracking-section');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-3.5 rounded-2xl font-black text-xs md:text-sm transition-all shadow-sm active:scale-95"
                    >
                      Lacak Pesanan Saya
                    </button>
                  </div>
                </div>

                {/* Right Column: Circular image with beautiful overlay badges */}
                <div className="relative flex-1 max-w-md w-full flex items-center justify-center select-none lg:mt-0 mt-6">
                  {/* Outer glowing border */}
                  <div className="absolute w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-[#00966b]/5 blur-2xl animate-pulse"></div>
                  
                  {/* Thick border salad circle */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-88 md:h-88 rounded-full border-8 border-emerald-100/50 bg-white overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.02]">
                    <img 
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" 
                      alt="Aimee Food Catering Sehat" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Overlay Badge 1 (Top-Right): Salad Organik */}
                  <div className="absolute top-4 -right-1 sm:right-0 bg-white rounded-2xl p-3 shadow-xl border border-slate-100/80 flex items-center gap-3 transition-transform duration-500 hover:translate-y-[-4px] z-10">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl shrink-0 border border-emerald-100/30">
                      🥗
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs">Salad Organik</h4>
                      <p className="text-[10px] text-slate-400 font-bold">Serat tinggi</p>
                    </div>
                  </div>

                  {/* Overlay Badge 2 (Bottom-Left): Aneka Dimsum */}
                  <div className="absolute bottom-4 -left-1 sm:left-0 bg-white rounded-2xl p-3 shadow-xl border border-slate-100/80 flex items-center gap-3 transition-transform duration-500 hover:translate-y-[4px] z-10">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl shrink-0 border border-amber-100/30">
                      🥟
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs">Aneka Dimsum</h4>
                      <p className="text-[10px] text-slate-400 font-bold">Kukusan Sehat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Catalog Section (Full Width) */}
              <div className="space-y-8">
                
                {/* Category Filter and Search Panel */}
                <div id="menu-catalog" className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] md:text-xs font-black text-[#00966b] uppercase tracking-wider">AIMEE SEHAT CATALOG</p>
                        <h2 className="text-xl md:text-[28px] font-black text-slate-900 tracking-tight mt-1 leading-tight">Silahkan Pilih Menu Sehat Favorit Anda</h2>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 select-none shrink-0">
                        <button
                          onClick={() => {
                            setSelectedCategory('all');
                          }}
                          className={`px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                            selectedCategory === 'all'
                              ? 'bg-[#00966b] text-white shadow-md shadow-emerald-600/15'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                          }`}
                        >
                          Semua Makanan
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory('salad');
                          }}
                          className={`px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                            selectedCategory === 'salad'
                              ? 'bg-[#00966b] text-white shadow-md shadow-emerald-600/15'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                          }`}
                        >
                          🥗 Makanan Sehat Salad
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory('steamed');
                          }}
                          className={`px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                            selectedCategory === 'steamed'
                              ? 'bg-[#00966b] text-white shadow-md shadow-emerald-600/15'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                          }`}
                        >
                          🥟 Makanan Kukus-an
                        </button>
                      </div>
                    </div>

                    {/* Secondary Filters: Pilihan Paket & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none pt-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="text-slate-400 font-extrabold text-[10px] md:text-xs tracking-wider uppercase">PILIHAN PAKET:</span>
                        <div className="flex flex-wrap gap-2 items-center">
                          {(['all', 'Paket 1', 'Paket 2', 'Paket 3', 'Ala Carte'] as const).map((pkg) => (
                            <button
                              key={pkg}
                              onClick={() => setSelectedPackage(pkg)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                                selectedPackage === pkg
                                  ? 'bg-[#e2f6ec] border border-[#a3e4c4] text-[#00966b] shadow-sm'
                                  : 'bg-transparent border border-transparent text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              {pkg === 'all' ? 'Semua' : pkg}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clean Search input */}
                      <div className="relative w-full md:w-64">
                        <input
                          type="text"
                          placeholder="Cari menu diet impianmu..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-xs text-slate-800 font-medium placeholder:text-slate-400 shadow-sm"
                        />
                        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Menu Items Grid */}
                  <div className="space-y-5">
                    {filteredMenuItems.length === 0 ? (
                      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
                        <span className="text-5xl block">🥗</span>
                        <h4 className="font-extrabold text-slate-800">Menu Tidak Ditemukan</h4>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">Tidak ada produk healthy salad atau kukusan yang cocok dengan kriteria pencarian Anda saat ini.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredMenuItems.map((item) => {
                          const stockCount = item.stock ?? 15;
                          const calorieCount = item.calories ?? 240;
                          const isRec = item.isRecommendation ?? false;
                          const isSalad = item.category === 'salad';

                          return (
                            <div
                              key={item.id}
                              className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200/60 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden"
                            >
                              {/* Food Image Container with Hover zoom */}
                              <div className="h-44 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative shadow-inner select-none">
                                {item.image && item.image.startsWith('http') ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105" 
                                  />
                                ) : (
                                  <span className="text-6xl select-none">🥗</span>
                                )}
                                
                                {/* Overlay Category Badges (Top-Left) */}
                                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                                  <span className="bg-[#00966b] text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                                    {isSalad ? 'SALAD' : 'KUKUSAN'}
                                  </span>
                                  <span className="bg-[#fffdf0] border border-[#fef08a] text-[#8a6311] text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                                    {item.packageName}
                                  </span>
                                </div>

                                {/* Calorie Overlay badge (Bottom-Right) */}
                                <div className="absolute bottom-2.5 right-2.5 bg-slate-950/70 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                                  🔥 {calorieCount} kkal
                                </div>
                              </div>

                              {/* Title & Description */}
                              <div className="flex-1 px-1.5 space-y-1 mb-4">
                                <h4 className="font-extrabold text-slate-800 text-[13px] md:text-sm group-hover:text-[#00966b] transition-colors leading-snug uppercase tracking-wide">
                                  {item.name}
                                </h4>
                                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 font-medium">
                                  {item.description}
                                </p>
                              </div>

                              {/* Stock & Diet Recommendation */}
                              <div className="flex items-center justify-between px-1.5 pb-3 border-b border-slate-100 mb-3 select-none">
                                <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wide">
                                  STOK: {stockCount} PORSI
                                </span>
                                {isRec && (
                                  <span className="text-[#00966b] font-extrabold text-[10px] flex items-center gap-1 uppercase tracking-wide">
                                    <svg className="w-3.5 h-3.5 text-[#00966b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M3 12h3m12 0h3M4.22 19.78l2.12-2.12m11.32-11.32l2.12-2.12" />
                                    </svg>
                                    Rekomendasi Diet
                                  </span>
                                )}
                              </div>

                              {/* Price and Add to Cart Section */}
                              <div className="flex items-center justify-between px-1.5 pb-1 mt-auto">
                                <div className="flex flex-col">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">HARGA</span>
                                  <span className="font-black text-[#00966b] text-base border-b-2 border-emerald-400/70 inline-block leading-tight">
                                    Rp {item.price.toLocaleString('id-ID')}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleAddToCart(item.id)}
                                  className="w-9 h-9 bg-slate-50 hover:bg-emerald-50 active:scale-90 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#00966b] hover:border-emerald-300 transition-all shadow-sm cursor-pointer"
                                  title="Tambah ke Keranjang"
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Sections: Centered Shipment Tracking Column */}
                <div className="max-w-3xl mx-auto w-full mt-12 space-y-6">
                  {/* Shipment Tracking Real-time Search Panel (Customer anchor point) */}
                    <div id="tracking-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6 transition-all hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-50 rounded-2xl text-amber-700 border border-amber-100">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-base">Lacak Pengiriman & Invoice Pesanan</h3>
                        <p className="text-slate-400 text-xs mt-0.5">Gunakan kode transaksi unik (cth: AMF-XXXX) untuk memeriksa rincian progress pengiriman harian.</p>
                      </div>
                    </div>

                    <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Masukkan Kode Transaksi atau Nomor Invoice..."
                        value={trackingIdInput}
                        onChange={(e) => setTrackingIdInput(e.target.value)}
                        className="flex-1 px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 uppercase font-mono font-bold placeholder:font-sans placeholder:font-normal"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 hover:shadow-lg transition-all tracking-wider uppercase shrink-0"
                      >
                        Lacak Pesanan
                      </button>
                    </form>

                    {trackError && (
                      <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl font-bold border border-red-100 flex items-center gap-2 animate-shake">
                        ⚠️ Kode transaksi atau nomor invoice tidak ditemukan. Harap periksa e-wallet atau rincian checkout.
                      </div>
                    )}

                    {/* Active Tracked Order Block */}
                    {trackedOrder && (
                      <div className="border border-slate-200/80 rounded-2xl p-6 space-y-6 bg-slate-50 relative overflow-hidden">
                        <div className="absolute right-4 top-4 w-20 h-20 bg-slate-200/20 rounded-full blur-xl pointer-events-none"></div>

                        {/* Header Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">KODE PELACAKAN</span>
                            <span className="font-extrabold text-slate-800 text-sm tracking-wide font-mono">{trackedOrder.id}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block text-right">INVOICE</span>
                            <span className="font-extrabold text-slate-800 text-sm tracking-wide font-mono">{trackedOrder.invoiceId}</span>
                          </div>
                          <button
                            onClick={handleResetTracking}
                            className="text-xs bg-slate-200/60 hover:bg-red-50 text-slate-500 hover:text-red-600 px-3 py-1 rounded-xl font-bold transition-all"
                          >
                            Tutup
                          </button>
                        </div>

                        {/* Tracker Visual Steps */}
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left">Status Pengantaran Kurir</p>
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative pt-2">
                            
                            {/* Step 1: Sedang Dikemas */}
                            <div className="flex flex-col items-center text-center space-y-2 relative z-10 w-full sm:w-1/3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                trackedOrder.status === 'Sedang dikemas' || trackedOrder.status === 'Pesanan sedang diantar' || trackedOrder.status === 'Pesanan tiba di alamat tujuan'
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                  : 'bg-white border-slate-200 text-slate-400'
                              }`}>
                                <Clock className="w-4.5 h-4.5" />
                              </div>
                              <div className="space-y-0.5">
                                <span className={`text-[10px] font-black block uppercase tracking-wide ${
                                  trackedOrder.status === 'Sedang dikemas' ? 'text-emerald-600' : 'text-slate-500'
                                }`}>Sedang Dikemas</span>
                                <span className="text-[9px] text-slate-400 block font-medium">Bahan sedang dipacking</span>
                              </div>
                            </div>

                            {/* Step 2: Sedang Diantar */}
                            <div className="flex flex-col items-center text-center space-y-2 relative z-10 w-full sm:w-1/3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                trackedOrder.status === 'Pesanan sedang diantar' || trackedOrder.status === 'Pesanan tiba di alamat tujuan'
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                  : 'bg-white border-slate-200 text-slate-400'
                              }`}>
                                <Truck className="w-4.5 h-4.5" />
                              </div>
                              <div className="space-y-0.5">
                                <span className={`text-[10px] font-black block uppercase tracking-wide ${
                                  trackedOrder.status === 'Pesanan sedang diantar' ? 'text-emerald-600' : 'text-slate-500'
                                }`}>Pesanan Diantar</span>
                                <span className="text-[9px] text-slate-400 block font-medium">Kurir menuju alamatmu</span>
                              </div>
                            </div>

                            {/* Step 3: Tiba di Alamat */}
                            <div className="flex flex-col items-center text-center space-y-2 relative z-10 w-full sm:w-1/3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                trackedOrder.status === 'Pesanan tiba di alamat tujuan'
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                  : 'bg-white border-slate-200 text-slate-400'
                              }`}>
                                <CheckCircle2 className="w-4.5 h-4.5" />
                              </div>
                              <div className="space-y-0.5">
                                <span className={`text-[10px] font-black block uppercase tracking-wide ${
                                  trackedOrder.status === 'Pesanan tiba di alamat tujuan' ? 'text-emerald-600' : 'text-slate-500'
                                }`}>Pesanan Tiba</span>
                                <span className="text-[9px] text-slate-400 block font-medium">Selesai diserahterimakan</span>
                              </div>
                            </div>

                            {/* Connecting Line behind icons (Desktop only) */}
                            <div className="hidden sm:block absolute top-5 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-0"></div>
                            <div className="hidden sm:block absolute top-5 left-[16%] h-0.5 bg-emerald-500 -z-0 transition-all" style={{
                              width: trackedOrder.status === 'Sedang dikemas' ? '0%' :
                                     trackedOrder.status === 'Pesanan sedang diantar' ? '34%' : '68%'
                            }}></div>
                          </div>
                        </div>

                        {/* Invoice & Shipping details */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4">
                          <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                            <span>📄 Invoice Pembelian Resmi</span>
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-[10px] font-black">LUNAS</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <span className="text-[9px] text-slate-400 block uppercase font-black tracking-wider mb-1">Nama Pembeli</span>
                              <span className="text-slate-800 text-[13px] font-black">{trackedOrder.customerName}</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <span className="text-[9px] text-slate-400 block uppercase font-black tracking-wider mb-1">Metode Pembayaran</span>
                              <span className="text-slate-800 text-[13px] font-black">{trackedOrder.paymentMethod} {trackedOrder.paymentMethod !== 'COD' && 'Transfer'}</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                              <span className="text-[9px] text-slate-400 block uppercase font-black tracking-wider mb-1">Alamat Pengantaran</span>
                              <span className="text-slate-700 font-bold leading-relaxed">{trackedOrder.address}</span>
                            </div>
                          </div>

                          {/* Ordered Items Table */}
                          <div className="border-t border-slate-100 pt-3 space-y-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rincian Paket Sehat</span>
                            
                            <div className="divide-y divide-slate-100">
                              {trackedOrder.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs py-2.5">
                                  <div className="flex items-center gap-2.5">
                                    {it.image && it.image.startsWith('http') ? (
                                      <img src={it.image} alt={it.productName} className="w-8 h-8 object-cover rounded-xl shrink-0 border border-slate-100" />
                                    ) : (
                                      <span className="text-xl shrink-0 p-1 bg-slate-100 rounded-lg">{it.image || '🥗'}</span>
                                    )}
                                    <div>
                                      <span className="font-extrabold text-slate-800 block leading-tight">{it.productName}</span>
                                      <span className="text-[10px] text-slate-400 font-semibold">{it.packageName}</span>
                                    </div>
                                  </div>
                                  <span className="font-extrabold text-slate-700">
                                    {it.quantity}x <span className="text-[10px] text-slate-400 font-medium">@ Rp {it.price.toLocaleString('id-ID')}</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="border-t border-dashed border-slate-200 pt-3.5 flex justify-between items-center font-black text-[15px] text-slate-800">
                              <span>Total Pembayaran</span>
                              <span className="text-emerald-600">Rp {trackedOrder.totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          {/* Cart View */}
          {currentView === 'cart' && (
            <div className="p-4 md:p-8 space-y-8 max-w-2xl mx-auto w-full flex-1">
              <div>
                <span className="text-[10px] md:text-xs font-black text-[#00966b] uppercase tracking-wider">AIMEE SEHAT CART</span>
                <h2 className="text-xl md:text-[28px] font-black text-slate-900 tracking-tight mt-1 leading-tight flex items-center gap-2.5">
                  <ShoppingCart className="w-7 h-7 text-emerald-600" />
                  <span>Keranjang Belanja Anda</span>
                </h2>
                <p className="text-slate-400 text-xs mt-1">Selesaikan pemesanan paket makanan sehat harian Anda.</p>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 flex flex-col space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                    <span>Keranjang Belanja</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    {cartDetails.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Bersihkan</span>
                      </button>
                    )}
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-0.5 rounded-full">
                      {totalCartItems} Item
                    </span>
                  </div>
                </div>

                {cartDetails.length === 0 && !checkoutSuccessOrder ? (
                  <div className="py-14 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner select-none">
                      🛒
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-800 font-extrabold">Keranjang Sehat Kosong</p>
                      <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto font-medium leading-relaxed">
                        Masukkan kombinasi salad premium harian Anda untuk memulai checkout.
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewChange('webstore')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Belanja Sekarang</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {cartDetails.length > 0 && (
                      <>
                        {/* Cart List */}
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100">
                          {cartDetails.map(({ product, quantity, total }) => (
                            <div key={product.id} className="flex gap-3 justify-between items-center pt-3 first:pt-0 group">
                              {product.image && product.image.startsWith('http') ? (
                                <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-xl shrink-0 border border-slate-100" />
                              ) : (
                                <span className="text-2xl shrink-0 p-1.5 bg-slate-50 rounded-xl">{product.image || '🥗'}</span>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-extrabold text-slate-800 text-xs truncate leading-snug group-hover:text-emerald-700 transition-colors">{product.name}</h4>
                                <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">{product.packageName} • Rp {product.price.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 bg-slate-100/80 p-1 rounded-xl">
                                <button
                                  onClick={() => handleRemoveFromCart(product.id)}
                                  className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-slate-800 hover:shadow-sm transition-all"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-black text-slate-800 w-5 text-center">{quantity}</span>
                                <button
                                  onClick={() => handleAddToCart(product.id)}
                                  className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-slate-800 hover:shadow-sm transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="pt-4 border-t border-slate-100 space-y-2.5">
                          <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>Subtotal Menu</span>
                            <span className="text-slate-700">Rp {totalCartPrice.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>Ongkir Kurir (Flat)</span>
                            <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">GRATIS</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200 font-black text-sm text-slate-800">
                            <span>Total Pembayaran</span>
                            <span className="text-emerald-600 text-lg font-black">Rp {totalCartPrice.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {/* Checkout Form */}
                        <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Informasi Penerima</div>
                          
                          <div className="space-y-3">
                            <div className="relative">
                              <input
                                type="text"
                                required
                                placeholder="Nama Lengkap Penerima"
                                value={checkoutName}
                                onChange={(e) => setCheckoutName(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-medium"
                              />
                              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            </div>
                            
                            <div className="relative">
                              <textarea
                                required
                                rows={2}
                                placeholder="Alamat Rumah Lengkap (Nama Jalan, No, RT/RW, Kecamatan)"
                                value={checkoutAddress}
                                onChange={(e) => setCheckoutAddress(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-medium"
                              ></textarea>
                              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            </div>
                          </div>

                          {/* Beautiful Interactive Payment Selector */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pilih Metode Pembayaran</label>
                            
                            <div className="grid grid-cols-2 gap-2">
                              {/* Option: COD */}
                              <button
                                type="button"
                                onClick={() => setCheckoutPayment('COD')}
                                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  checkoutPayment === 'COD'
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50 text-slate-600'
                                }`}
                              >
                                <span className="text-lg">💵</span>
                                <span className="font-extrabold text-[10px] mt-1">Dine-in / COD</span>
                              </button>

                              {/* Option: BCA */}
                              <button
                                type="button"
                                onClick={() => setCheckoutPayment('BCA')}
                                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  checkoutPayment === 'BCA'
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50 text-slate-600'
                                }`}
                              >
                                <span className="text-xs font-black text-indigo-700">Bank BCA</span>
                                <span className="font-extrabold text-[10px] mt-1">BCA Transfer</span>
                              </button>

                              {/* Option: Mandiri */}
                              <button
                                type="button"
                                onClick={() => setCheckoutPayment('Mandiri')}
                                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  checkoutPayment === 'Mandiri'
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50 text-slate-600'
                                }`}
                              >
                                <span className="text-xs font-black text-blue-700">MANDIRI</span>
                                <span className="font-extrabold text-[10px] mt-1">Mandiri Transfer</span>
                              </button>

                              {/* Option: BNI */}
                              <button
                                type="button"
                                onClick={() => setCheckoutPayment('BNI')}
                                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  checkoutPayment === 'BNI'
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50 text-slate-600'
                                }`}
                              >
                                <span className="text-xs font-black text-orange-700">Bank BNI</span>
                                <span className="font-extrabold text-[10px] mt-1">BNI Transfer</span>
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/10 hover:shadow-xl transition-all uppercase tracking-wider block text-center cursor-pointer"
                          >
                            Kirim Pesanan Sekarang 🚀
                          </button>
                        </form>
                      </>
                    )}

                    {/* Success Order Confirmation Block */}
                    {checkoutSuccessOrder && (
                      <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 rounded-2xl space-y-4 shadow-sm animate-fadeIn">
                        <div className="flex items-center gap-2.5 text-emerald-900">
                          <div className="p-1 bg-emerald-500 text-white rounded-full">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-black text-xs">Pesanan Berhasil Dikirim!</h4>
                            <span className="text-[9px] font-bold text-emerald-600">TRANSAKSI SELESAI</span>
                          </div>
                        </div>
                        
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          Terima kasih! Pesanan gizi harian Anda telah tersimpan. Salin kode pelacakan di bawah untuk melihat kemajuan kurir Anda:
                        </p>
                        
                        <div className="bg-white p-3 rounded-xl border border-emerald-100/80 flex items-center justify-between shadow-inner">
                          <code className="text-xs font-mono font-extrabold text-emerald-800">
                            {checkoutSuccessOrder.id}
                          </code>
                          <button
                            onClick={() => triggerCopyId(checkoutSuccessOrder.id)}
                            className="p-1.5 bg-slate-100 hover:bg-emerald-100 rounded text-slate-600 transition-colors flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                          >
                            {copiedId === checkoutSuccessOrder.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersalin
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Salin PIN
                              </>
                            )}
                          </button>
                        </div>
                        
                        <button
                          onClick={() => {
                            setTrackingIdInput(checkoutSuccessOrder.id);
                            const found = orders.find((o) => o.id === checkoutSuccessOrder.id);
                            if (found) {
                              setTrackedOrder(found);
                              setTrackError(false);
                            }
                            setCurrentView('webstore');
                            setTimeout(() => {
                              const trackerElem = document.getElementById('tracking-section');
                              if (trackerElem) trackerElem.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-xl transition-colors uppercase tracking-wider cursor-pointer"
                        >
                          Lacak Progres Real-time Sekarang
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* POS Terminal Kasir View */}
          {isMerchantUnlocked && currentView === 'pos' && (
            <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full flex-1">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-emerald-600" />
                    <span>POS Terminal Kasir Offline</span>
                  </h2>
                  <p className="text-slate-400 text-xs">Menu pesanan langsung / dine-in untuk kasir. Perubahan harga & menu dari Admin langsung ter-update otomatis.</p>
                </div>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                  KASIR MODE: ACTIVE
                </span>
              </div>

              {/* Grid Layout POS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Catalog POS Selector (Col: 8) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pilih Menu Hidangan Sehat</span>
                    <span className="text-xs text-slate-400 italic">Klik item untuk menambahkan ke slip POS</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleAddToPosCart(item.id)}
                        className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-sm text-left transition-all relative group flex flex-col justify-between"
                      >
                        <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                          {item.packageName}
                        </span>
                        
                        <div className="w-full h-16 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center text-3xl my-2">
                          {item.image && item.image.startsWith('http') ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{item.image || '🥗'}</span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-slate-800 text-xs truncate group-hover:text-emerald-700">{item.name}</h4>
                          <p className="text-[11px] font-bold text-emerald-600">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* POS Receipt / Billing (Col: 4) */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col space-y-4">
                    <div className="border-b border-dashed border-slate-200 pb-3 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Slip Pesanan POS</span>
                      <span className="text-xs text-emerald-600 font-bold font-mono">DINE-IN</span>
                    </div>

                    {posCartDetails.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <span className="text-3xl block mb-2">📟</span>
                        <p className="text-xs">Pilih menu di samping untuk membuat slip kasir.</p>
                      </div>
                    ) : (
                      <>
                        {/* Selected items list */}
                        <div className="space-y-2.5 max-h-56 overflow-y-auto">
                          {posCartDetails.map(({ product, quantity, total }) => (
                            <div key={product.id} className="flex justify-between items-center text-xs p-1">
                              <div className="flex items-center gap-2">
                                {product.image && product.image.startsWith('http') ? (
                                  <img src={product.image} alt={product.name} className="w-6 h-6 object-cover rounded" />
                                ) : (
                                  <span>{product.image || '🥗'}</span>
                                )}
                                <span className="font-bold text-slate-800 truncate max-w-[120px]">{product.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleRemoveFromPosCart(product.id)} className="p-0.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200">
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="font-bold text-slate-800 text-xs">{quantity}</span>
                                <button onClick={() => handleAddToPosCart(product.id)} className="p-0.5 bg-slate-100 rounded text-slate-600 hover:bg-slate-200">
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                                <span className="font-extrabold text-slate-700 ml-2">Rp {total.toLocaleString('id-ID')}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pricing aggregation */}
                        <div className="border-t border-dashed border-slate-200 pt-3 space-y-2 text-xs">
                          <div className="flex justify-between font-medium text-slate-400">
                            <span>Subtotal POS</span>
                            <span>Rp {totalPosPrice.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between font-extrabold text-sm text-slate-800 pt-1.5 border-t border-slate-100">
                            <span>TOTAL TAGIHAN</span>
                            <span className="text-emerald-600">Rp {totalPosPrice.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {/* POS Billing Form */}
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Nama Customer (Opsional)"
                              value={posCustomerName}
                              onChange={(e) => setPosCustomerName(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800"
                            />
                            <select
                              value={posPaymentMethod}
                              onChange={(e) => setPosPaymentMethod(e.target.value as any)}
                              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800"
                            >
                              <option value="BCA">🏦 Bank BCA</option>
                              <option value="Mandiri">🏦 Bank Mandiri</option>
                              <option value="BNI">🏦 Bank BNI</option>
                              <option value="BRI">🏦 Bank BRI</option>
                              <option value="COD">💵 Tunai / Cash (COD)</option>
                            </select>
                          </div>

                          <button
                            onClick={handlePosCheckout}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wider"
                          >
                            Bayar & Cetak Invoice 🧾
                          </button>
                        </div>
                      </>
                    )}

                    {/* POS Successful order print preview representation */}
                    {posSuccessOrder && (
                      <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 border border-slate-800 font-mono text-[11px]">
                        <div className="text-center border-b border-dashed border-slate-700 pb-2">
                          <p className="font-bold text-sm tracking-widest text-emerald-400">AIMEE FOOD</p>
                          <p className="text-slate-400 text-[10px]">UMKM Point of Sale Invoice</p>
                        </div>

                        <div className="space-y-1 text-slate-300">
                          <div className="flex justify-between"><span>No. Invoice:</span><span>{posSuccessOrder.invoiceId}</span></div>
                          <div className="flex justify-between"><span>Kode Lacak:</span><span className="font-bold text-emerald-400">{posSuccessOrder.id}</span></div>
                          <div className="flex justify-between"><span>Customer:</span><span>{posSuccessOrder.customerName}</span></div>
                          <div className="flex justify-between"><span>Pembayaran:</span><span>{posSuccessOrder.paymentMethod}</span></div>
                        </div>

                        <div className="border-t border-b border-dashed border-slate-700 py-1.5 my-2 space-y-1">
                          {posSuccessOrder.items.map((it, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{it.productName} ({it.quantity}x)</span>
                              <span>Rp {(it.price * it.quantity).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between text-xs font-bold text-emerald-400">
                          <span>TOTAL LUNAS</span>
                          <span>Rp {posSuccessOrder.totalPrice.toLocaleString('id-ID')}</span>
                        </div>

                        <p className="text-center text-[9px] text-slate-500 pt-2 italic">--- Terimakasih Hidup Sehat Mulai Hari Ini ---</p>
                        
                        <button
                          onClick={() => setPosSuccessOrder(null)}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded text-[10px] mt-2 font-semibold font-sans transition-colors"
                        >
                          Tutup Slip Kasir
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Orders Management View */}
          {isMerchantUnlocked && currentView === 'orders' && (
            <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full flex-1">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <span>Manajemen Pesanan Masuk</span>
                </h2>
                <p className="text-slate-400 text-xs">Perbarui pengemasan dan proses kurir pengantaran secara real-time. Status yang Anda ubah di sini langsung tersinkronisasi ke pembeli.</p>
              </div>

              {/* Orders Table Panel */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rekapitulasi Semua Pesanan ({orders.length})</span>
                  <div className="text-xs text-slate-400 italic">Total Transaksi Selesai & Dalam Proses</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-widest text-[9px] font-extrabold">
                        <th className="p-4">Invoice / Kode Lacak</th>
                        <th className="p-4">Customer / Alamat</th>
                        <th className="p-4">Detail Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Metode Bayar</th>
                        <th className="p-4">Status Pengiriman</th>
                        <th className="p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 space-y-1">
                            <span className="font-mono text-slate-400 text-[10px] block">{ord.invoiceId}</span>
                            <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase">
                              {ord.id}
                            </span>
                            <span className={`block text-[9px] font-bold uppercase tracking-wider ${ord.type === 'POS' ? 'text-blue-500' : 'text-purple-500'}`}>
                              Via {ord.type}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            <span className="font-extrabold text-slate-800 block">{ord.customerName}</span>
                            <span className="text-slate-500 text-[11px] block max-w-xs truncate" title={ord.address}>
                              {ord.address}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="space-y-1">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                                  {it.image && it.image.startsWith('http') ? (
                                    <img src={it.image} alt={it.productName} className="w-5 h-5 object-cover rounded shrink-0" />
                                  ) : (
                                    <span className="shrink-0">{it.image || '🥗'}</span>
                                  )}
                                  <span className="font-medium">{it.productName} ({it.quantity}x)</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 font-extrabold text-emerald-600">
                            Rp {ord.totalPrice.toLocaleString('id-ID')}
                          </td>
                          <td className="p-4 font-bold text-slate-600">
                            {ord.paymentMethod} {ord.paymentMethod !== 'COD' && 'Transfer'}
                          </td>
                          <td className="p-4">
                            <div className="space-y-1.5">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                ord.status === 'Sedang dikemas' ? 'bg-amber-100 text-amber-700' :
                                ord.status === 'Pesanan sedang diantar' ? 'bg-blue-100 text-blue-700' :
                                'bg-emerald-100 text-emerald-700'
                              }`}>
                                {ord.status === 'Sedang dikemas' && <Clock className="w-3 h-3" />}
                                {ord.status === 'Pesanan sedang diantar' && <Truck className="w-3 h-3" />}
                                {ord.status === 'Pesanan tiba di alamat tujuan' && <CheckCircle2 className="w-3 h-3" />}
                                {ord.status}
                              </span>

                              {/* Dropdown status update for Admin */}
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                                className="block w-full py-1 px-2 text-[10px] bg-slate-50 border border-slate-200 rounded font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                              >
                                <option value="Sedang dikemas">📦 Sedang dikemas</option>
                                <option value="Pesanan sedang diantar">🛵 Sedang diantar</option>
                                <option value="Pesanan tiba di alamat tujuan">🏁 Tiba di tujuan</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {/* Print representation toggle */}
                              <button
                                onClick={() => {
                                  // Look up this specific order in Lacak view
                                  setTrackedOrder(ord);
                                  setTrackingIdInput(ord.id);
                                  handleViewChange('webstore');
                                  setTimeout(() => {
                                    const trackerElem = document.getElementById('tracking-section');
                                    if (trackerElem) trackerElem.scrollIntoView({ behavior: 'smooth' });
                                  }, 300);
                                }}
                                className="p-1.5 hover:bg-slate-100 rounded border border-slate-200 text-slate-600 transition-colors flex items-center gap-1 font-semibold"
                                title="Lihat Invoice Pembeli"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(ord.id)}
                                className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded border border-slate-200 text-slate-400 transition-colors"
                                title="Hapus Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Finance Report View */}
          {isMerchantUnlocked && currentView === 'finance' && (
            <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full flex-1">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Laporan Keuangan & Grafik Laba</span>
                </h2>
                <p className="text-slate-400 text-xs">Pantau performa penjualan, margin laba bersih 45% (standar sehat), dan rekapitulasi performa mingguan.</p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 1: Total Pendapatan */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Omset</span>
                    <h3 className="text-xl font-black text-slate-800">Rp {financeAnalytics.totalSales.toLocaleString('id-ID')}</h3>
                    <span className="text-[10px] text-emerald-600 font-bold block">100% Bruto</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 2: Laba Bersih */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Estimasi Laba Bersih</span>
                    <h3 className="text-xl font-black text-emerald-600">Rp {financeAnalytics.totalProfit.toLocaleString('id-ID')}</h3>
                    <span className="text-[10px] text-emerald-500 font-bold block">Margin Sehat 45%</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 3: Total Transaksi */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Transaksi</span>
                    <h3 className="text-xl font-black text-slate-800">{financeAnalytics.ordersCount} Pesanan</h3>
                    <span className="text-[10px] text-indigo-500 font-bold block">Lunas & Terkoneksi</span>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 4: Average Order Value */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Rata-rata Belanja</span>
                    <h3 className="text-xl font-black text-slate-800">
                      Rp {financeAnalytics.ordersCount > 0 ? Math.round(financeAnalytics.totalSales / financeAnalytics.ordersCount).toLocaleString('id-ID') : 0}
                    </h3>
                    <span className="text-[10px] text-slate-400 block">Per Invoice Transaksi</span>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
                    <Building className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Charts & Graphs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* SVG Profit Chart (Col: 8) */}
                <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Tren Perkembangan Laba Penjualan Bulanan</h4>
                      <span className="text-[10px] text-slate-400 italic font-medium">Bulan Berjalan (Periode Juli 2026)</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      Grafik di bawah menggambarkan pembagian omset bruto mingguan (warna hijau muda) dan kontribusi profit bersih mingguan (warna hijau tua).
                    </p>
                  </div>

                  {/* Custom High-Fidelity SVG Interactive Chart */}
                  <div className="flex-1 w-full min-h-[220px] relative mt-2">
                    <svg viewBox="0 0 500 220" className="w-full h-full" style={{ overflow: 'visible' }}>
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="180" x2="480" y2="180" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* X-Axis Labels */}
                      <text x="95" y="200" textAnchor="middle" className="text-[10px] font-bold fill-slate-500">Minggu 1</text>
                      <text x="195" y="200" textAnchor="middle" className="text-[10px] font-bold fill-slate-500">Minggu 2</text>
                      <text x="295" y="200" textAnchor="middle" className="text-[10px] font-bold fill-slate-500">Minggu 3</text>
                      <text x="395" y="200" textAnchor="middle" className="text-[10px] font-bold fill-slate-500">Minggu 4</text>

                      {/* Y-Axis scale references (max is 500.000 for representation scaling) */}
                      <text x="32" y="183" textAnchor="end" className="text-[8px] font-mono fill-slate-400">Rp 0</text>
                      <text x="32" y="143" textAnchor="end" className="text-[8px] font-mono fill-slate-400">125k</text>
                      <text x="32" y="103" textAnchor="end" className="text-[8px] font-mono fill-slate-400">250k</text>
                      <text x="32" y="63" textAnchor="end" className="text-[8px] font-mono fill-slate-400">375k</text>
                      <text x="32" y="23" textAnchor="end" className="text-[8px] font-mono fill-slate-400">500k+</text>

                      {/* Mingguan data drawing */}
                      {financeAnalytics.weeklySales.map((sales, idx) => {
                        // Max representation height is 160px (from y=20 to y=180)
                        const maxVal = Math.max(...financeAnalytics.weeklySales, 200000);
                        const scaleHeight = (sales / maxVal) * 140;
                        const profitHeight = (financeAnalytics.weeklyProfit[idx] / maxVal) * 140;
                        const xOffset = 75 + idx * 100;

                        return (
                          <g key={idx} className="group cursor-pointer">
                            {/* Bruto / Sales bar */}
                            <rect
                              x={xOffset}
                              y={180 - scaleHeight}
                              width="20"
                              height={scaleHeight}
                              fill="#10b981"
                              opacity="0.3"
                              rx="3"
                              className="transition-all duration-300 hover:opacity-40"
                            />
                            {/* Neto / Profit bar */}
                            <rect
                              x={xOffset + 4}
                              y={180 - profitHeight}
                              width="12"
                              height={profitHeight}
                              fill="#047857"
                              rx="2"
                              className="transition-all duration-300 hover:fill-emerald-800"
                            />
                            {/* Hover info text */}
                            <text
                              x={xOffset + 10}
                              y={180 - scaleHeight - 12}
                              textAnchor="middle"
                              className="text-[8px] font-bold fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              S: {sales / 1000}k
                            </text>
                            <text
                              x={xOffset + 10}
                              y={180 - scaleHeight - 4}
                              textAnchor="middle"
                              className="text-[8px] font-black fill-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              P: {financeAnalytics.weeklyProfit[idx] / 1000}k
                            </text>
                          </g>
                        );
                      })}

                      {/* Smooth cumulative profit line chart overlay */}
                      <path
                        d={`M 95,${180 - (financeAnalytics.weeklyProfit[0] / Math.max(...financeAnalytics.weeklySales, 200000)) * 140} 
                           L 195,${180 - (financeAnalytics.weeklyProfit[1] / Math.max(...financeAnalytics.weeklySales, 200000)) * 140} 
                           L 295,${180 - (financeAnalytics.weeklyProfit[2] / Math.max(...financeAnalytics.weeklySales, 200000)) * 140} 
                           L 395,${180 - (financeAnalytics.weeklyProfit[3] / Math.max(...financeAnalytics.weeklySales, 200000)) * 140}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {financeAnalytics.weeklyProfit.map((profit, idx) => {
                        const maxVal = Math.max(...financeAnalytics.weeklySales, 200000);
                        const cy = 180 - (profit / maxVal) * 140;
                        const cx = 95 + idx * 100;
                        return (
                          <circle
                            key={idx}
                            cx={cx}
                            cy={cy}
                            r="5"
                            fill="#f59e0b"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  {/* Chart Legend */}
                  <div className="flex justify-center items-center gap-6 text-xs pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded"></div>
                      <span className="text-slate-500">Omset Bruto Mingguan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 bg-emerald-700 rounded"></div>
                      <span className="text-slate-500 font-medium">Laba Bersih Mingguan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-amber-500 relative flex items-center justify-center"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div></div>
                      <span className="text-amber-600 font-bold">Tren Pertumbuhan</span>
                    </div>
                  </div>
                </div>

                {/* Profit Loss Summary Side-panel (Col: 4) */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Rekapitulasi Paket Terlaris</h4>
                    
                    <div className="space-y-3 pt-2">
                      {Object.entries(financeAnalytics.packageStats).map(([pkg, count]) => {
                        const c = count as number;
                        const totalOrdersOfThisPkg = (Object.values(financeAnalytics.packageStats) as number[]).reduce((a: number, b: number) => a + b, 0) || 1;
                        const percentage = Math.round((c / totalOrdersOfThisPkg) * 100);

                        return (
                          <div key={pkg} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-bold text-slate-700">{pkg}</span>
                              <span className="text-slate-400 font-medium">{c} Porsi ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pkg === 'Paket 1' ? 'bg-indigo-500' :
                                  pkg === 'Paket 2' ? 'bg-amber-500' :
                                  pkg === 'Paket 3' ? 'bg-emerald-500' :
                                  'bg-slate-400'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-6 space-y-3 text-xs">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Struktur Biaya Pokok Penjualan (HPP)</span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Biaya Bahan Baku (55%)</span>
                      <span className="font-bold text-slate-700">Rp {Math.round(financeAnalytics.totalSales * 0.55).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dukungan Delivery/Kemasan</span>
                      <span className="font-bold text-emerald-600">FREE UMKM</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-slate-800">
                      <span>Total Bersih</span>
                      <span className="text-emerald-700">Rp {financeAnalytics.totalProfit.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Admin Menu Editor CRUD View */}
          {isMerchantUnlocked && currentView === 'admin' && (
            <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full flex-1">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <span>Daftar Atur Menu & Harga</span>
                </h2>
                <p className="text-slate-400 text-xs">Tambah, ubah, atau hapus menu hidangan salad dan kukusan Aimee food. Setiap perubahan harga atau menu akan disinkronisasikan ke Webstore secara instan.</p>
              </div>

              {/* Grid: Editor Form and List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Form Editor Block (Col: 5) */}
                <div id="menu-editor-form" className="lg:col-span-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-800">
                      <PlusCircle className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-extrabold text-sm uppercase">
                        {editingItem ? 'Edit Hidangan Sehat' : 'Tambah Menu Baru'}
                      </h3>
                    </div>

                    <form onSubmit={handleAddOrEditMenuItem} className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Produk Sehat</label>
                        <input
                          type="text"
                          required
                          placeholder="cth: Salad Bayam Edamame Premium"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block">Kategori Menu</label>
                          <select
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value as any)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800"
                          >
                            <option value="salad">🥗 Salad Organik</option>
                            <option value="steamed">🥟 Kukusan Gurih</option>
                            <option value="package">🍱 Paket Lengkap</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block">Daftar Paket</label>
                          <select
                            value={newItemPackage}
                            onChange={(e) => setNewItemPackage(e.target.value as any)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800"
                          >
                            <option value="Paket 1">Paket 1: Green Fresh</option>
                            <option value="Paket 2">Paket 2: Protein Mix</option>
                            <option value="Paket 3">Paket 3: Premium Fit</option>
                            <option value="Ala Carte">Ala Carte (Piring Tunggal)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block">Harga Jual (Rupiah)</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="cth: 38000"
                            value={newItemPrice || ''}
                            onChange={(e) => setNewItemPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800 font-bold text-emerald-600"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block">Pilih Gambar Preset</label>
                          <select
                            value={newItemImage && newItemImage.startsWith('http') ? newItemImage : 'custom'}
                            onChange={(e) => {
                              if (e.target.value !== 'custom') {
                                setNewItemImage(e.target.value);
                              }
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800"
                          >
                            <option value="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80">🥗 Salad Sayur Segar (Preset)</option>
                            <option value="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80">🥙 Protein Mix Steamed (Preset)</option>
                            <option value="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80">🍣 Premium Fit Salmon (Preset)</option>
                            <option value="https://images.unsplash.com/photo-1496116211225-724a158ec0b1?auto=format&fit=crop&w=600&q=80">🥟 Dimsum Ayam Wortel (Preset)</option>
                            <option value="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80">🥦 Brokoli Wortel Kukus (Preset)</option>
                            <option value="https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=600&q=80">🍠 Ubi Ungu Jagung (Preset)</option>
                            <option value="custom">✏️ Masukkan URL Custom / Emoji</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">URL Gambar Real atau Emoji</label>
                        <input
                          type="text"
                          required
                          placeholder="Masukkan URL Gambar (https://...) atau Emoji tunggal"
                          value={newItemImage}
                          onChange={(e) => setNewItemImage(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Komposisi & Deskripsi Menu</label>
                        <textarea
                          rows={3}
                          placeholder="Masukkan rincian bahan sehat yang dipakai..."
                          value={newItemDescription}
                          onChange={(e) => setNewItemDescription(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-800"
                        ></textarea>
                      </div>

                      <div className="pt-2 flex gap-2">
                        {editingItem && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(null);
                              setNewItemName('');
                              setNewItemDescription('');
                              setNewItemPrice(0);
                            }}
                            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all"
                          >
                            Batal Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all uppercase tracking-wider"
                        >
                          {editingItem ? 'Simpan Perubahan' : 'Masukkan ke Menu'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List Menu Block (Col: 7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daftar Menu Aktif di Database ({menuItems.length})</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Sinkron Terkunci</span>
                  </div>

                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-all flex justify-between items-center gap-4"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && item.image.startsWith('http') ? (
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                          ) : (
                            <span className="text-3xl p-1.5 bg-slate-50 rounded-xl shrink-0">{item.image || '🥗'}</span>
                          )}
                          <div>
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider">
                              {item.packageName}
                            </span>
                            <h4 className="font-extrabold text-slate-800 text-xs mt-1">{item.name}</h4>
                            <p className="text-slate-400 text-[11px] line-clamp-1">{item.description}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest">Harga</span>
                            <span className="font-extrabold text-emerald-600 text-xs">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 rounded transition-colors"
                              title="Edit Item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title="Hapus Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
