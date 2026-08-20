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

