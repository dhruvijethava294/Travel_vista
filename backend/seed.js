const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Destination = require("./models/Destination");
const Hotel = require("./models/Hotel");
const TourPackage = require("./models/TourPackage");
const Booking = require("./models/Booking");
const GalleryItem = require("./models/GalleryItem");

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelvista";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Hotel.deleteMany({});
    await TourPackage.deleteMany({});
    await Booking.deleteMany({});
    await GalleryItem.deleteMany({});
    console.log("Cleared existing collections.");

    // 1. Create Users
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedUserPassword = await bcrypt.hash("user123", 10);

    const adminUser = await User.create({
      name: "TravelVista Admin",
      email: "admin@travelvista.com",
      password: hashedAdminPassword,
      phone: "+91 98765 00001",
      role: "admin",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    });

    const standardUser = await User.create({
      name: "Dhruvi Patel",
      email: "user@travelvista.com",
      password: hashedUserPassword,
      phone: "+91 98765 12345",
      role: "user",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    });

    console.log("Users created: Admin (admin@travelvista.com / admin123), User (user@travelvista.com / user123)");

    // 2. Create Destinations
    const destinations = await Destination.insertMany([
      {
        name: "Goa",
        country: "India",
        description: "India's pocket-sized paradise known for its pristine beaches, vibrant nightlife, Portuguese heritage, and watersports.",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80",
        ],
        highlights: ["Baga & Calangute Beach", "Dudhsagar Waterfalls", "Fort Aguada", "Scuba Diving & Jet Skiing", "Night Markets"],
        bestTimeToVisit: "November to February",
        videoUrl: "https://www.youtube.com/embed/g8f_X53oqqQ",
        featured: true,
      },
      {
        name: "Manali",
        country: "India",
        description: "A high-altitude Himalayan resort town nestled in Himachal Pradesh, famous for snow-clad peaks, adventure sports, and scenic valleys.",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
        ],
        highlights: ["Solang Valley Adventure", "Rohtang Pass Snow Point", "Hadimba Temple", "Old Manali Cafes", "Atal Tunnel"],
        bestTimeToVisit: "October to June",
        videoUrl: "https://www.youtube.com/embed/5-b0Q0k0b2o",
        featured: true,
      },
      {
        name: "Dubai",
        country: "United Arab Emirates",
        description: "A futuristic metropolis renowned for luxury shopping, ultramodern architecture, lively nightlife, and vast golden desert dunes.",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=800&q=80",
        ],
        highlights: ["Burj Khalifa Observation Deck", "Desert Safari with BBQ", "Dubai Marina Yacht Cruise", "Palm Jumeirah", "Dubai Mall & Fountain"],
        bestTimeToVisit: "November to March",
        videoUrl: "https://www.youtube.com/embed/IdejM6wCkxA",
        featured: true,
      },
      {
        name: "Kerala",
        country: "India",
        description: "God's Own Country blessed with serene backwaters, lush green tea plantations, palm-fringed beaches, and Ayurvedic retreats.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
        ],
        highlights: ["Alleppey Houseboat Stay", "Munnar Tea Gardens", "Periyar National Park", "Kovalam Beach", "Kathakali Performance"],
        bestTimeToVisit: "September to March",
        videoUrl: "https://www.youtube.com/embed/7V2U5e_tY_o",
        featured: true,
      },
      {
        name: "Bali",
        country: "Indonesia",
        description: "The Island of the Gods, famed for its volcanic mountains, iconic rice terraces, serene beaches, and rich spiritual culture.",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80",
        ],
        highlights: ["Uluwatu Cliff Temple", "Ubud Monkey Forest & Rice Terraces", "Nusa Penida Island Tour", "Mount Batur Sunrise Trek", "Seminyak Beach Clubs"],
        bestTimeToVisit: "April to October",
        videoUrl: "https://www.youtube.com/embed/5k5eX3c0u-Q",
        featured: true,
      },
      {
        name: "Paris",
        country: "France",
        description: "The City of Light, celebrated for world-class art, fashion, gastronomy, romantic boulevards, and historic architectural landmarks.",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
        ],
        highlights: ["Eiffel Tower Summit", "Louvre Museum", "Seine River Dinner Cruise", "Montmartre & Sacre-Coeur", "Palace of Versailles"],
        bestTimeToVisit: "April to October",
        videoUrl: "https://www.youtube.com/embed/UfEiKK47XlY",
        featured: true,
      },
      {
        name: "Rajasthan",
        country: "India",
        description: "The Land of Kings, showcasing majestic hilltop forts, opulent royal palaces, vibrant desert folklore, and colorful bazaars.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
        ],
        highlights: ["Amber Palace & Hawa Mahal in Jaipur", "Udaipur Lake Palace", "Jodhpur Mehrangarh Fort", "Jaisalmer Sam Sand Dunes", "Camel Safari"],
        bestTimeToVisit: "October to March",
        videoUrl: "https://www.youtube.com/embed/5-b0Q0k0b2o",
        featured: true,
      },
      {
        name: "Switzerland",
        country: "Switzerland",
        description: "A European alpine wonderland of snow-covered peaks, emerald lakes, charming chalets, scenic mountain railways, and Swiss chocolates.",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
        ],
        highlights: ["Jungfraujoch - Top of Europe", "Mount Titlis Rotair Cable Car", "Lake Lucerne Boat Cruise", "Interlaken Adventures", "Matterhorn Zermatt"],
        bestTimeToVisit: "May to October (Summer) or Dec to March (Ski)",
        videoUrl: "https://www.youtube.com/embed/linlz7-697E",
        featured: true,
      },
    ]);

    console.log(`Destinations created: ${destinations.length}`);

    // 3. Create Hotels
    const hotels = await Hotel.insertMany([
      {
        name: "Taj Exotica Resort & Spa",
        location: "Benaulim, South Goa",
        city: "Goa",
        description: "Mediterranean-inspired 5-star luxury resort set in 56 acres of lush gardens along a private beach.",
        pricePerNight: 12500,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: ["Private Beach", "Infinity Pool", "Jiva Spa", "Free High-Speed WiFi", "Fine Dining", "Bar & Lounge", "Fitness Center"],
        roomType: "Luxury Sea View Villa",
        contactPhone: "+91 832 668 3333",
        contactEmail: "exotica.goa@tajhotels.com",
        featured: true,
      },
      {
        name: "Solang Valley Himalayan Resort",
        location: "Solang Valley, Manali",
        city: "Manali",
        description: "Riverside luxury retreat surrounded by pine forests and breathtaking views of snow-capped peaks.",
        pricePerNight: 6500,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: ["Mountain View Balcony", "Bonfire & BBQ", "Multi-cuisine Restaurant", "Heated Rooms", "Adventure Desk", "Free WiFi"],
        roomType: "Deluxe Mountain View Suite",
        contactPhone: "+91 1902 256 001",
        contactEmail: "reservations@solangresort.com",
        featured: true,
      },
      {
        name: "Atlantis, The Palm",
        location: "Crescent Road, The Palm, Dubai",
        city: "Dubai",
        description: "Iconic ocean-themed luxury resort featuring Aquaventure Waterpark, underwater aquarium, and celebrity chef restaurants.",
        pricePerNight: 28000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: ["Free Waterpark Access", "Private Beach", "Aquarium Access", "23+ Restaurants", "Spa & Wellness", "Kids Club", "Airport Transfers"],
        roomType: "Ocean King Room",
        contactPhone: "+971 4 426 2000",
        contactEmail: "info@atlantis.com",
        featured: true,
      },
      {
        name: "Kumarakom Lake Resort",
        location: "Vembanad Lake, Kerala",
        city: "Kerala",
        description: "Acclaimed heritage luxury resort featuring traditional Kerala architecture, meandering pool villas, and Ayurvedic spa.",
        pricePerNight: 14000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: ["Meandering Pool", "Ayurvedic Spa", "Sunset Lake Cruise", "Seafood Restaurant", "Yoga Center", "Free WiFi"],
        roomType: "Heritage Pool Villa",
        contactPhone: "+91 481 252 4900",
        contactEmail: "klr@kumarakomlakeresort.in",
        featured: true,
      },
      {
        name: "The Kayon Jungle Resort",
        location: "Ubud, Bali",
        city: "Bali",
        description: "Enchanting 5-star jungle retreat with multi-tier infinity pools overlooking the sacred valley and rainforest.",
        pricePerNight: 18500,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: ["3-Tier Infinity Pool", "Seraphim Spa", "Jungle View Cabanas", "Free Yoga Sessions", "Gourmet Restaurant", "Shuttle to Ubud"],
        roomType: "Kayon Jungle Suite",
        contactPhone: "+62 361 978 098",
        contactEmail: "info@thekayonjungleresort.com",
        featured: true,
      },
      {
        name: "Hotel Plaza Athénée",
        location: "Avenue Montaigne, Paris",
        city: "Paris",
        description: "Haute couture palace hotel offering romantic views of the Eiffel Tower, Michelin-star dining, and Dior Spa.",
        pricePerNight: 45000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: ["Eiffel Tower Views", "Dior Spa", "Michelin Dining", "Concierge Service", "Courtyard Garden", "Valet Parking"],
        roomType: "Deluxe Parisian Room",
        contactPhone: "+33 1 53 67 66 65",
        contactEmail: "reservations.HPA@dorchestercollection.com",
        featured: true,
      },
      {
        name: "The Oberoi Udaivilas",
        location: "Lake Pichola, Udaipur, Rajasthan",
        city: "Rajasthan",
        description: "Ranked among the world's best hotels, built like a grand royal palace with rambling courtyards and lakeside dining.",
        pricePerNight: 35000,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: ["Private Boat Arrival", "Semi-Private Moat Pools", "Oberoi Spa", "Royal Rajasthani Dining", "Peacock Gardens"],
        roomType: "Premier Room with Semi-Private Pool",
        contactPhone: "+91 294 243 3300",
        contactEmail: "reservations@oberoigroup.com",
        featured: true,
      },
      {
        name: "Victoria-Jungfrau Grand Hotel & Spa",
        location: "Interlaken, Switzerland",
        city: "Switzerland",
        description: "Historic 5-star Swiss grand hotel nestled between two crystal lakes with uninterrupted vistas of the Jungfrau summit.",
        pricePerNight: 42000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80",
        ],
        amenities: ["Nescens Spa (5500 sqm)", "Indoor & Outdoor Pools", "Fine Dining", "Tennis Courts", "Alpine Concierge", "Free Ski Shuttle"],
        roomType: "Junior Suite Jungfrau View",
        contactPhone: "+41 33 828 28 28",
        contactEmail: "info@victoria-jungfrau.ch",
        featured: true,
      },
    ]);

    console.log(`Hotels created: ${hotels.length}`);

    // Helper map of hotels by city/name
    const hotelGoa = hotels.find((h) => h.city === "Goa");
    const hotelManali = hotels.find((h) => h.city === "Manali");
    const hotelDubai = hotels.find((h) => h.city === "Dubai");
    const hotelKerala = hotels.find((h) => h.city === "Kerala");
    const hotelBali = hotels.find((h) => h.city === "Bali");
    const hotelParis = hotels.find((h) => h.city === "Paris");
    const hotelRajasthan = hotels.find((h) => h.city === "Rajasthan");
    const hotelSwiss = hotels.find((h) => h.city === "Switzerland");

    // 4. Create Tour Packages
    const packages = await TourPackage.insertMany([
      {
        title: "Goa Beach Blast & Watersports Escape",
        destination: "Goa",
        category: "Beach",
        description: "Indulge in a 4-day sun-soaked getaway in Goa! Experience lively beaches, thrilling jet skiing and parasailing at Baga, cruise on the Mandovi River, explore Old Goa's heritage churches, and dine at beachside shacks under the stars.",
        price: 14999,
        duration: "4 Days / 3 Nights",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80",
        ],
        videos: ["https://www.youtube.com/embed/g8f_X53oqqQ"],
        placesToVisit: ["Baga Beach", "Calangute", "Fort Aguada", "Dudhsagar Falls", "Basilica of Bom Jesus", "Anjuna Flea Market"],
        included: [
          "3 Nights Luxury Beach Resort Accommodation",
          "Daily Buffet Breakfast & 1 Gala Seafood Dinner",
          "Airport/Railway Station Pick-up and Drop (AC Private Car)",
          "Full Day Watersports Combo (Parasailing, Jet Ski, Banana Ride, Bumper Ride)",
          "Mandovi River Sunset Cruise Tickets",
          "Sightseeing Tour of North & South Goa with Guide",
        ],
        excluded: [
          "Airfare / Train tickets to Goa",
          "Personal expenses, drinks, and tips",
          "Optional scuba diving fee",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Goa & Sunset Leisure",
            activities: "Pick up from airport/railway station and transfer to hotel. Check-in and relax. Evening walk along the beach followed by dinner.",
            meals: "Dinner Included",
          },
          {
            day: 2,
            title: "North Goa Highlights & Thrilling Watersports",
            activities: "Head to Baga and Calangute beaches for watersports including jet-ski and parasailing. Visit historic Fort Aguada for panoramic sea views. Evening explore Tito's lane.",
            meals: "Breakfast Included",
          },
          {
            day: 3,
            title: "Heritage South Goa & Mandovi Sunset Cruise",
            activities: "Explore Old Goa UNESCO churches (Basilica of Bom Jesus & Se Cathedral). Tour spice plantation with traditional buffet. Evening Mandovi River cruise with Goan folk music.",
            meals: "Breakfast & Spice Plantation Lunch",
          },
          {
            day: 4,
            title: "Souvenir Shopping & Departure",
            activities: "Morning leisure, shopping for Goan feni, cashews, and handicrafts at local market. Transfer to airport with joyful memories.",
            meals: "Breakfast Included",
          },
        ],
        includedHotels: [hotelGoa._id],
        rating: 4.8,
        reviewsCount: 38,
        maxGroupSize: 12,
        featured: true,
      },
      {
        title: "Manali & Solang Snow Adventure Tour",
        destination: "Manali",
        category: "Adventure",
        description: "Escape to the majestic Himalayas! Enjoy thrilling snow adventures at Solang Valley and Rohtang Pass, stroll down the famous Mall Road, visit ancient cedar temples, and relax by riverside bonfires.",
        price: 18500,
        duration: "5 Days / 4 Nights",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
        ],
        videos: ["https://www.youtube.com/embed/5-b0Q0k0b2o"],
        placesToVisit: ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Atal Tunnel", "Vashisht Hot Springs", "Mall Road"],
        included: [
          "4 Nights Deluxe Mountain View Room Accommodation",
          "Daily Breakfast and Dinner included",
          "Private AC/Heated Cab for transfers and sightseeing",
          "Rohtang Pass & Solang Valley Excursion with Snow Permit",
          "Bonfire night with music",
          "All toll taxes, parking, and driver allowance",
        ],
        excluded: [
          "Paragliding, skiing, and ATV ride gear charges",
          "Monument entry tickets",
          "Heater charges if used above limit",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Manali & Old Manali Stroll",
            activities: "Arrival in Manali, check into resort. Afternoon walk through cedar woods to the ancient wooden Hadimba Temple and lively Old Manali cafes.",
            meals: "Dinner Included",
          },
          {
            day: 2,
            title: "Solang Valley Snow Activities & Atal Tunnel",
            activities: "Full day excursion to Solang Valley for paragliding, zorbing, and cable car rides. Drive through the historic 9km Atal Tunnel to Lahaul Valley.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 3,
            title: "Rohtang Pass Snow Point Excursion",
            activities: "Early morning drive to the legendary Rohtang Pass (subject to weather/permit). Experience playing in glacier snow and panoramic Himalayan vistas.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 4,
            title: "Naggar Castle & Kullu River Rafting",
            activities: "Visit historic Naggar Castle and Roerich Art Gallery. Head to Kullu for white-water river rafting on the Beas River and visit shawl weaving centers.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 5,
            title: "Mall Road Shopping & Departure",
            activities: "Explore Manali Mall Road, buy Himachali wooden crafts and organic honey. Transfer to Volvo bus stand or airport.",
            meals: "Breakfast Included",
          },
        ],
        includedHotels: [hotelManali._id],
        rating: 4.9,
        reviewsCount: 52,
        maxGroupSize: 15,
        featured: true,
      },
      {
        title: "Dubai Extravaganza: Skyline & Desert Safari",
        destination: "Dubai",
        category: "Luxury",
        description: "Experience the ultimate glamour of Dubai! Marvel at the Burj Khalifa 124th floor views, glide on a luxury Marina yacht, brave the red dunes on a 4x4 desert safari with belly dancing and BBQ, and shop at world-renowned malls.",
        price: 48999,
        duration: "6 Days / 5 Nights",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=800&q=80",
        ],
        videos: ["https://www.youtube.com/embed/IdejM6wCkxA"],
        placesToVisit: ["Burj Khalifa", "Dubai Mall & Fountain", "Dubai Marina", "Palm Jumeirah", "Desert Safari Camp", "Dubai Frame", "Miracle Garden"],
        included: [
          "5 Nights in 5-Star Luxury Dubai Hotel",
          "Daily International Buffet Breakfast",
          "Burj Khalifa 124th/125th Floor Fast-Track Tickets",
          "Premium 4x4 Desert Safari with Dune Bashing, Camel Ride, Tanoura Show & BBQ Dinner",
          "Dubai Marina 2-Hour Luxury Yacht Cruise with Dinner",
          "Half-day Guided City Tour with Dubai Frame entry",
          "All private luxury airport transfers",
        ],
        excluded: [
          "International round-trip flights",
          "UAE Tourist Visa and Insurance",
          "Tourism Dirham fee paid at hotel",
        ],
        itinerary: [
          {
            day: 1,
            title: "Welcome to Dubai & Marina Dhow Cruise",
            activities: "Arrival at Dubai International Airport (DXB). Private luxury transfer to your hotel. Evening 5-star Dubai Marina cruise with buffet dinner and live music.",
            meals: "Dinner on Cruise",
          },
          {
            day: 2,
            title: "Dubai City Tour & Burj Khalifa Sky Deck",
            activities: "Half day guided tour covering Dubai Frame, Zabeel Palace, Palm Jumeirah, and Atlantis. Visit Dubai Mall and take the high-speed elevator to the 124th floor of Burj Khalifa. Watch the musical fountain show.",
            meals: "Breakfast Included",
          },
          {
            day: 3,
            title: "Thrilling Red Dune Desert Safari",
            activities: "Morning leisure for shopping. Afternoon 4x4 Land Cruiser pick up for dune bashing in Lahbab desert, sandboarding, camel rides, falcon photography, and gala BBQ buffet under the stars with belly dance performances.",
            meals: "Breakfast & Desert BBQ Dinner",
          },
          {
            day: 4,
            title: "Miracle Garden & Global Village Extravaganza",
            activities: "Visit the enchanting Dubai Miracle Garden (millions of natural blooming flowers). Evening explore Global Village pavilions featuring culture and cuisine from 90+ countries.",
            meals: "Breakfast Included",
          },
          {
            day: 5,
            title: "Aquaventure Waterpark & Lost Chambers",
            activities: "Enjoy unlimited thrill rides at Atlantis Aquaventure Waterpark and explore the mysterious underwater ruins at The Lost Chambers Aquarium.",
            meals: "Breakfast Included",
          },
          {
            day: 6,
            title: "Gold Souk & Farewell Dubai",
            activities: "Last minute gold and perfume shopping at Deira Gold Souk and Spice Souk. Private transfer to airport for return flight.",
            meals: "Breakfast Included",
          },
        ],
        includedHotels: [hotelDubai._id],
        rating: 4.9,
        reviewsCount: 64,
        maxGroupSize: 10,
        featured: true,
      },
      {
        title: "Romantic Kerala: Munnar Hills & Alleppey Backwaters",
        destination: "Kerala",
        category: "Honeymoon",
        description: "Immerse in the tranquility of God's Own Country. Breathe in the crisp aroma of Munnar's rolling tea hills, spot wild elephants at Periyar, and sleep on a private luxury houseboat as it drifts through palm-fringed backwaters.",
        price: 22499,
        duration: "5 Days / 4 Nights",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
        ],
        videos: ["https://www.youtube.com/embed/7V2U5e_tY_o"],
        placesToVisit: ["Munnar Tea Hills", "Mattupetty Dam", "Eravikulam National Park", "Thekkady Spice Plantations", "Alleppey Houseboat", "Fort Kochi"],
        included: [
          "3 Nights Luxury Hill Resort + 1 Night Private AC Premium Houseboat",
          "All meals on Houseboat (Welcome drink, Kerala Lunch, High Tea, Dinner, Breakfast)",
          "Daily Breakfast at Resorts",
          "Private AC Sedan for all transfers and sightseeing",
          "Guided Spice Plantation tour & Tea Tasting session",
          "Kalaripayattu Martial Arts & Kathakali Dance show tickets",
        ],
        excluded: [
          "Airfare / Train tickets to Cochin",
          "Ayurvedic massage therapies (optional)",
          "Park safari charges",
        ],
        itinerary: [
          {
            day: 1,
            title: "Cochin to Munnar - Journey into the Clouds",
            activities: "Pick up from Cochin Airport/Railway Station. Scenic drive to Munnar with stops at Cheeyappara and Valara waterfalls. Check into tea estate resort.",
            meals: "Dinner Included",
          },
          {
            day: 2,
            title: "Munnar Tea Plantations & Nilgiri Tahr",
            activities: "Visit Eravikulam National Park to see endangered Nilgiri Tahr. Tour Tata Tea Museum, Mattupetty Dam with speed boating, and Echo Point.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 3,
            title: "Munnar to Thekkady (Periyar Wildlife)",
            activities: "Drive through scenic cardamom hills to Thekkady. Enjoy guided spice plantation walk and evening martial arts show.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 4,
            title: "Alleppey Luxury Houseboat Cruise",
            activities: "Board your private houseboat at Alleppey by noon. Cruise through canals, lagoons, and rural paddy fields while relishing freshly prepared Karimeen fish and local delicacies.",
            meals: "All Meals on Houseboat",
          },
          {
            day: 5,
            title: "Fort Kochi Sightseeing & Departure",
            activities: "Houseboat check-out after breakfast. Visit Chinese Fishing Nets and Jew Town in Fort Kochi. Transfer to Cochin Airport.",
            meals: "Breakfast Included",
          },
        ],
        includedHotels: [hotelKerala._id],
        rating: 4.9,
        reviewsCount: 46,
        maxGroupSize: 8,
        featured: true,
      },
      {
        title: "Tropical Bali Odyssey: Temples, Waterfalls & Ubud",
        destination: "Bali",
        category: "Honeymoon",
        description: "Discover the magical essence of Bali! Walk among emerald rice terraces in Ubud, swing above lush valleys, visit oceanfront sea temples at sunset, relax on white sand beaches, and savor fresh seafood barbecues on Jimbaran Bay.",
        price: 38999,
        duration: "6 Days / 5 Nights",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80",
        ],
        videos: ["https://www.youtube.com/embed/5k5eX3c0u-Q"],
        placesToVisit: ["Ubud Sacred Forest", "Tegalalang Rice Terraces", "Bali Swing", "Tanah Lot Temple", "Uluwatu Sunset Temple", "Nusa Penida Island"],
        included: [
          "3 Nights Luxury Ubud Jungle Villa + 2 Nights Seminyak Beach Resort",
          "Daily Breakfast & Floating Breakfast Experience",
          "Full Day Nusa Penida West Island Speedboat Tour with Snorkeling",
          "Bali Swing & Coffee Plantation Tour with entry passes",
          "Romantic Candlelight Dinner on Jimbaran Beach",
          "Private AC Car with English-speaking Driver Guide",
        ],
        excluded: [
          "International Flights to Bali (DPS)",
          "Indonesia Visa on Arrival (approx $35)",
          "Personal shopping and watersports insurance",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Bali & Ubud Jungle Check-in",
            activities: "Meet and greet at Denpasar Airport with flower garland. Transfer to your scenic Ubud resort. Evening relaxation with welcome massage.",
            meals: "Dinner Included",
          },
          {
            day: 2,
            title: "Ubud Rice Terraces, Bali Swing & Monkey Forest",
            activities: "Visit Tegalalang Rice Terraces and take iconic photos on the giant Bali Swing. Visit the Sacred Monkey Forest and Ubud Royal Palace.",
            meals: "Breakfast & Lunch",
          },
          {
            day: 3,
            title: "Kintamani Volcano & Tegenungan Waterfall",
            activities: "Witness Mount Batur active volcano views while enjoying buffet lunch. Cool down at the magnificent Tegenungan Waterfall.",
            meals: "Breakfast & Lunch",
          },
          {
            day: 4,
            title: "Nusa Penida Island Tour (Kelingking Beach)",
            activities: "Speedboat to Nusa Penida island. Visit the world-famous T-Rex shaped Kelingking Beach, Broken Beach, and Angel's Billabong.",
            meals: "Breakfast & Island Lunch",
          },
          {
            day: 5,
            title: "Uluwatu Cliff Temple & Kecak Fire Dance",
            activities: "Perched 70 meters above the Indian Ocean, explore Uluwatu Temple. Watch the spellbinding Kecak Fire Dance at sunset, followed by candlelit Jimbaran seafood.",
            meals: "Breakfast & Candlelight Seafood Dinner",
          },
          {
            day: 6,
            title: "Seminyak Cafes & Departure",
            activities: "Morning shopping in Seminyak boutiques. Relax at coffee shop before transfer to DPS airport.",
            meals: "Breakfast Included",
          },
        ],
        includedHotels: [hotelBali._id],
        rating: 4.9,
        reviewsCount: 71,
        maxGroupSize: 10,
        featured: true,
      },
      {
        title: "Enchanting Paris: Eiffel, Louvre & Seine Romance",
        destination: "Paris",
        category: "Heritage",
        description: "Experience the romance and artistic grandeur of Paris. Ascend the Eiffel Tower for bird's eye views, admire masterpieces at the Louvre, sail down the Seine River with fine wine, and wander the bohemian streets of Montmartre.",
        price: 79999,
        duration: "5 Days / 4 Nights",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
        ],
        videos: ["https://www.youtube.com/embed/UfEiKK47XlY"],
        placesToVisit: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Elysees", "Arc de Triomphe", "Palace of Versailles"],
        included: [
          "4 Nights in 4-Star Central Parisian Boutique Hotel",
          "Daily Parisian Buffet Breakfast",
          "Priority Skip-the-Line Tickets to Eiffel Tower 2nd Floor & Summit",
          "Louvre Museum Guided Masterpiece Tour (Mona Lisa & Venus de Milo)",
          "Seine River Romantic Sunset Sightseeing Cruise with French Champagne",
          "Full Day Versailles Palace & Gardens Excursion with Audio Guide",
          "Paris Metro 5-Day Unlimited Pass",
        ],
        excluded: [
          "Schengen Visa and Travel Insurance",
          "International Flights to Paris (CDG/ORY)",
          "City tourist tax (approx 4 EUR per night)",
        ],
        itinerary: [
          {
            day: 1,
            title: "Bonjour Paris & Seine Sunset Cruise",
            activities: "Private transfer from Charles de Gaulle airport to central Paris hotel. Evening boat cruise along the illuminated Seine River passing historic bridges.",
            meals: "Welcome Drinks",
          },
          {
            day: 2,
            title: "Eiffel Tower & Champs-Elysees Promenade",
            activities: "Morning ascent to Eiffel Tower for breathtaking views across Paris. Afternoon stroll down the glamorous Avenue des Champs-Elysees to Arc de Triomphe.",
            meals: "Breakfast Included",
          },
          {
            day: 3,
            title: "Louvre Museum & Historic Latin Quarter",
            activities: "Discover world treasures inside the Louvre. Walk through Tuileries Garden and across the Seine to the historic Latin Quarter and Pantheon.",
            meals: "Breakfast Included",
          },
          {
            day: 4,
            title: "Opulent Palace of Versailles Excursion",
            activities: "Full day excursion to the Royal Palace of Versailles. Explore the glittering Hall of Mirrors, King's Grand Apartments, and landscaped fountains.",
            meals: "Breakfast Included",
          },
          {
            day: 5,
            title: "Montmartre Bohemian Quarter & Departure",
            activities: "Visit the Basilica of Sacre-Coeur overlooking Paris. Watch street artists at Place du Tertre. Transfer to CDG airport for departure.",
            meals: "Breakfast Included",
          },
        ],
        includedHotels: [hotelParis._id],
        rating: 4.9,
        reviewsCount: 42,
        maxGroupSize: 12,
        featured: true,
      },
      {
        title: "Royal Rajasthan Heritage: Jaipur, Udaipur & Jodhpur",
        destination: "Rajasthan",
        category: "Heritage",
        description: "Step into royal history! Discover the Amber Fort and pink architecture in Jaipur, the imposing Mehrangarh Fort in the Blue City of Jodhpur, and the romantic lake palaces of Udaipur with private cultural dance shows.",
        price: 26999,
        duration: "7 Days / 6 Nights",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
        ],
        videos: ["https://www.youtube.com/embed/5-b0Q0k0b2o"],
        placesToVisit: ["Amber Fort", "Hawa Mahal", "City Palace Udaipur", "Lake Pichola", "Mehrangarh Fort Jodhpur", "Umaid Bhawan"],
        included: [
          "6 Nights in Royal Heritage Haveli Hotels (Jaipur, Jodhpur, Udaipur)",
          "Daily Breakfast & Traditional Rajasthani Thali Dinners",
          "Private AC Innova/Sedan with Chauffeur throughout the tour",
          "Elephant/Jeep ride at Amber Fort",
          "Lake Pichola Sunset Boat Ride in Udaipur",
          "Local expert licensed guides at all heritage monuments",
        ],
        excluded: [
          "Camera fees at monuments",
          "Air/Train tickets",
          "Personal tips and laundry",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Pink City Jaipur",
            activities: "Pick up from Jaipur Airport. Check in at heritage hotel. Evening visit to Birla Temple and Chokhi Dhani ethnic village for folk dance and dinner.",
            meals: "Rajasthani Dinner",
          },
          {
            day: 2,
            title: "Jaipur Forts, Hawa Mahal & City Palace",
            activities: "Jeep ride up to Amber Fort. Stop at Jal Mahal for photos. Tour City Palace museum and astronomical Jantar Mantar.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 3,
            title: "Jaipur to Jodhpur (The Blue City)",
            activities: "Drive to Jodhpur. Visit the monumental Mehrangarh Fort perched on a cliff and Jaswant Thada white marble memorial.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 4,
            title: "Jodhpur to Udaipur via Ranakpur Jain Temples",
            activities: "Drive to Udaipur with a stop at the famous 1444 intricately carved marble pillar temple at Ranakpur.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 5,
            title: "Udaipur City of Lakes Sightseeing",
            activities: "Explore the vast Udaipur City Palace complex, Jagdish Temple, and Saheliyon-ki-Bari. Evening romantic boat cruise on Lake Pichola.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 6,
            title: "Monsoon Palace & Artisan Village",
            activities: "Drive up to Sajjangarh Monsoon Palace for panoramic sunset views over lakes and Aravalli hills. Shop for handcrafted leather and silver.",
            meals: "Breakfast & Dinner",
          },
          {
            day: 7,
            title: "Udaipur Departure",
            activities: "Leisure morning breakfast and transfer to Udaipur Maharana Pratap Airport.",
            meals: "Breakfast Included",
          },
        ],
        includedHotels: [hotelRajasthan._id],
        rating: 4.9,
        reviewsCount: 58,
        maxGroupSize: 12,
        featured: true,
      },
      {
        title: "Swiss Alpine Wonders: Interlaken, Titlis & Jungfrau",
        destination: "Switzerland",
        category: "Family",
        description: "Travel through the postcard landscapes of Switzerland. Ride the revolving cable car to Mount Titlis glacier, ascend the Jungfraujoch Top of Europe, cruise Lake Lucerne, and savor authentic Swiss fondue in quaint alpine villages.",
        price: 115000,
        duration: "7 Days / 6 Nights",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80",
        ],
        videos: ["https://www.youtube.com/embed/linlz7-697E"],
        placesToVisit: ["Jungfraujoch", "Mount Titlis", "Interlaken", "Lucerne Chapel Bridge", "Lake Brienz", "Zermatt Matterhorn"],
        included: [
          "6 Nights in 4-Star Swiss Alpine Hotels (Lucerne & Interlaken)",
          "Daily Swiss Buffet Breakfast",
          "Swiss Travel Pass (1st/2nd Class Unlimited Train, Boat, Bus travel)",
          "Excursion to Jungfraujoch Top of Europe (3,454m) with Ice Palace entry",
          "Excursion to Mount Titlis with Rotair revolving cable car and Cliff Walk",
          "Lake Lucerne 1-Hour Scenic Steamboat Cruise",
          "Authentic Swiss Cheese Fondue Dinner experience",
        ],
        excluded: [
          "Schengen Visa and Health Insurance",
          "International Flights to Zurich/Geneva",
          "Adventure sports like skydiving or paragliding",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Zurich & Scenic Train to Lucerne",
            activities: "Arrive at Zurich Airport. Board the Swiss Rail to Lucerne. Walk across historic Chapel Bridge and see the Lion Monument.",
            meals: "Welcome Drinks",
          },
          {
            day: 2,
            title: "Mount Titlis Eternal Snow & Glacier Park",
            activities: "Ascend Mount Titlis via the world's first revolving Rotair cable car. Cross the Europe's highest suspension bridge (Titlis Cliff Walk) and slide in the Glacier Park.",
            meals: "Breakfast Included",
          },
          {
            day: 3,
            title: "Lake Lucerne Boat Cruise & Transfer to Interlaken",
            activities: "Steamboat cruise on Lake Lucerne surrounded by peaks. Board the GoldenPass panoramic train to Interlaken nestled between two lakes.",
            meals: "Breakfast & Swiss Fondue Dinner",
          },
          {
            day: 4,
            title: "Jungfraujoch - Top of Europe (3,454m)",
            activities: "Ride the modern Eiger Express tricable gondola and mountain railway to Jungfraujoch. Visit the Sphinx Observatory and Ice Palace sculpted inside a glacier.",
            meals: "Breakfast Included",
          },
          {
            day: 5,
            title: "Grindelwald First Cliff Walk & Lake Brienz",
            activities: "Visit Grindelwald First for the thrilling cliff walkway and alpine views. Afternoon cruise on the turquoise waters of Lake Brienz.",
            meals: "Breakfast Included",
          },
          {
            day: 6,
            title: "Day Trip to Zermatt & Iconic Matterhorn",
            activities: "Scenic train trip to car-free village Zermatt to marvel at the iconic triangular Matterhorn peak. Enjoy Swiss chocolate tastings.",
            meals: "Breakfast Included",
          },
          {
            day: 7,
            title: "Zurich Departure",
            activities: "Train back to Zurich Airport with unforgettable Swiss memories.",
            meals: "Breakfast Included",
          },
        ],
        includedHotels: [hotelSwiss._id],
        rating: 5.0,
        reviewsCount: 88,
        maxGroupSize: 10,
        featured: true,
      },
    ]);

    console.log(`Tour Packages created: ${packages.length}`);

    // 5. Create Gallery Items
    const galleryItems = await GalleryItem.insertMany([
      {
        title: "Sunset Over Goa Palm Beaches",
        category: "Beaches",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        destination: "Goa",
        description: "Golden hour sunset over Arabian sea in Goa.",
      },
      {
        title: "Solang Valley Snow-Covered Pine Mountains",
        category: "Mountains",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
        destination: "Manali",
        description: "Fresh snowfall covering evergreen pine forests.",
      },
      {
        title: "Dubai Skyline & Burj Khalifa at Night",
        category: "Luxury",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        destination: "Dubai",
        description: "Illuminated skyscrapers reflecting in the Dubai canal.",
      },
      {
        title: "Alleppey Backwaters Serene Houseboat",
        category: "Beaches",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
        destination: "Kerala",
        description: "Traditional wooden Kettuvallam boat cruising serene waters.",
      },
      {
        title: "Eiffel Tower Romantic Paris View",
        category: "Heritage",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        destination: "Paris",
        description: "Iconic Parisian architecture under spring skies.",
      },
      {
        title: "Ubud Bali Sacred Rice Terraces",
        category: "Mountains",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        destination: "Bali",
        description: "Stepped emerald green rice fields in Bali highlands.",
      },
      {
        title: "Taj Lake Palace Udaipur Grandeur",
        category: "Heritage",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        destination: "Rajasthan",
        description: "Historic white marble palace on the waters of Lake Pichola.",
      },
      {
        title: "Swiss Alpine Wonderland in Interlaken",
        category: "Mountains",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
        destination: "Switzerland",
        description: "Turquoise alpine lakes and snowcapped Swiss peaks.",
      },
      // Video items
      {
        title: "Virtual Tour: Top 10 Things to Do in Goa",
        category: "Beaches",
        mediaType: "video",
        url: "https://www.youtube.com/embed/g8f_X53oqqQ",
        thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        destination: "Goa",
        description: "Comprehensive travel guide to Goa's beaches, heritage, and foods.",
      },
      {
        title: "Dubai Mega City Drone & Travel Experience",
        category: "Luxury",
        mediaType: "video",
        url: "https://www.youtube.com/embed/IdejM6wCkxA",
        thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        destination: "Dubai",
        description: "Exploring futuristic architecture, deserts, and luxury shopping.",
      },
      {
        title: "Switzerland Scenic Alpine Rail Experience",
        category: "Mountains",
        mediaType: "video",
        url: "https://www.youtube.com/embed/linlz7-697E",
        thumbnail: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
        destination: "Switzerland",
        description: "Journey through the Swiss Alps on panoramic train lines.",
      },
    ]);

    console.log(`Gallery items created: ${galleryItems.length}`);

    // 6. Create Initial Sample Bookings for User
    const sampleBookings = await Booking.insertMany([
      {
        user: standardUser._id,
        bookingType: "package",
        package: packages[0]._id, // Goa package
        hotel: hotelGoa._id,
        travelers: 2,
        travelDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
        contactName: "Dhruvi Patel",
        contactEmail: "user@travelvista.com",
        contactPhone: "+91 98765 12345",
        specialRequests: "Sea facing room requested, vegetarian breakfast",
        totalAmount: 29998,
        paymentStatus: "paid",
        status: "confirmed",
      },
      {
        user: standardUser._id,
        bookingType: "hotel",
        hotel: hotelManali._id,
        travelers: 1,
        travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        checkOut: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000),
        contactName: "Dhruvi Patel",
        contactEmail: "user@travelvista.com",
        contactPhone: "+91 98765 12345",
        specialRequests: "Heated room preferred",
        totalAmount: 19500,
        paymentStatus: "paid",
        status: "confirmed",
      },
    ]);

    console.log(`Sample bookings created: ${sampleBookings.length}`);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

seedDatabase();
