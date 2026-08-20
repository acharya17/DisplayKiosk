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



