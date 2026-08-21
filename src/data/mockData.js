export const initialBusiness = {
  name: "Spice Junction",
  logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=120", // Mock logo URL
  contactNumber: "+91 98765 43210",
  email: "info@spicejunction.com",
  address: "123 Food Street, Near City Center",
  city: "Manipal",
  state: "Karnataka",
  country: "India",
  timeZone: "GMT+5:30",
  status: "Active"
};

export const initialBranches = [
  {
    id: "br-1",
    name: "Spice Junction Udupi",
    code: "SJ-UD-01",
    address: "45 Temple Road",
    city: "Udupi",
    state: "Karnataka",
    country: "India",
    contactNumber: "+91 98765 43211",
    email: "udupi@spicejunction.com",
    status: "Active"
  },
  {
    id: "br-2",
    name: "Spice Junction Mangalore",
    code: "SJ-ML-01",
    address: "88 Ocean Drive",
    city: "Mangalore",
    state: "Karnataka",
    country: "India",
    contactNumber: "+91 98765 43212",
    email: "mangalore@spicejunction.com",
    status: "Active"
  },
  {
    id: "br-3",
    name: "Spice Junction Manipal",
    code: "SJ-MN-01",
    address: "12 Campus Avenue",
    city: "Manipal",
    state: "Karnataka",
    country: "India",
    contactNumber: "+91 98765 43213",
    email: "manipal@spicejunction.com",
    status: "Active"
  }
];

export const timeZones = [
  "GMT+5:30",
  "GMT+0:00",
  "GMT+1:00",
  "GMT-5:00",
  "GMT-8:00"
];

export const initialBanners = [
  {
    id: "bn-1",
    name: "Weekday Lunch Combo",
    mediaUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300",
    mediaType: "Image",
    duration: 10,
    status: "Active",
    createdAt: "2026-08-15T10:00:00Z",
    updatedAt: "2026-08-15T10:00:00Z"
  },
  {
    id: "bn-2",
    name: "Diwali Special Offer",
    mediaUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=300",
    mediaType: "Image",
    duration: 15,
    status: "Active",
    createdAt: "2026-08-16T12:00:00Z",
    updatedAt: "2026-08-18T14:30:00Z"
  },
  {
    id: "bn-3",
    name: "Weekend Family Feast Promo",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Mock video URL
    mediaType: "Video",
    duration: 10, // Video duration is auto-calculated or matches video length
    status: "Active",
    createdAt: "2026-08-17T09:00:00Z",
    updatedAt: "2026-08-17T09:00:00Z"
  },
  {
    id: "bn-4",
    name: "New Branch Launch Promo",
    mediaUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=300",
    mediaType: "Image",
    duration: 12,
    status: "Inactive",
    createdAt: "2026-08-18T08:00:00Z",
    updatedAt: "2026-08-18T08:00:00Z"
  }
];

export const initialDefaultContent = {
  id: "df-1",
  name: "Spice Junction Welcome Loop",
  mediaUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600",
  mediaType: "Image",
  duration: 8,
  status: "Active",
  updatedAt: "2026-08-19T10:00:00Z"
};

export const initialPlaylists = [
  {
    id: "pl-1",
    name: "Main Entrance Playlist",
    description: "Primary promotional screens displayed at the lobby and entrance TVs.",
    status: "Active",
    createdAt: "2026-08-19T09:00:00Z",
    updatedAt: "2026-08-19T11:00:00Z",
    banners: [
      {
        bannerId: "bn-1",
        displayOrder: 1,
        scheduleType: "Continuous",
        startDate: "2026-08-01",
        startTime: "00:00",
        endDate: "",
        endTime: ""
      },
      {
        bannerId: "bn-2",
        displayOrder: 2,
        scheduleType: "Scheduled",
        startDate: "2026-11-01",
        startTime: "00:00",
        endDate: "2026-11-15",
        endTime: "23:59"
      },
      {
        bannerId: "bn-4",
        displayOrder: 3,
        scheduleType: "Continuous",
        startDate: "2026-08-18",
        startTime: "08:00",
        endDate: "",
        endTime: ""
      }
    ]
  }
];

export const initialTVs = [
  {
    id: "tv-1",
    name: "Lobby Entrance Display",
    tvId: "TV-UDUPI-01",
    branchId: "br-1", // Udupi
    groupId: "gp-1",  // Entrance TVs Group
    playlistId: "pl-1",
    status: "Active",
    connectionStatus: "Online",
    lastSeen: "2026-08-20T11:42:00Z",
    createdAt: "2026-08-19T08:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z"
  },
  {
    id: "tv-2",
    name: "Mangalore Counter TV",
    tvId: "TV-MANGALORE-01",
    branchId: "br-2", // Mangalore
    groupId: "gp-1",  // Entrance TVs Group
    playlistId: "", // unassigned, inherits group playlist
    status: "Active",
    connectionStatus: "Online",
    lastSeen: "2026-08-20T11:45:00Z",
    createdAt: "2026-08-19T08:30:00Z",
    updatedAt: "2026-08-19T08:30:00Z"
  },
  {
    id: "tv-3",
    name: "Manipal Menu Board",
    tvId: "TV-MANIPAL-01",
    branchId: "br-3", // Manipal
    groupId: "",
    playlistId: "",
    status: "Active",
    connectionStatus: "Offline",
    lastSeen: "2026-08-19T22:15:00Z",
    createdAt: "2026-08-20T09:00:00Z",
    updatedAt: "2026-08-20T09:00:00Z"
  }
];

export const initialGroups = [
  {
    id: "gp-1",
    name: "Entrance TVs Group",
    description: "Centrally controlled displays located at lobby entrances across branch regions.",
    status: "Active",
    playlistId: "pl-1",
    createdAt: "2026-08-19T12:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z"
  }
];

export const initialCategories = [
  { id: "cat-1", categoryId: "CAT-BIRYANI", name: "Biryani", description: "Aromatic spiced basmati rice delicacies.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=120", status: "Active" },
  { id: "cat-2", categoryId: "CAT-BEVERAGES", name: "Beverages", description: "Chilled mocktails, sodas, and brewed coffees.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=120", status: "Active" },
  { id: "cat-3", categoryId: "CAT-DESSERTS", name: "Desserts", description: "Delicious hot and cold sweet treats.", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=120", status: "Active" }
];

export const initialProducts = [
  {
    id: "prod-1",
    productId: "PROD-CHICKEN-BIRYANI",
    categoryId: "cat-1",
    name: "Chicken Dum Biryani",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=300",
    description: "Fragrant long grain basmati rice cooked with succulent chicken in traditional spices.",
    price: 220,
    displayPrice: 199,
    availability: "In Stock",
    status: "Active",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
    customisationId: "opt-3"
  },
  {
    id: "prod-2",
    productId: "PROD-MUTTON-BIRYANI",
    categoryId: "cat-1",
    name: "Mutton Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=300",
    description: "Premium mutton pieces cooked slow with basmati rice.",
    price: 280,
    displayPrice: 249,
    availability: "In Stock",
    status: "Active",
    createdAt: "2026-08-20T10:05:00Z",
    updatedAt: "2026-08-20T10:05:00Z",
    customisationId: "opt-3"
  },
  {
    id: "prod-3",
    productId: "PROD-VEG-BIRYANI",
    categoryId: "cat-1",
    name: "Veg Biryani",
    image: "https://images.unsplash.com/photo-1563379971899-660589a01cf3?auto=format&fit=crop&q=80&w=300",
    description: "Fresh seasonal vegetables cooked with aromatic spices.",
    price: 180,
    displayPrice: 159,
    availability: "In Stock",
    status: "Active",
    createdAt: "2026-08-20T10:10:00Z",
    updatedAt: "2026-08-20T10:10:00Z",
    customisationId: "opt-3"
  },
  {
    id: "prod-4",
    productId: "PROD-COLD-COFFEE",
    categoryId: "cat-2",
    name: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=300",
    description: "Rich brewed espresso blended with chilled milk and vanilla ice cream.",
    price: 90,
    displayPrice: 90,
    availability: "In Stock",
    status: "Active",
    createdAt: "2026-08-20T10:15:00Z",
    updatedAt: "2026-08-20T10:15:00Z",
    customisationId: "opt-2"
  },
  {
    id: "prod-5",
    productId: "PROD-LEMON-SODA",
    categoryId: "cat-2",
    name: "Lemon Soda",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300",
    description: "Sparkling soda with freshly squeezed lime juice.",
    price: 50,
    displayPrice: 45,
    availability: "Out of Stock",
    status: "Active",
    createdAt: "2026-08-20T10:20:00Z",
    updatedAt: "2026-08-20T10:20:00Z",
    customisationId: ""
  }
];

export const initialCustomisations = [
  { id: "opt-1", name: "Extra Cheese", description: "Add extra cheese topping to your order.", type: "Add-on", price: 30, status: "Active" },
  { id: "opt-2", name: "Spicy Sauce", description: "Add spicy sauce to your order.", type: "Add-on", price: 15, status: "Active" },
  { id: "opt-3", name: "Extra Topping", description: "Add an extra topping of your choice.", type: "Add-on", price: 40, status: "Active" },
  { id: "opt-4", name: "Double Cheese", description: "Double the cheese on your order.", type: "Add-on", price: 50, status: "Active" },
  { id: "opt-5", name: "Extra Sauce", description: "Add extra sauce to your order.", type: "Add-on", price: 10, status: "Active" },
  { id: "opt-6", name: "Crispy Onion", description: "Add crispy fried onion rings.", type: "Add-on", price: 20, status: "Active" },
  { id: "opt-7", name: "Fresh Cream", description: "Add a dollop of fresh cream.", type: "Add-on", price: 25, status: "Active" },
  { id: "opt-8", name: "Extra Mayo", description: "Add extra mayonnaise.", type: "Add-on", price: 10, status: "Active" },
  { id: "opt-9", name: "Garlic Sauce", description: "Add garlic sauce to your order.", type: "Add-on", price: 15, status: "Active" },
  { id: "opt-10", name: "Peri Peri", description: "Add peri peri seasoning.", type: "Modifier", price: 10, status: "Active" },
  { id: "opt-11", name: "Extra Chicken", description: "Add extra chicken to your order.", type: "Add-on", price: 60, status: "Active" },
  { id: "opt-12", name: "Extra Fries", description: "Add a side of extra fries.", type: "Add-on", price: 35, status: "Active" },
  { id: "opt-13", name: "No Onion", description: "Remove onion from your order.", type: "Modifier", price: 0, status: "Active" },
  { id: "opt-14", name: "No Cheese", description: "Remove cheese from your order.", type: "Modifier", price: 0, status: "Active" },
  { id: "opt-15", name: "Less Spicy", description: "Prepare with reduced spice level.", type: "Modifier", price: 0, status: "Active" }
];

export const initialCombos = [
  {
    id: "combo-1",
    name: "Biryani Feast",
    description: "Aromatic Chicken Dum Biryani served with a refreshing Lemon Soda.",
    image: "",
    items: [
      { productId: "prod-1", quantity: 1 },
      { productId: "prod-5", quantity: 1 }
    ],
    comboPrice: 219,
    availability: "Available",
    status: "Active",
    createdAt: "2026-08-21T10:00:00Z",
    updatedAt: "2026-08-21T10:00:00Z"
  },
  {
    id: "combo-2",
    name: "Family Biryani Pack",
    description: "Two Chicken Dum Biryanis with two Lemon Sodas for the family.",
    image: "",
    items: [
      { productId: "prod-1", quantity: 2 },
      { productId: "prod-5", quantity: 2 }
    ],
    comboPrice: 449,
    availability: "Available",
    status: "Active",
    createdAt: "2026-08-21T10:05:00Z",
    updatedAt: "2026-08-21T10:05:00Z"
  },
  {
    id: "combo-3",
    name: "Mutton Special",
    description: "Premium Mutton Biryani paired with Cold Coffee.",
    image: "",
    items: [
      { productId: "prod-2", quantity: 1 },
      { productId: "prod-4", quantity: 1 }
    ],
    comboPrice: 299,
    availability: "Available",
    status: "Active",
    createdAt: "2026-08-21T10:10:00Z",
    updatedAt: "2026-08-21T10:10:00Z"
  },
  {
    id: "combo-4",
    name: "Veg Delight Combo",
    description: "Veg Biryani with a chilled Lemon Soda.",
    image: "",
    items: [
      { productId: "prod-3", quantity: 1 },
      { productId: "prod-5", quantity: 1 }
    ],
    comboPrice: 179,
    availability: "Unavailable",
    status: "Active",
    createdAt: "2026-08-21T10:15:00Z",
    updatedAt: "2026-08-21T10:15:00Z"
  },
  {
    id: "combo-5",
    name: "Coffee Break",
    description: "Cold Coffee paired with a refreshing Lemon Soda.",
    image: "",
    items: [
      { productId: "prod-4", quantity: 1 },
      { productId: "prod-5", quantity: 1 }
    ],
    comboPrice: 119,
    availability: "Available",
    status: "Inactive",
    createdAt: "2026-08-21T10:20:00Z",
    updatedAt: "2026-08-21T10:20:00Z"
  }
];

export const initialTaxes = [
  {
    id: "tax-1",
    name: "GST 5%",
    rate: 5,
    applicability: "All Products",
    selectedCategories: [],
    selectedProducts: [],
    selectedCombos: [],
    status: "Active",
    createdAt: "2026-08-21T11:00:00Z",
    updatedAt: "2026-08-21T11:00:00Z"
  },
  {
    id: "tax-2",
    name: "Service Tax",
    rate: 2.5,
    applicability: "Selected Categories",
    selectedCategories: ["cat-1"],
    selectedProducts: [],
    selectedCombos: [],
    status: "Active",
    createdAt: "2026-08-21T11:05:00Z",
    updatedAt: "2026-08-21T11:05:00Z"
  },
  {
    id: "tax-3",
    name: "Packaging Charge",
    rate: 1,
    applicability: "Selected Combos",
    selectedCategories: [],
    selectedProducts: [],
    selectedCombos: ["combo-1", "combo-2"],
    status: "Inactive",
    createdAt: "2026-08-21T11:10:00Z",
    updatedAt: "2026-08-21T11:10:00Z"
  }
];

export const initialOffers = [
  {
    id: "offer-1",
    name: "Lunch Special",
    discountType: "Percentage",
    discountValue: 10,
    applicability: "Selected Categories",
    selectedCategories: ["cat-1"],
    selectedProducts: [],
    selectedCombos: [],
    startDate: "2026-08-20",
    endDate: "2026-09-20",
    status: "Active",
    createdAt: "2026-08-21T12:00:00Z",
    updatedAt: "2026-08-21T12:00:00Z"
  },
  {
    id: "offer-2",
    name: "Beverage Discount",
    discountType: "Fixed Amount",
    discountValue: 15,
    applicability: "Selected Products",
    selectedCategories: [],
    selectedProducts: ["prod-4", "prod-5"],
    selectedCombos: [],
    startDate: "2026-08-21",
    endDate: "2026-08-31",
    status: "Active",
    createdAt: "2026-08-21T12:05:00Z",
    updatedAt: "2026-08-21T12:05:00Z"
  },
  {
    id: "offer-3",
    name: "Weekend Combo Deal",
    discountType: "Percentage",
    discountValue: 15,
    applicability: "Selected Combos",
    selectedCategories: [],
    selectedProducts: [],
    selectedCombos: ["combo-1", "combo-3"],
    startDate: "2026-08-22",
    endDate: "2026-08-24",
    status: "Active",
    createdAt: "2026-08-21T12:10:00Z",
    updatedAt: "2026-08-21T12:10:00Z"
  },
  {
    id: "offer-4",
    name: "Grand Opening",
    discountType: "Percentage",
    discountValue: 20,
    applicability: "All Products",
    selectedCategories: [],
    selectedProducts: [],
    selectedCombos: [],
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    status: "Inactive",
    createdAt: "2026-08-21T12:15:00Z",
    updatedAt: "2026-08-21T12:15:00Z"
  }
];
