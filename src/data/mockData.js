// Comprehensive mock data for BackToOwner Admin Dashboard

export const initialStats = {
  itemsReturned: 12483,
  itemsReturnedTrend: '+14.8%',
  activeCases: 3291,
  activeCasesTrend: '-2.4%',
  successRate: 78.4,
  successRateTrend: '+4.2%',
  pendingMatches: 412,
  pendingMatchesTrend: '+28 new today',
  totalRewardsPaid: '$148,950',
  avgResolutionTime: '14.2 hrs',
  registeredUsers: 48920,
  activeFinders: 6310
};

export const categoriesList = [
  { id: 'all', label: 'All Categories', icon: 'Layers' },
  { id: 'electronics', label: 'Electronics & Phones', icon: 'Smartphone', color: '#0284C7' },
  { id: 'wallets', label: 'Wallets & IDs', icon: 'Wallet', color: '#8B5CF6' },
  { id: 'pets', label: 'Lost Pets', icon: 'Dog', color: '#F59E0B' },
  { id: 'keys', label: 'Keys & Keyfobs', icon: 'Key', color: '#10B981' },
  { id: 'bags', label: 'Bags & Luggage', icon: 'Briefcase', color: '#EC4899' },
  { id: 'documents', label: 'Passports & Cards', icon: 'FileText', color: '#6366F1' },
  { id: 'jewelry', label: 'Jewelry & Watches', icon: 'Watch', color: '#F43F5E' },
  { id: 'clothing', label: 'Apparel & Wearables', icon: 'Shirt', color: '#14B8A6' }
];

export const initialReports = [
  {
    id: 'REP-10492',
    title: 'Black Leather Wallet',
    type: 'lost',
    category: 'wallets',
    status: 'open',
    location: 'Central Park, NY (near Bethesda Terrace)',
    coordinates: { lat: 40.7812, lng: -73.9665 },
    distanceKm: 0.4,
    timeAgo: '2h ago',
    date: '2026-08-22 14:30',
    reward: 50,
    matched: false,
    matchedWithId: null,
    reporter: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      phone: '+1 (555) 234-8901',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      trustScore: 98,
      verified: true
    },
    finder: null,
    description: 'Black bifold leather wallet by Coach. Contains NY Driver\'s License (S. Jenkins), 2 credit cards, and a metro card. Has small scratch on the front corner.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      brand: 'Coach',
      color: 'Black',
      uniqueMarks: 'Small scuff on bottom right seam',
      hasIdInside: true
    }
  },
  {
    id: 'REP-10491',
    title: 'iPhone 15 Pro',
    type: 'found',
    category: 'electronics',
    status: 'matched',
    location: 'Times Square Station (N/Q/R Platform)',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    distanceKm: 0.8,
    timeAgo: '4h ago',
    date: '2026-08-22 12:15',
    reward: null,
    matched: true,
    matchedWithId: 'REP-10480',
    matchScore: 96,
    reporter: null,
    finder: {
      name: 'David Ross',
      email: 'david.ross@mta.info',
      phone: '+1 (555) 876-5432',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Transit Staff / Verified Finder',
      trustScore: 100,
      verified: true
    },
    description: 'Natural Titanium iPhone 15 Pro found on the uptown bench. In a clear MagSafe case with a sticker of a mountain range on the back.',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      brand: 'Apple',
      model: 'iPhone 15 Pro 256GB',
      color: 'Natural Titanium',
      imeiEnding: '...8942',
      lockscreenClue: 'Photo of golden retriever dog'
    }
  },
  {
    id: 'REP-10490',
    title: 'Golden Retriever (Charlie)',
    type: 'lost',
    category: 'pets',
    status: 'in_review',
    location: 'Brooklyn Bridge Park (Pier 2)',
    coordinates: { lat: 40.7028, lng: -73.9969 },
    distanceKm: 2.1,
    timeAgo: '1d ago',
    date: '2026-08-21 16:45',
    reward: 200,
    matched: false,
    matchedWithId: null,
    reporter: {
      name: 'Emily Watson',
      email: 'emily.watson@gmail.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      trustScore: 95,
      verified: true
    },
    finder: null,
    description: 'Friendly 3-year-old male Golden Retriever wearing a blue reflective harness with a bone-shaped tag "Charlie". Slipped leash near the playground.',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      breed: 'Golden Retriever',
      microchipNumber: '985141002934812',
      temperament: 'Very friendly, responds to whistle',
      collar: 'Blue Reflective Ruffwear'
    }
  },
  {
    id: 'REP-10489',
    title: 'Car Keys (Toyota)',
    type: 'found',
    category: 'keys',
    status: 'open',
    location: 'Whole Foods Market (Union Square)',
    coordinates: { lat: 40.7359, lng: -73.9911 },
    distanceKm: 0.9,
    timeAgo: '3h ago',
    date: '2026-08-22 13:00',
    reward: null,
    matched: false,
    matchedWithId: null,
    reporter: null,
    finder: {
      name: 'Alex Rivera',
      email: 'alex.r@outlook.com',
      phone: '+1 (555) 901-2345',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      trustScore: 92,
      verified: true
    },
    description: 'Toyota smart key fob attached to a blue woven paracord lanyard with a red gym locker token #214. Turned in to customer service desk.',
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      brand: 'Toyota',
      fobType: 'Push-to-Start 4-button',
      lanyard: 'Blue braided paracord',
      lockerToken: 'Red #214'
    }
  },
  {
    id: 'REP-10488',
    title: 'Blue Backpack (North Face)',
    type: 'lost',
    category: 'bags',
    status: 'open',
    location: 'Grand Central Station (Main Concourse)',
    coordinates: { lat: 40.7527, lng: -73.9772 },
    distanceKm: 0.6,
    timeAgo: '6h ago',
    date: '2026-08-22 10:20',
    reward: 30,
    matched: false,
    matchedWithId: null,
    reporter: {
      name: 'Marcus Brody',
      email: 'm.brody@columbia.edu',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      trustScore: 88,
      verified: true
    },
    description: 'Navy blue The North Face Recon backpack left on a bench near track 24. Contains college textbooks, spiral notebooks, and insulated water bottle.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      brand: 'The North Face',
      model: 'Recon 30L',
      color: 'Navy / Heather Grey',
      contents: 'Physics textbook, Hydro Flask with stickers'
    }
  },
  {
    id: 'REP-10487',
    title: 'AirPods Pro (2nd Gen)',
    type: 'found',
    category: 'electronics',
    status: 'matched',
    location: 'JFK Terminal 4 (Gate B28)',
    coordinates: { lat: 40.6413, lng: -73.7781 },
    distanceKm: 14.2,
    timeAgo: '5h ago',
    date: '2026-08-22 11:30',
    reward: null,
    matched: true,
    matchedWithId: 'REP-10475',
    matchScore: 92,
    finder: {
      name: 'Elena Rostova',
      email: 'elena.rostova@delta.com',
      phone: '+1 (555) 678-9012',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'Airline Crew',
      trustScore: 99,
      verified: true
    },
    description: 'Apple AirPods Pro in white charging case with custom engraving "D.K." and black leather protective sleeve.',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      brand: 'Apple',
      serialNumber: 'H7G...409L',
      engraving: 'D.K.',
      caseColor: 'Black leather sleeve'
    }
  },
  {
    id: 'REP-10486',
    title: 'MacBook Pro 16" (Space Black)',
    type: 'lost',
    category: 'electronics',
    status: 'in_review',
    location: 'Starbucks (Wall Street Financial)',
    coordinates: { lat: 40.7069, lng: -74.0090 },
    distanceKm: 3.5,
    timeAgo: '12h ago',
    date: '2026-08-22 04:15',
    reward: 300,
    matched: false,
    matchedWithId: null,
    reporter: {
      name: 'Daniel Craig',
      email: 'daniel.c@venturecap.com',
      phone: '+1 (555) 789-0123',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      trustScore: 96,
      verified: true
    },
    description: '16-inch M3 Max MacBook Pro in Space Black. Has GitHub octocat sticker on bottom left lid and matte screen protector. Left in leather sleeve.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      brand: 'Apple',
      model: 'MacBook Pro 16" M3 Max',
      serialNumber: 'C02...89Y1',
      stickers: 'Octocat + Rust Lang logo'
    }
  },
  {
    id: 'REP-10485',
    title: 'Rolex Submariner Date Watch',
    type: 'found',
    category: 'jewelry',
    status: 'in_review',
    location: 'Hudson Yards Hotel (Lobby Lounge)',
    coordinates: { lat: 40.7538, lng: -74.0017 },
    distanceKm: 1.1,
    timeAgo: '1d ago',
    date: '2026-08-21 20:10',
    reward: null,
    matched: false,
    matchedWithId: null,
    finder: {
      name: 'Hudson Yards Security',
      email: 'security@hyhotel.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      role: 'Hotel Security Dispatch',
      trustScore: 100,
      verified: true
    },
    description: 'Stainless steel Rolex Submariner with black ceramic bezel. Found near the fireplace seating area. Stored in hotel safe.',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      brand: 'Rolex',
      reference: '126610LN',
      serialNumber: 'Confidential (Proof of purchase / warranty card required)'
    }
  },
  {
    id: 'REP-10484',
    title: 'Passport & International Driver Permit',
    type: 'lost',
    category: 'documents',
    status: 'open',
    location: 'Penn Station (Moynihan Train Hall)',
    coordinates: { lat: 40.7505, lng: -73.9935 },
    distanceKm: 0.7,
    timeAgo: '1d ago',
    date: '2026-08-21 15:30',
    reward: 100,
    matched: false,
    matchedWithId: null,
    reporter: {
      name: 'Lucas Morel',
      email: 'lucas.morel@paris.fr',
      phone: '+33 6 12 34 56 78',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      trustScore: 94,
      verified: true
    },
    description: 'French Passport in burgundy leather cover with gold emblem. Also contains an IDP and boarding passes for Amtrak to Washington DC.',
    images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      country: 'France',
      holderName: 'Lucas Morel',
      coverType: 'Burgundy embossed leather'
    }
  },
  {
    id: 'REP-10483',
    title: 'Cat (Siamese, "Luna")',
    type: 'found',
    category: 'pets',
    status: 'returned',
    location: 'Prospect Park (Boathouse Area)',
    coordinates: { lat: 40.6602, lng: -73.9690 },
    distanceKm: 5.8,
    timeAgo: '2d ago',
    date: '2026-08-20 18:20',
    reward: null,
    matched: true,
    matchedWithId: 'REP-10460',
    finder: {
      name: 'Brooklyn Animal Rescue',
      email: 'contact@bkrescue.org',
      phone: '+1 (555) 890-1234',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Rescue Partner',
      trustScore: 100,
      verified: true
    },
    description: 'Young female Siamese cat with bright blue eyes and chocolate points. Healthy, wearing a pink breakaway collar with a bell.',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80'
    ],
    verificationDetails: {
      breed: 'Siamese',
      eyes: 'Vivid Blue',
      microchipStatus: 'Scanned & Reunited with owner Mrs. Linda Vance'
    }
  }
];

export const aiMatchPairs = [
  {
    id: 'MATCH-904',
    lostItem: {
      id: 'REP-10480',
      title: 'iPhone 15 Pro (Lost in Taxi near 42nd St)',
      category: 'electronics',
      date: '2026-08-22 11:45',
      reporter: 'Ahmed Khalid',
      location: '42nd St & Broadway',
      reward: 100,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80'
    },
    foundItem: {
      id: 'REP-10491',
      title: 'iPhone 15 Pro (Found at Times Sq Subway)',
      category: 'electronics',
      date: '2026-08-22 12:15',
      finder: 'David Ross (MTA Staff)',
      location: 'Times Square Station (N/Q/R Platform)',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80'
    },
    matchScore: 96,
    confidenceLabel: 'Very High Confidence',
    matchFactors: [
      { name: 'Model & Specs', match: true, detail: 'Both iPhone 15 Pro 256GB Titanium' },
      { name: 'Proximity', match: true, detail: '0.2 km apart (within 30 mins time window)' },
      { name: 'Visual Case & Sticker', match: true, detail: 'Clear case with mountain sticker on back' },
      { name: 'Lockscreen Wallpaper', match: true, detail: 'Golden retriever photo match verified by OCR' }
    ],
    status: 'pending_admin_approval'
  },
  {
    id: 'MATCH-903',
    lostItem: {
      id: 'REP-10475',
      title: 'AirPods Pro 2nd Gen (Left at Airport)',
      category: 'electronics',
      date: '2026-08-22 10:00',
      reporter: 'Daniel Kim',
      location: 'JFK Terminal 4 Check-in',
      reward: 40,
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&auto=format&fit=crop&q=80'
    },
    foundItem: {
      id: 'REP-10487',
      title: 'AirPods Pro 2nd Gen (Turned in at Gate B28)',
      category: 'electronics',
      date: '2026-08-22 11:30',
      finder: 'Elena Rostova (Delta Flight Attendant)',
      location: 'JFK Terminal 4 Gate B28',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&auto=format&fit=crop&q=80'
    },
    matchScore: 92,
    confidenceLabel: 'High Confidence',
    matchFactors: [
      { name: 'Serial / Bluetooth Signature', match: true, detail: 'Apple FindMy broadcast matches owner hash' },
      { name: 'Engraving Match', match: true, detail: 'Case has initials "D.K."' },
      { name: 'Location Proximity', match: true, detail: 'Same Terminal building at JFK' }
    ],
    status: 'pending_admin_approval'
  },
  {
    id: 'MATCH-902',
    lostItem: {
      id: 'REP-10440',
      title: 'Coach Leather Wallet (Lost during jogging)',
      category: 'wallets',
      date: '2026-08-22 13:30',
      reporter: 'Sarah Jenkins',
      location: 'Central Park Reservoir',
      reward: 50,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80'
    },
    foundItem: {
      id: 'REP-10492',
      title: 'Black Leather Wallet (Turned in to Park Ranger)',
      category: 'wallets',
      date: '2026-08-22 14:30',
      finder: 'Park Ranger Station #4',
      location: 'Central Park (Bethesda Terrace)',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80'
    },
    matchScore: 89,
    confidenceLabel: 'High Confidence',
    matchFactors: [
      { name: 'Brand & Color', match: true, detail: 'Coach Black Bifold' },
      { name: 'ID Card Name', match: true, detail: 'Driver License name matches reporter Sarah Jenkins' },
      { name: 'Location Proximity', match: true, detail: '0.4 km apart in Central Park' }
    ],
    status: 'pending_admin_approval'
  }
];

export const weeklyRecoveryTrends = [
  { day: 'Mon', lost: 42, found: 38, returned: 34 },
  { day: 'Tue', lost: 58, found: 49, returned: 45 },
  { day: 'Wed', lost: 65, found: 62, returned: 58 },
  { day: 'Thu', lost: 51, found: 48, returned: 44 },
  { day: 'Fri', lost: 89, found: 76, returned: 71 },
  { day: 'Sat', lost: 112, found: 98, returned: 92 },
  { day: 'Sun', lost: 94, found: 85, returned: 80 }
];

export const categoryBreakdown = [
  { category: 'Electronics', count: 4820, percentage: 38.6, color: '#0284C7' },
  { category: 'Wallets & IDs', count: 2940, percentage: 23.5, color: '#8B5CF6' },
  { category: 'Keys & Fobs', count: 1810, percentage: 14.5, color: '#10B981' },
  { category: 'Lost Pets', count: 1250, percentage: 10.0, color: '#F59E0B' },
  { category: 'Bags & Luggage', count: 980, percentage: 7.8, color: '#EC4899' },
  { category: 'Documents & Others', count: 683, percentage: 5.6, color: '#6366F1' }
];

export const mockUsers = [
  {
    id: 'USR-8901',
    name: 'Ahmed Khalid',
    email: 'ahmed.khalid@backtoowner.com',
    role: 'Super Administrator',
    phone: '+1 (555) 100-2000',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    itemsReported: 4,
    itemsFound: 8,
    trustScore: 100,
    status: 'active',
    joined: 'Jan 2024'
  },
  {
    id: 'USR-8902',
    name: 'Sarah Jenkins',
    email: 'sarah.j@gmail.com',
    role: 'Verified Citizen',
    phone: '+1 (555) 234-8901',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    itemsReported: 3,
    itemsFound: 2,
    trustScore: 98,
    status: 'active',
    joined: 'Mar 2024'
  },
  {
    id: 'USR-8903',
    name: 'David Ross',
    email: 'david.ross@mta.info',
    role: 'Transit Authority Officer',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    itemsReported: 0,
    itemsFound: 142,
    trustScore: 100,
    status: 'active',
    joined: 'Feb 2024'
  },
  {
    id: 'USR-8904',
    name: 'Emily Watson',
    email: 'emily.watson@gmail.com',
    role: 'Community Member',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    itemsReported: 2,
    itemsFound: 5,
    trustScore: 95,
    status: 'active',
    joined: 'May 2024'
  },
  {
    id: 'USR-8905',
    name: 'Alex Rivera',
    email: 'alex.r@outlook.com',
    role: 'Verified Finder',
    phone: '+1 (555) 901-2345',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    itemsReported: 1,
    itemsFound: 19,
    trustScore: 92,
    status: 'active',
    joined: 'Jul 2024'
  }
];

export const notificationsList = [
  {
    id: 'NOTIF-1',
    title: 'AI High Confidence Match',
    message: '96% match found between lost iPhone 15 Pro and MTA turned-in device.',
    time: '5m ago',
    read: false,
    type: 'match'
  },
  {
    id: 'NOTIF-2',
    title: 'New High Reward Lost Case',
    message: 'Daniel Craig posted $300 reward for MacBook Pro 16" in Wall Street.',
    time: '25m ago',
    read: false,
    type: 'reward'
  },
  {
    id: 'NOTIF-3',
    title: 'Handover Completed',
    message: 'Siamese Cat "Luna" successfully returned to owner. Case closed.',
    time: '1h ago',
    read: true,
    type: 'success'
  },
  {
    id: 'NOTIF-4',
    title: 'Radar Geo-Alert Triggered',
    message: '3 items reported lost within 1km of Central Park South.',
    time: '2h ago',
    read: true,
    type: 'location'
  }
];
