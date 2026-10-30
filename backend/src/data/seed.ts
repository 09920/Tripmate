import { Destination } from '../types';

export const seedDestinations = (): Destination[] => {
  return [
    {
      id: "dest_1",
      name: "Munnar",
      state: "Kerala",
      description: "A tranquil hill station in Kerala famous for its endless tea estates, misty hills, and cool climate.",
      categories: ["Nature", "Mountains"],
      interests: ["Nature", "Photography", "Relaxation"],
      best_season: ["Winter", "Monsoon", "Autumn"],
      facilities: ["Hotels", "Resorts", "Local Transport"],
      estimated_budget_min: 8000,
      estimated_budget_max: 20000,
      recommended_duration_min: 3,
      recommended_duration_max: 5,
      traveller_types: ["Couple", "Family", "Friends"],
      rating: 4.8,
      latitude: 10.0889,
      longitude: 77.0595,
      image: "https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg",
      nearby_places: [
        { name: "Eravikulam National Park", distance_km: 10, category: "Nature", image: "https://images.pexels.com/photos/10323380/pexels-photo-10323380.jpeg" }
      ],
      things_to_do: ["Tea Estate Tour", "Trekking", "Wildlife Spotting"],
      how_to_reach: [
        { mode: "Flight", description: "Nearest airport is Cochin International Airport (110 km)." },
        { mode: "Car", description: "Scenic drive from Kochi or Coimbatore." }
      ],
      stay_options: [
        { name: "Tea Valley Resort", type: "Resort", budget_level: "Medium", description: "Nestled in the middle of a tea estate." }
      ],
      restaurant_options: [
        { name: "Rapsy Restaurant", cuisine: "Kerala, Multi-cuisine", description: "Famous for local Kerala parotta and beef curry." }
      ]
    },
    {
      id: "dest_2",
      name: "Goa",
      state: "Goa",
      description: "India's pocket-sized paradise, known for its pristine beaches, vibrant nightlife, and Portuguese heritage.",
      categories: ["Beaches", "Adventure"],
      interests: ["Beaches", "Nightlife", "Water Sports", "Historical"],
      best_season: ["Winter", "Autumn"],
      facilities: ["Flights", "Trains", "Car Rentals", "Luxury Stays"],
      estimated_budget_min: 10000,
      estimated_budget_max: 30000,
      recommended_duration_min: 4,
      recommended_duration_max: 7,
      traveller_types: ["Friends", "Couple", "College Group", "Solo"],
      rating: 4.7,
      latitude: 15.2993,
      longitude: 74.1240,
      image: "/images/Goa.jpeg",
      nearby_places: [
        { name: "Dudhsagar Waterfalls", distance_km: 60, category: "Waterfalls", image: "https://images.pexels.com/photos/15183389/pexels-photo-15183389.jpeg" }
      ],
      things_to_do: ["Beach Hopping", "Scuba Diving", "Clubbing", "Visiting Old Goa Churches"],
      how_to_reach: [
        { mode: "Flight", description: "Dabolim and Mopa International Airports." },
        { mode: "Train", description: "Madgaon and Thivim railway stations are well connected." }
      ],
      stay_options: [
        { name: "Baga Beach Resort", type: "Resort", budget_level: "High", description: "Luxury stay right on the beach." },
        { name: "Zostel Goa", type: "Hostel", budget_level: "Low", description: "Vibrant backpacker hostel." }
      ],
      restaurant_options: [
        { name: "Britto's", cuisine: "Seafood, Goan", description: "Iconic beach shack offering legendary seafood." }
      ]
    },
    {
      id: "dest_3",
      name: "Manali",
      state: "Himachal Pradesh",
      description: "High-altitude Himalayan resort town known for snow-capped peaks and adventure sports.",
      categories: ["Mountains", "Adventure", "Nature"],
      interests: ["Snow", "Trekking", "Paragliding", "Camping"],
      best_season: ["Summer", "Winter"],
      facilities: ["Hotels", "Adventure Guides", "Buses"],
      estimated_budget_min: 7000,
      estimated_budget_max: 25000,
      recommended_duration_min: 4,
      recommended_duration_max: 8,
      traveller_types: ["Friends", "Couple", "College Group", "Solo"],
      rating: 4.6,
      latitude: 32.2396,
      longitude: 77.1887,
      image: "/images/Manali.jpg",
      nearby_places: [
        { name: "Rohtang Pass", distance_km: 51, category: "Mountains", image: "https://images.pexels.com/photos/5405596/pexels-photo-5405596.jpeg" }
      ],
      things_to_do: ["Skiing", "Paragliding in Solang", "River Rafting"],
      how_to_reach: [
        { mode: "Bus", description: "Overnight Volvo buses from Delhi and Chandigarh." },
        { mode: "Flight", description: "Nearest airport is Bhuntar (50 km)." }
      ],
      stay_options: [
        { name: "Snow Valley Resorts", type: "Resort", budget_level: "Medium", description: "Comfortable stay with valley views." }
      ],
      restaurant_options: [
        { name: "Johnson's Cafe", cuisine: "Continental, Italian", description: "Famous for trout fish and cozy ambiance." }
      ]
    },
    {
      id: "dest_4",
      name: "Udaipur",
      state: "Rajasthan",
      description: "The City of Lakes, celebrated for its majestic palaces, artificial lakes, and rich Rajput history.",
      categories: ["Historical", "Nature"],
      interests: ["Culture", "Architecture", "Photography", "Luxury"],
      best_season: ["Winter", "Autumn"],
      facilities: ["Heritage Hotels", "Guided Tours", "Cabs"],
      estimated_budget_min: 12000,
      estimated_budget_max: 40000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Couple", "Family", "Solo"],
      rating: 4.9,
      latitude: 24.5854,
      longitude: 73.7125,
      image: "/images/Udaipur.jpg",
      nearby_places: [
        { name: "Kumbhalgarh Fort", distance_km: 84, category: "Historical", image: "https://images.pexels.com/photos/15980091/pexels-photo-15980091.jpeg" }
      ],
      things_to_do: ["Boat Ride on Lake Pichola", "Visit City Palace", "Shopping at Hathi Pol"],
      how_to_reach: [
        { mode: "Flight", description: "Maharana Pratap Airport is well connected." },
        { mode: "Train", description: "Udaipur City Railway Station." }
      ],
      stay_options: [
        { name: "Taj Lake Palace", type: "Heritage Resort", budget_level: "High", description: "Floating marble palace offering unmatched luxury." }
      ],
      restaurant_options: [
        { name: "Ambrai", cuisine: "North Indian, Rajasthani", description: "Lakeside dining with a view of the City Palace." }
      ]
    },
    {
      id: "dest_5",
      name: "Rishikesh",
      state: "Uttarakhand",
      description: "The Yoga Capital of the World, offering a perfect blend of spirituality and extreme adventure.",
      categories: ["Adventure", "Nature", "Historical"],
      interests: ["River Rafting", "Yoga", "Spirituality", "Camping"],
      best_season: ["Spring", "Autumn", "Winter"],
      facilities: ["Ashrams", "Camps", "Rafting Operators"],
      estimated_budget_min: 4000,
      estimated_budget_max: 12000,
      recommended_duration_min: 2,
      recommended_duration_max: 5,
      traveller_types: ["Friends", "Solo", "College Group", "Family"],
      rating: 4.5,
      latitude: 30.0869,
      longitude: 78.2676,
      image: "/images/Rishikesh.jpeg",
      nearby_places: [
        { name: "Haridwar", distance_km: 20, category: "Historical", image: "https://images.pexels.com/photos/7983638/pexels-photo-7983638.jpeg" }
      ],
      things_to_do: ["White Water Rafting", "Bungee Jumping", "Ganga Aarti at Triveni Ghat"],
      how_to_reach: [
        { mode: "Train", description: "Haridwar Railway Station is nearby." },
        { mode: "Flight", description: "Jolly Grant Airport in Dehradun." }
      ],
      stay_options: [
        { name: "Ganga Kinare", type: "Hotel", budget_level: "Medium", description: "Riverside hotel with private ghat." },
        { name: "Shivpuri Camps", type: "Camp", budget_level: "Low", description: "Adventure camping by the river." }
      ],
      restaurant_options: [
        { name: "Chotiwala", cuisine: "North Indian Vegetarian", description: "Iconic vegetarian thalis." }
      ]
    },
    {
      id: "dest_6",
      name: "Mahabaleshwar",
      state: "Maharashtra",
      description: "A popular hill station in the Western Ghats known for strawberries, viewpoints, and evergreen forests.",
      categories: ["Mountains", "Nature", "Waterfalls"],
      interests: ["Photography", "Relaxation", "Trekking"],
      best_season: ["Monsoon", "Winter", "Summer"],
      facilities: ["Hotels", "Strawberry Farms", "Taxis"],
      estimated_budget_min: 5000,
      estimated_budget_max: 15000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Family", "Couple", "Friends"],
      rating: 4.4,
      latitude: 17.9307,
      longitude: 73.6477,
      image: "/images/Mahabaleshwar.jpg",
      nearby_places: [
        { name: "Pratapgad Fort", distance_km: 24, category: "Historical", image: "https://images.pexels.com/photos/15980091/pexels-photo-15980091.jpeg" },
        { name: "Lingmala Waterfall", distance_km: 6, category: "Waterfalls", image: "https://images.pexels.com/photos/13364969/pexels-photo-13364969.jpeg" }
      ],
      things_to_do: ["Boating at Venna Lake", "Strawberry Picking", "Viewpoint Hopping"],
      how_to_reach: [
        { mode: "Car", description: "Scenic drive from Mumbai (260 km) or Pune (120 km)." },
        { mode: "Bus", description: "Direct state and private buses available." }
      ],
      stay_options: [
        { name: "Le Meridien", type: "Resort", budget_level: "High", description: "Luxury resort nestled in forests." }
      ],
      restaurant_options: [
        { name: "Mapro Garden", cuisine: "Desserts, Fast Food", description: "Famous for strawberry cream and grilled sandwiches." }
      ]
    },
    {
      id: "dest_7",
      name: "Andaman Islands",
      state: "Andaman and Nicobar Islands",
      description: "An archipelago in the Bay of Bengal, famous for crystal clear waters, coral reefs, and white-sand beaches.",
      categories: ["Beaches", "Nature", "Adventure"],
      interests: ["Scuba Diving", "Beaches", "Relaxation", "Water Sports"],
      best_season: ["Winter", "Spring"],
      facilities: ["Ferries", "Resorts", "Dive Centers"],
      estimated_budget_min: 25000,
      estimated_budget_max: 60000,
      recommended_duration_min: 5,
      recommended_duration_max: 10,
      traveller_types: ["Couple", "Family"],
      rating: 4.9,
      latitude: 11.7401,
      longitude: 92.6586,
      image: "https://images.pexels.com/photos/3601456/pexels-photo-3601456.jpeg",
      nearby_places: [
        { name: "Havelock Island", distance_km: 70, category: "Beaches", image: "https://images.pexels.com/photos/1842340/pexels-photo-1842340.jpeg" }
      ],
      things_to_do: ["Scuba Diving", "Cellular Jail Tour", "Relaxing on Radhanagar Beach"],
      how_to_reach: [
        { mode: "Flight", description: "Direct flights to Port Blair from major Indian cities." },
        { mode: "Ship", description: "Passenger ships from Chennai and Kolkata (takes 3-4 days)." }
      ],
      stay_options: [
        { name: "Taj Exotica Resort & Spa", type: "Resort", budget_level: "High", description: "Eco-friendly luxury resort on Radhanagar beach." }
      ],
      restaurant_options: [
        { name: "Something Different", cuisine: "Seafood, Continental", description: "Beachside dining at Havelock." }
      ]
    },
    {
      id: "dest_8",
      name: "Hampi",
      state: "Karnataka",
      description: "A UNESCO World Heritage site known for its ruins, stunning boulder-strewn landscapes, and ancient temples.",
      categories: ["Historical", "Nature"],
      interests: ["Architecture", "Photography", "Backpacking", "Bouldering"],
      best_season: ["Winter"],
      facilities: ["Guesthouses", "Bicycles", "Guides"],
      estimated_budget_min: 5000,
      estimated_budget_max: 12000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Solo", "Friends", "College Group"],
      rating: 4.7,
      latitude: 15.3350,
      longitude: 76.4600,
      image: "/images/Hampi.jpg",
      nearby_places: [
        { name: "Tungabhadra Dam", distance_km: 16, category: "Nature", image: "https://images.pexels.com/photos/2085351/pexels-photo-2085351.jpeg" }
      ],
      things_to_do: ["Explore Ruined Temples", "Coracle Ride", "Watch Sunset from Matanga Hill"],
      how_to_reach: [
        { mode: "Train", description: "Nearest railway station is Hospet (13 km)." },
        { mode: "Bus", description: "Overnight buses from Bangalore or Hyderabad." }
      ],
      stay_options: [
        { name: "Gopi Guesthouse", type: "Guesthouse", budget_level: "Low", description: "Comfortable budget stay near Virupaksha Temple." }
      ],
      restaurant_options: [
        { name: "Mango Tree", cuisine: "Indian, Continental", description: "Relaxed floor-seating restaurant under a canopy." }
      ]
    },
    {
      id: "dest_9",
      name: "Meghalaya",
      state: "Meghalaya",
      description: "The abode of clouds, famous for living root bridges, stunning waterfalls, and lush green landscapes.",
      categories: ["Nature", "Waterfalls", "Mountains", "Adventure"],
      interests: ["Trekking", "Nature", "Caving"],
      best_season: ["Autumn", "Winter", "Spring"],
      facilities: ["Homestays", "Taxis", "Guides"],
      estimated_budget_min: 15000,
      estimated_budget_max: 30000,
      recommended_duration_min: 5,
      recommended_duration_max: 8,
      traveller_types: ["Friends", "Couple", "Solo", "Adventure"],
      rating: 4.8,
      latitude: 25.4670,
      longitude: 91.3662,
      image: "/images/Meghalaya.jpg",
      nearby_places: [
        { name: "Cherrapunji", distance_km: 50, category: "Waterfalls", image: "https://images.pexels.com/photos/3052827/pexels-photo-3052827.jpeg" }
      ],
      things_to_do: ["Double Decker Root Bridge Trek", "Dawki River Boating", "Explore Mawsmai Caves"],
      how_to_reach: [
        { mode: "Flight", description: "Fly to Guwahati and take a cab to Shillong (3 hours)." },
        { mode: "Car", description: "Road trip from Guwahati." }
      ],
      stay_options: [
        { name: "Ri Kynjai", type: "Resort", budget_level: "High", description: "Luxury resort inspired by traditional Khasi architecture." }
      ],
      restaurant_options: [
        { name: "ML 05 Cafe", cuisine: "Cafe, Continental", description: "Biker-themed cafe on the way to Cherrapunji." }
      ]
    },
    {
      id: "dest_10",
      name: "Coorg",
      state: "Karnataka",
      description: "Known as the Scotland of India, Coorg is famous for its coffee plantations, steep hills, and rich Kodava culture.",
      categories: ["Nature", "Mountains", "Waterfalls"],
      interests: ["Coffee", "Relaxation", "Nature Walks", "Trekking"],
      best_season: ["Winter", "Monsoon"],
      facilities: ["Homestays", "Resorts", "Plantation Tours"],
      estimated_budget_min: 8000,
      estimated_budget_max: 20000,
      recommended_duration_min: 3,
      recommended_duration_max: 5,
      traveller_types: ["Couple", "Family", "Friends"],
      rating: 4.6,
      latitude: 12.3375,
      longitude: 75.8069,
      image: "/images/Coorg.jpg",
      nearby_places: [
        { name: "Abbey Falls", distance_km: 8, category: "Waterfalls", image: "https://images.pexels.com/photos/2085351/pexels-photo-2085351.jpeg" }
      ],
      things_to_do: ["Coffee Plantation Tour", "Visit Elephant Camp", "Trek to Tadiandamol"],
      how_to_reach: [
        { mode: "Car", description: "5-6 hours drive from Bangalore." },
        { mode: "Bus", description: "KSRTC buses from major cities in Karnataka." }
      ],
      stay_options: [
        { name: "Evolve Back", type: "Resort", budget_level: "High", description: "Luxurious plantation resort." }
      ],
      restaurant_options: [
        { name: "Coorg Cuisine", cuisine: "Kodava, Indian", description: "Authentic local food like Pandi Curry." }
      ]
    },
    {
      id: "dest_11",
      name: "Spiti Valley",
      state: "Himachal Pradesh",
      description: "A cold desert mountain valley nestled high in the Himalayas, renowned for its ancient Tibetan monasteries, rugged terrain, and stargazing.",
      categories: ["Mountains", "Adventure", "Camping", "Nature"],
      interests: ["Trekking", "Camping", "Photography", "Stargazing", "Monasteries"],
      best_season: ["Summer", "Autumn"],
      facilities: ["Homestays", "Campsites", "Local Buses", "Guides"],
      estimated_budget_min: 12000,
      estimated_budget_max: 28000,
      recommended_duration_min: 5,
      recommended_duration_max: 9,
      traveller_types: ["Adventure", "Solo", "Friends", "College Group"],
      rating: 4.8,
      latitude: 32.2461,
      longitude: 78.0349,
      image: "/images/Spiti.jpg",
      nearby_places: [
        { name: "Chandratal Lake", distance_km: 70, category: "Camping", image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg" }
      ],
      things_to_do: ["Visit Key Monastery", "Camp at Chandratal", "Fossil Hunting in Langza", "Drive through Kunzum Pass"],
      how_to_reach: [
        { mode: "Road", description: "Scenic road trip via Manali through Atal Tunnel or via Shimla." }
      ],
      stay_options: [
        { name: "Kaza Homestay", type: "Homestay", budget_level: "Low", description: "Authentic Spitian hospitality with local food." }
      ],
      restaurant_options: [
        { name: "The Himalayan Cafe", cuisine: "Tibetan, Continental", description: "Cozy hangout famous for momos and seabuckthorn tea." }
      ]
    },
    {
      id: "dest_12",
      name: "Tawang",
      state: "Arunachal Pradesh",
      description: "High-altitude Himalayan haven in Arunachal Pradesh celebrated for India's largest monastery, alpine lakes, and dramatic snowy passes.",
      categories: ["Mountains", "Nature", "Adventure"],
      interests: ["Monasteries", "Nature", "Culture", "Photography", "Snow"],
      best_season: ["Spring", "Autumn", "Summer"],
      facilities: ["Hotels", "Homestays", "Taxi Services", "Permit Assistance"],
      estimated_budget_min: 14000,
      estimated_budget_max: 32000,
      recommended_duration_min: 4,
      recommended_duration_max: 7,
      traveller_types: ["Friends", "Couple", "Solo", "Family"],
      rating: 4.7,
      latitude: 27.5861,
      longitude: 91.8594,
      image: "/images/Tawang.JPG",
      nearby_places: [
        { name: "Sela Pass", distance_km: 72, category: "Mountains", image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg" }
      ],
      things_to_do: ["Explore Tawang Monastery", "Visit Madhuri Lake", "Cross Sela Pass", "Nuranang Waterfall Visit"],
      how_to_reach: [
        { mode: "Car", description: "Drive from Tezpur or Guwahati via Bomdila." },
        { mode: "Helicopter", description: "Helicopter services from Guwahati depending on weather." }
      ],
      stay_options: [
        { name: "Hotel Denzong", type: "Hotel", budget_level: "Medium", description: "Comfortable rooms with panoramic views of the Tawang valley." }
      ],
      restaurant_options: [
        { name: "Dragon Restaurant", cuisine: "Tibetan, Monpa", description: "Known for hot Thukpa and traditional butter tea." }
      ]
    },
    {
      id: "dest_13",
      name: "Ziro Valley",
      state: "Arunachal Pradesh",
      description: "A picturesque pine-clad plateau home to the Apatani tribe, famous for paddy-cum-pisciculture farming, vibrant culture, and music festivals.",
      categories: ["Nature", "Mountains", "Camping"],
      interests: ["Culture", "Camping", "Music", "Nature Walks", "Trekking"],
      best_season: ["Spring", "Autumn", "Summer"],
      facilities: ["Homestays", "Campsites", "Local Guides"],
      estimated_budget_min: 10000,
      estimated_budget_max: 24000,
      recommended_duration_min: 3,
      recommended_duration_max: 6,
      traveller_types: ["Friends", "Solo", "College Group", "Adventure"],
      rating: 4.6,
      latitude: 27.5950,
      longitude: 93.8385,
      image: "/images/Ziro-Valley.jpg",
      nearby_places: [
        { name: "Talley Valley Wildlife Sanctuary", distance_km: 30, category: "Nature", image: "https://images.pexels.com/photos/10323380/pexels-photo-10323380.jpeg" }
      ],
      things_to_do: ["Explore Apatani Villages", "Camp at Ziro Festival Grounds", "Hike through Pine Groves", "Visit Tarin Fish Farm"],
      how_to_reach: [
        { mode: "Train", description: "Nearest railway station is Naharlagun (100 km)." },
        { mode: "Car", description: "Taxi from Guwahati or Jorhat." }
      ],
      stay_options: [
        { name: "Siiro Resort", type: "Resort", budget_level: "Medium", description: "Wooden cottages set amidst green pine forests." }
      ],
      restaurant_options: [
        { name: "A&C Kitchen", cuisine: "Tribal, North Eastern", description: "Authentic smoked pork and bamboo shoot delicacies." }
      ]
    },
    {
      id: "dest_14",
      name: "Gokarna",
      state: "Karnataka",
      description: "A tranquil coastal town in Karnataka blending spiritual temple heritage with pristine, laid-back crescent beaches and cliff treks.",
      categories: ["Beaches", "Nature", "Adventure"],
      interests: ["Beaches", "Cliff Trekking", "Yoga", "Water Sports", "Relaxation"],
      best_season: ["Winter", "Autumn", "Spring"],
      facilities: ["Beach Shacks", "Hostels", "Resorts", "Bike Rentals"],
      estimated_budget_min: 6000,
      estimated_budget_max: 18000,
      recommended_duration_min: 3,
      recommended_duration_max: 5,
      traveller_types: ["Solo", "Friends", "Couple", "College Group"],
      rating: 4.7,
      latitude: 14.5479,
      longitude: 74.3188,
      image: "/images/Gokarna.jpeg",
      nearby_places: [
        { name: "Yana Caves", distance_km: 50, category: "Adventure", image: "https://images.pexels.com/photos/5211910/pexels-photo-5211910.jpeg" }
      ],
      things_to_do: ["Five Beach Trek", "Sunset at Om Beach", "Visit Mahabaleshwar Temple", "Kayaking and Beach Camping"],
      how_to_reach: [
        { mode: "Train", description: "Gokarna Road Railway Station is 9 km from town." },
        { mode: "Bus", description: "Overnight sleeper buses from Bangalore and Goa." }
      ],
      stay_options: [
        { name: "Namaste Cafe", type: "Beach Resort", budget_level: "Medium", description: "Iconic stay right on Om Beach." }
      ],
      restaurant_options: [
        { name: "Chez Christophe", cuisine: "French, Continental, Seafood", description: "Artisan bakery and beachside dining on Middle Beach." }
      ]
    },
    {
      id: "dest_15",
      name: "Chikmagalur",
      state: "Karnataka",
      description: "The birthplace of Indian coffee, surrounded by misty peaks of the Western Ghats, gushing waterfalls, and lush aromatic estates.",
      categories: ["Mountains", "Nature", "Waterfalls"],
      interests: ["Coffee", "Trekking", "Waterfalls", "Nature Walks", "Relaxation"],
      best_season: ["Monsoon", "Winter", "Autumn"],
      facilities: ["Plantation Homestays", "Luxury Resorts", "Cabs"],
      estimated_budget_min: 7000,
      estimated_budget_max: 20000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Family", "Friends", "Couple"],
      rating: 4.6,
      latitude: 13.3161,
      longitude: 75.7720,
      image: "/images/Chikmagalur.jpg",
      nearby_places: [
        { name: "Hebbe Falls", distance_km: 65, category: "Waterfalls", image: "https://images.pexels.com/photos/13364969/pexels-photo-13364969.jpeg" }
      ],
      things_to_do: ["Trek Mullayanagiri Peak", "Coffee Estate Walk", "Visit Jhari Waterfalls", "Explore Baba Budangiri"],
      how_to_reach: [
        { mode: "Car", description: "4-5 hours scenic drive from Bangalore (245 km)." },
        { mode: "Train", description: "Nearest major station is Kadur (40 km)." }
      ],
      stay_options: [
        { name: "The Serai Chikmagalur", type: "Luxury Resort", budget_level: "High", description: "Villas nestled amidst coffee plantations." }
      ],
      restaurant_options: [
        { name: "Town Canteen", cuisine: "South Indian", description: "Legendary spot famous for Benne Dosa and filter coffee." }
      ]
    },
    {
      id: "dest_16",
      name: "Varkala",
      state: "Kerala",
      description: "A coastal gem where dramatic red laterite cliffs overlook the Arabian Sea, featuring natural mineral springs and serene sunsets.",
      categories: ["Beaches", "Nature", "Adventure"],
      interests: ["Beaches", "Surfing", "Ayurveda", "Cliff Walks", "Sunset"],
      best_season: ["Winter", "Autumn", "Spring"],
      facilities: ["Cliffside Cafes", "Ayurveda Centers", "Resorts", "Surf Schools"],
      estimated_budget_min: 8000,
      estimated_budget_max: 22000,
      recommended_duration_min: 3,
      recommended_duration_max: 5,
      traveller_types: ["Couple", "Solo", "Friends"],
      rating: 4.7,
      latitude: 8.7379,
      longitude: 76.7163,
      image: "/images/Varkala.jpg",
      nearby_places: [
        { name: "Jatayu Earth's Center", distance_km: 28, category: "Adventure", image: "https://images.pexels.com/photos/15980091/pexels-photo-15980091.jpeg" }
      ],
      things_to_do: ["Cliff Promenade Walk", "Surfing at Black Beach", "Visit Janardhana Swamy Temple", "Kaponil Water Sports"],
      how_to_reach: [
        { mode: "Train", description: "Varkala Sivagiri Railway Station connects to major cities." },
        { mode: "Flight", description: "Trivandrum International Airport (45 km)." }
      ],
      stay_options: [
        { name: "Clafouti Beach Resort", type: "Resort", budget_level: "Medium", description: "Cliff-edge resort with sea-facing balconies." }
      ],
      restaurant_options: [
        { name: "Cafe del Mar", cuisine: "Seafood, Continental, Kerala", description: "Panoramic cliff views with fresh seafood grill." }
      ]
    },
    {
      id: "dest_17",
      name: "Dhanushkodi",
      state: "Tamil Nadu",
      description: "A ghost town on Pamban Island where the Bay of Bengal meets the Indian Ocean, surrounded by myth, history, and stark natural beauty.",
      categories: ["Beaches", "Historical", "Nature"],
      interests: ["History", "Beaches", "Photography", "Mythology", "Coastal Drive"],
      best_season: ["Winter", "Autumn"],
      facilities: ["Day Cabs", "Buses from Rameswaram", "Local Stalls"],
      estimated_budget_min: 5000,
      estimated_budget_max: 14000,
      recommended_duration_min: 2,
      recommended_duration_max: 3,
      traveller_types: ["Solo", "Friends", "Family"],
      rating: 4.5,
      latitude: 9.1770,
      longitude: 79.4180,
      image: "/images/Dhanushkodi.jpeg",
      nearby_places: [
        { name: "Ramanathaswamy Temple", distance_km: 20, category: "Historical", image: "https://images.pexels.com/photos/5211910/pexels-photo-5211910.jpeg" }
      ],
      things_to_do: ["Visit Old Church & Railway Station Ruins", "Drive along Ram Setu Viewpoint", "Watch Two Oceans Confluence", "Cross Pamban Sea Bridge"],
      how_to_reach: [
        { mode: "Train", description: "Train to Rameswaram, followed by 20 km taxi or bus." },
        { mode: "Car", description: "Drive along the national highway straight to Arichal Munai." }
      ],
      stay_options: [
        { name: "Daiwik Hotels Rameswaram", type: "Hotel", budget_level: "Medium", description: "Comfortable base in Rameswaram for exploring Dhanushkodi." }
      ],
      restaurant_options: [
        { name: "Gujarat Bhavan Restaurant", cuisine: "South Indian, Gujarati", description: "Clean vegetarian meals and seafood shacks near the coast." }
      ]
    },
    {
      id: "dest_18",
      name: "Orchha",
      state: "Madhya Pradesh",
      description: "A timeless medieval town on the banks of Betwa River, adorned with grand Bundela palaces, chhatris, and towering temples.",
      categories: ["Historical", "Nature"],
      interests: ["Architecture", "History", "Photography", "River Rafting", "Culture"],
      best_season: ["Winter", "Autumn", "Spring"],
      facilities: ["Heritage Stays", "Guides", "Auto Rickshaws"],
      estimated_budget_min: 5000,
      estimated_budget_max: 15000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Solo", "Couple", "Family", "Friends"],
      rating: 4.6,
      latitude: 25.3512,
      longitude: 78.6416,
      image: "/images/Orchha.jpg",
      nearby_places: [
        { name: "Jhansi Fort", distance_km: 18, category: "Historical", image: "https://images.pexels.com/photos/15980091/pexels-photo-15980091.jpeg" }
      ],
      things_to_do: ["Explore Orchha Fort Complex", "Sunset at Royal Chhatris", "River Rafting in Betwa", "Attend Raja Ram Temple Aarti"],
      how_to_reach: [
        { mode: "Train", description: "Nearest major junction is Jhansi (15 km)." },
        { mode: "Car", description: "Road trip from Gwalior (120 km) or Khajuraho (170 km)." }
      ],
      stay_options: [
        { name: "Orchha Palace Hotel & Convention Centre", type: "Heritage Resort", budget_level: "High", description: "Royal architecture and modern amenities." }
      ],
      restaurant_options: [
        { name: "Ramraja Restaurant", cuisine: "Indian, Continental", description: "Rooftop dining overlooking the fort towers." }
      ]
    },
    {
      id: "dest_19",
      name: "Chopta",
      state: "Uttarakhand",
      description: "Known as the Mini Switzerland of Uttarakhand, an untouched meadow paradise offering views of snow peaks and treks to high shrines.",
      categories: ["Mountains", "Adventure", "Camping", "Nature"],
      interests: ["Trekking", "Camping", "Bird Watching", "Snow", "Photography"],
      best_season: ["Spring", "Summer", "Autumn", "Winter"],
      facilities: ["Eco Camps", "Guesthouses", "Trekking Guides"],
      estimated_budget_min: 6000,
      estimated_budget_max: 16000,
      recommended_duration_min: 3,
      recommended_duration_max: 5,
      traveller_types: ["Friends", "Solo", "Adventure", "Couple"],
      rating: 4.8,
      latitude: 30.4878,
      longitude: 79.1764,
      image: "/images/Chopta.jpg",
      nearby_places: [
        { name: "Tungnath Temple", distance_km: 4, category: "Adventure", image: "https://images.pexels.com/photos/15024479/pexels-photo-15024479.jpeg" }
      ],
      things_to_do: ["Trek to Tungnath & Chandrashila", "Camping in Baniyakund Meadows", "Birdwatching in Kedarnath Sanctuary", "Sunrise Over Himalayan Peaks"],
      how_to_reach: [
        { mode: "Car", description: "Drive from Rishikesh or Haridwar (200 km)." },
        { mode: "Train", description: "Nearest railway station is Rishikesh/Haridwar." }
      ],
      stay_options: [
        { name: "Chopta Meadows Heritage Camp", type: "Camp", budget_level: "Medium", description: "Swiss alpine tents set against panoramic peaks." }
      ],
      restaurant_options: [
        { name: "Chauhan Dhabha", cuisine: "Garhwali, North Indian", description: "Homely hot parathas, dal, and ginger lemon tea." }
      ]
    },
    {
      id: "dest_20",
      name: "Sandakphu",
      state: "West Bengal",
      description: "The highest peak in West Bengal, renowned for the legendary Sleeping Buddha panoramic view of four of the world's five highest peaks.",
      categories: ["Mountains", "Adventure", "Nature", "Camping"],
      interests: ["Trekking", "Mountains", "Camping", "Photography", "Sunrises"],
      best_season: ["Autumn", "Spring", "Winter"],
      facilities: ["Trekkers Huts", "Vintage Land Rovers", "Homestays"],
      estimated_budget_min: 9000,
      estimated_budget_max: 22000,
      recommended_duration_min: 4,
      recommended_duration_max: 7,
      traveller_types: ["Adventure", "Friends", "Solo", "College Group"],
      rating: 4.7,
      latitude: 27.1064,
      longitude: 88.0016,
      image: "/images/Sandakphu.jpg",
      nearby_places: [
        { name: "Singalila National Park", distance_km: 15, category: "Nature", image: "https://images.pexels.com/photos/10323380/pexels-photo-10323380.jpeg" }
      ],
      things_to_do: ["Singalila Ridge Trek", "Gaze at the Sleeping Buddha (Kanchenjunga)", "Vintage 1950s Land Rover Safari", "Rhododendron Forest Walk"],
      how_to_reach: [
        { mode: "Train", description: "Nearest railway station is New Jalpaiguri (NJP) (120 km to base at Manebhanjan)." },
        { mode: "Flight", description: "Bagdogra Airport (IXB)." }
      ],
      stay_options: [
        { name: "Sherpa Chalet Lodge", type: "Lodge", budget_level: "Medium", description: "Iconic lodge atop the ridge with front-row sunrise views." }
      ],
      restaurant_options: [
        { name: "Manebhanjan Cafe", cuisine: "Nepali, Tibetan, Tea", description: "Hot momos, noodles, and authentic Darjeeling tea." }
      ]
    },
    {
      id: "dest_21",
      name: "Ajanta Caves",
      state: "Maharashtra",
      description: "Ancient rock-cut Buddhist cave monuments dating from the 2nd century BCE, renowned for exquisite murals, frescoes, and Buddhist architecture.",
      categories: ["Historical"],
      interests: ["History", "Architecture", "Art", "Photography", "Culture"],
      best_season: ["Winter", "Monsoon", "Autumn"],
      facilities: ["Audio Guides", "Electric Buses", "Visitor Center", "Hotels"],
      estimated_budget_min: 4000,
      estimated_budget_max: 12000,
      recommended_duration_min: 1,
      recommended_duration_max: 2,
      traveller_types: ["Solo", "Family", "Couple", "Friends"],
      rating: 4.7,
      latitude: 20.5519,
      longitude: 75.7033,
      image: "/images/Ajanta.jpeg",
      nearby_places: [
        { name: "Ellora Caves", distance_km: 100, category: "Historical", image: "/images/Ellora.jpeg" }
      ],
      things_to_do: ["Explore Cave Murals", "Viewpoint Panoramic Trek", "Visit Kailasha Art Gallery"],
      how_to_reach: [
        { mode: "Train", description: "Jalgaon Railway Station (60 km) or Chhatrapati Sambhajinagar (100 km)." },
        { mode: "Bus", description: "Regular MSRTC buses from Aurangabad/Jalgaon." }
      ],
      stay_options: [
        { name: "MTDC Resort Fardapur", type: "Resort", budget_level: "Medium", description: "Conveniently located near the caves entrance." }
      ],
      restaurant_options: [
        { name: "MTDC Restaurant", cuisine: "Maharashtrian, North Indian", description: "Fresh thalis and local cuisine." }
      ]
    },
    {
      id: "dest_22",
      name: "Amritsar",
      state: "Punjab",
      description: "The spiritual and cultural center of the Sikh community, home to the glorious Golden Temple, historic Jallianwala Bagh, and vibrant Punjabi culinary culture.",
      categories: ["Historical"],
      interests: ["Spirituality", "History", "Food", "Architecture", "Culture"],
      best_season: ["Winter", "Autumn", "Spring"],
      facilities: ["Hotels", "Cabs", "Free Langar", "Guided Tours"],
      estimated_budget_min: 5000,
      estimated_budget_max: 15000,
      recommended_duration_min: 2,
      recommended_duration_max: 3,
      traveller_types: ["Family", "Couple", "Solo", "Friends"],
      rating: 4.9,
      latitude: 31.6200,
      longitude: 74.8765,
      image: "/images/Amritsar.jpg",
      nearby_places: [
        { name: "Wagah Border", distance_km: 30, category: "Historical", image: "/images/Amritsar.jpg" }
      ],
      things_to_do: ["Visit Golden Temple", "Langar Seva", "Wagah Border Beating Retreat Ceremony", "Explore Jallianwala Bagh"],
      how_to_reach: [
        { mode: "Flight", description: "Sri Guru Ram Dass Jee International Airport." },
        { mode: "Train", description: "Amritsar Junction connects across India." }
      ],
      stay_options: [
        { name: "Hyatt Regency Amritsar", type: "Hotel", budget_level: "High", description: "Luxury stay close to the Golden Temple." }
      ],
      restaurant_options: [
        { name: "Kesar Da Dhaba", cuisine: "Punjabi", description: "Legendary dal makhani, lachha parathas, and phirni." }
      ]
    },
    {
      id: "dest_23",
      name: "Badrinath",
      state: "Uttarakhand",
      description: "A sacred Char Dham Himalayan town dedicated to Lord Vishnu, cradled between the Nar and Narayana mountain ranges alongside the Alaknanda River.",
      categories: ["Mountains", "Nature"],
      interests: ["Spirituality", "Mountains", "Nature", "Trekking", "Hot Springs"],
      best_season: ["Summer", "Autumn"],
      facilities: ["Ashrams", "Guesthouses", "Hot Springs", "Medical Aid"],
      estimated_budget_min: 8000,
      estimated_budget_max: 20000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Family", "Solo", "Friends"],
      rating: 4.8,
      latitude: 30.7433,
      longitude: 79.4938,
      image: "/images/Badrinath.jpeg",
      nearby_places: [
        { name: "Mana Village", distance_km: 3, category: "Mountains", image: "/images/Badrinath.jpeg" }
      ],
      things_to_do: ["Visit Badrinath Temple", "Dip in Tapt Kund Hot Spring", "Visit Mana Last Indian Village", "Vasudhara Falls Trek"],
      how_to_reach: [
        { mode: "Car", description: "Scenic drive from Rishikesh via Joshimath." },
        { mode: "Helicopter", description: "Helicopter services from Dehradun." }
      ],
      stay_options: [
        { name: "Sarovar Portico Badrinath", type: "Hotel", budget_level: "High", description: "Premium stay with valley and temple views." }
      ],
      restaurant_options: [
        { name: "Saket Restaurant", cuisine: "Pure Vegetarian Indian", description: "Wholesome North and South Indian vegetarian food." }
      ]
    },
    {
      id: "dest_24",
      name: "Diu",
      state: "Dadra and Nagar Haveli and Daman and Diu",
      description: "A charming island town influenced by centuries of Portuguese rule, famous for its breezy seaside fortress, clean golden beaches, and calm coastal vibes.",
      categories: ["Beaches", "Historical"],
      interests: ["Beaches", "Architecture", "History", "Relaxation", "Water Sports"],
      best_season: ["Winter", "Autumn", "Spring"],
      facilities: ["Resorts", "Bike Rentals", "Beach Cafes"],
      estimated_budget_min: 6000,
      estimated_budget_max: 16000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Couple", "Friends", "Solo", "Family"],
      rating: 4.5,
      latitude: 20.7144,
      longitude: 70.9874,
      image: "/images/diu.jpg",
      nearby_places: [
        { name: "Naida Caves", distance_km: 3, category: "Historical", image: "/images/diu.jpg" }
      ],
      things_to_do: ["Explore Diu Fort", "Sunset at Nagoa Beach", "Walk inside Naida Caves", "Visit St. Paul's Church"],
      how_to_reach: [
        { mode: "Flight", description: "Diu Airport has flights from Mumbai." },
        { mode: "Train", description: "Veraval Railway Station (90 km)." }
      ],
      stay_options: [
        { name: "Radhika Beach Resort", type: "Resort", budget_level: "Medium", description: "Seaside resort on Nagoa Beach." }
      ],
      restaurant_options: [
        { name: "O'Coqueiro Restaurant", cuisine: "Portuguese, Seafood", description: "Charming garden cafe serving fresh seafood." }
      ]
    },
    {
      id: "dest_25",
      name: "Dudhsagar Falls",
      state: "Goa",
      description: "A majestic four-tiered waterfall on the Mandovi River resembling a 'Sea of Milk', rushing down through dense tropical forests of the Western Ghats.",
      categories: ["Waterfalls", "Nature", "Adventure"],
      interests: ["Waterfalls", "Trekking", "Jeep Safari", "Photography", "Nature"],
      best_season: ["Monsoon", "Autumn", "Winter"],
      facilities: ["Forest Jeep Safaris", "Guides", "Life Jackets"],
      estimated_budget_min: 3000,
      estimated_budget_max: 9000,
      recommended_duration_min: 1,
      recommended_duration_max: 2,
      traveller_types: ["Adventure", "Friends", "College Group", "Couple"],
      rating: 4.7,
      latitude: 15.3144,
      longitude: 74.3143,
      image: "/images/Dudhsagar.jpeg",
      nearby_places: [
        { name: "Bhagwan Mahaveer Sanctuary", distance_km: 5, category: "Nature", image: "/images/Dudhsagar.jpeg" }
      ],
      things_to_do: ["4x4 Jungle Jeep Safari", "Swim in the Natural Waterfall Pool", "Scenic Rail Bridge Trek", "Wildlife Spotting"],
      how_to_reach: [
        { mode: "Train", description: "Kulem Railway Station, followed by forest jeep." },
        { mode: "Car", description: "Drive to Kulem base camp from Panaji or Margao." }
      ],
      stay_options: [
        { name: "Dudhsagar Spa Resort", type: "Eco Resort", budget_level: "Medium", description: "Nature resort near the sanctuary base." }
      ],
      restaurant_options: [
        { name: "Jungle Cafe Kulem", cuisine: "Goan, Indian", description: "Local fish curry and thalis before the jungle trek." }
      ]
    },
    {
      id: "dest_26",
      name: "Ellora Caves",
      state: "Maharashtra",
      description: "A monumental UNESCO World Heritage complex featuring 34 rock-cut temples carved out of volcanic basalt, anchored by the monolithic Kailasa Temple.",
      categories: ["Historical"],
      interests: ["History", "Ancient Architecture", "Sculpture", "Photography"],
      best_season: ["Winter", "Monsoon", "Autumn"],
      facilities: ["Audio Guides", "Electric Buggies", "Visitor Center", "Hotels"],
      estimated_budget_min: 4000,
      estimated_budget_max: 12000,
      recommended_duration_min: 1,
      recommended_duration_max: 2,
      traveller_types: ["Solo", "Family", "Couple", "Friends"],
      rating: 4.8,
      latitude: 20.0268,
      longitude: 75.1780,
      image: "/images/Ellora.jpeg",
      nearby_places: [
        { name: "Daulatabad Fort", distance_km: 15, category: "Historical", image: "/images/Ellora.jpeg" }
      ],
      things_to_do: ["Marvel at Kailasa Temple (Cave 16)", "Explore Buddhist, Hindu and Jain Caves", "Visit Grishneshwar Jyotirlinga"],
      how_to_reach: [
        { mode: "Train", description: "Chhatrapati Sambhajinagar Railway Station (30 km)." },
        { mode: "Car", description: "Direct highway taxi from Aurangabad city." }
      ],
      stay_options: [
        { name: "Hotel Kailas", type: "Heritage Hotel", budget_level: "Medium", description: "Located right opposite the Ellora Caves entrance." }
      ],
      restaurant_options: [
        { name: "Kailas Restaurant", cuisine: "North Indian, Maharashtrian", description: "Courtyard dining with views of the caves." }
      ]
    },
    {
      id: "dest_27",
      name: "Jaisalmer",
      state: "Rajasthan",
      description: "The Golden City of the Thar Desert, distinguished by its yellow sandstone living fort, ornate merchant havelis, and undulating sand dunes.",
      categories: ["Historical", "Camping", "Adventure"],
      interests: ["Desert Camping", "Camel Safari", "History", "Folk Music", "Architecture"],
      best_season: ["Winter", "Autumn"],
      facilities: ["Desert Camps", "Heritage Havelis", "Camel Guides", "Jeep Safaris"],
      estimated_budget_min: 7000,
      estimated_budget_max: 22000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Friends", "Couple", "Solo", "Family"],
      rating: 4.8,
      latitude: 26.9157,
      longitude: 70.9083,
      image: "/images/Jaisalmer.jpeg",
      nearby_places: [
        { name: "Sam Sand Dunes", distance_km: 40, category: "Camping", image: "/images/Jaisalmer.jpeg" }
      ],
      things_to_do: ["Camp under Stars in Sam Dunes", "Explore Living Jaisalmer Fort", "Dune Bashing and Camel Safari", "Visit Patwon Ki Haveli"],
      how_to_reach: [
        { mode: "Train", description: "Jaisalmer Railway Station connects to Delhi and Jaipur." },
        { mode: "Flight", description: "Jaisalmer Airport operates seasonal flights." }
      ],
      stay_options: [
        { name: "Suryagarh Jaisalmer", type: "Luxury Fort Resort", budget_level: "High", description: "Opulent fortress stay in the Thar Desert." }
      ],
      restaurant_options: [
        { name: "The Trio", cuisine: "Rajasthani", description: "Famous for Laal Maas, Ker Sangri, and live sitar music." }
      ]
    },
    {
      id: "dest_28",
      name: "Jaipur",
      state: "Rajasthan",
      description: "The Pink City and vibrant capital of Rajasthan, celebrated for UNESCO-listed Amber Fort, Hawa Mahal, City Palace, and bustling bazaars.",
      categories: ["Historical"],
      interests: ["Palaces", "History", "Shopping", "Food", "Architecture"],
      best_season: ["Winter", "Autumn", "Spring"],
      facilities: ["Heritage Hotels", "Metro", "Taxis", "Guided Walking Tours"],
      estimated_budget_min: 6000,
      estimated_budget_max: 24000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Couple", "Family", "Solo", "Friends"],
      rating: 4.7,
      latitude: 26.9124,
      longitude: 75.7873,
      image: "/images/Jaipur.jpeg",
      nearby_places: [
        { name: "Nahargarh Fort", distance_km: 15, category: "Historical", image: "/images/Jaipur.jpeg" }
      ],
      things_to_do: ["Explore Amber Fort", "Photograph Hawa Mahal", "Visit Jantar Mantar Observatory", "Shop for Gems & Textiles in Johari Bazaar"],
      how_to_reach: [
        { mode: "Flight", description: "Jaipur International Airport." },
        { mode: "Train", description: "Jaipur Junction connects across the country." }
      ],
      stay_options: [
        { name: "ITC Rajputana", type: "Luxury Hotel", budget_level: "High", description: "Royal Rajasthani architecture and hospitality." }
      ],
      restaurant_options: [
        { name: "Laxmi Mishthan Bhandar (LMB)", cuisine: "Rajasthani Vegetarian", description: "Renowned for Pyaaz Kachori, Ghewar, and royal thali." }
      ]
    },
    {
      id: "dest_29",
      name: "Kedarnath",
      state: "Uttarakhand",
      description: "A revered Shiva temple situated at 3,583 meters amidst the glaciated peaks of the Garhwal Himalayas near the Mandakini River.",
      categories: ["Mountains", "Nature", "Adventure"],
      interests: ["Trekking", "Mountains", "Spirituality", "Snow", "Pilgrimage"],
      best_season: ["Summer", "Autumn"],
      facilities: ["Trek Guides", "Helicopter Services", "GMVN Camps"],
      estimated_budget_min: 9000,
      estimated_budget_max: 25000,
      recommended_duration_min: 3,
      recommended_duration_max: 5,
      traveller_types: ["Adventure", "Friends", "Solo", "Family"],
      rating: 4.9,
      latitude: 30.7352,
      longitude: 79.0669,
      image: "/images/Kedarnath.jpeg",
      nearby_places: [
        { name: "Bhairavnath Temple", distance_km: 1, category: "Mountains", image: "/images/Kedarnath.jpeg" }
      ],
      things_to_do: ["16 km Trek from Gaurikund", "Attend Evening Aarti at Kedarnath Temple", "Gaze at Kedar Dome and Himalayan Peaks"],
      how_to_reach: [
        { mode: "Trek", description: "16 km mountain trail from Gaurikund." },
        { mode: "Helicopter", description: "Helicopter shuttle from Phata, Guptkashi, or Sersi." }
      ],
      stay_options: [
        { name: "GMVN Swargarohini Complex", type: "Guesthouse", budget_level: "Medium", description: "Clean rooms close to the temple." }
      ],
      restaurant_options: [
        { name: "Badrinath Kedarnath Samiti Bhojanalaya", cuisine: "Pure Vegetarian", description: "Simple, piping hot dal, rice, and chapatis." }
      ]
    },
    {
      id: "dest_30",
      name: "Rann of Kutch",
      state: "Gujarat",
      description: "One of the world's largest salt deserts, famous for the mesmerizing White Desert, vibrant Rann Utsav festival, and moonlight camel rides.",
      categories: ["Nature", "Camping", "Adventure"],
      interests: ["Desert Camping", "Full Moon Night", "Culture", "Handicrafts", "Photography"],
      best_season: ["Winter"],
      facilities: ["Luxury Tent City", "ATV Rides", "Cultural Pavilions"],
      estimated_budget_min: 10000,
      estimated_budget_max: 28000,
      recommended_duration_min: 3,
      recommended_duration_max: 5,
      traveller_types: ["Couple", "Family", "Friends", "Culture"],
      rating: 4.8,
      latitude: 23.8344,
      longitude: 69.8322,
      image: "/images/Rann-of-Kutch.jpg",
      nearby_places: [
        { name: "Kalo Dungar", distance_km: 45, category: "Nature", image: "/images/Rann-of-Kutch.jpg" }
      ],
      things_to_do: ["Walk on White Salt Desert during Full Moon", "Stay at Tent City Dhordo", "Sunset at Kalo Dungar (Black Hill)", "Explore Rogan Art at Nirona Village"],
      how_to_reach: [
        { mode: "Train", description: "Bhuj Railway Station (85 km to Dhordo)." },
        { mode: "Flight", description: "Bhuj Airport." }
      ],
      stay_options: [
        { name: "Rann Utsav Tent City", type: "Luxury Tent Camp", budget_level: "High", description: "All-inclusive desert luxury tents with folk dance performances." }
      ],
      restaurant_options: [
        { name: "Tent City Dining Hall", cuisine: "Gujarati, Kutchi", description: "Lavish Kutchi thali with Bajra rotla and Ringan no olo." }
      ]
    },
    {
      id: "dest_31",
      name: "Taj Mahal (Agra)",
      state: "Uttar Pradesh",
      description: "An ivory-white marble mausoleum on the Yamuna River, a UNESCO World Heritage site and one of the New Seven Wonders of the World.",
      categories: ["Historical"],
      interests: ["History", "Mughal Architecture", "Photography", "World Wonder"],
      best_season: ["Winter", "Autumn", "Spring"],
      facilities: ["Audio Guides", "Electric Carts", "Guided Tours", "Hotels"],
      estimated_budget_min: 4000,
      estimated_budget_max: 15000,
      recommended_duration_min: 1,
      recommended_duration_max: 2,
      traveller_types: ["Couple", "Family", "Solo", "Friends"],
      rating: 4.9,
      latitude: 27.1751,
      longitude: 78.0421,
      image: "/images/Taj-Mahal.jpeg",
      nearby_places: [
        { name: "Agra Fort", distance_km: 2.5, category: "Historical", image: "/images/Taj-Mahal.jpeg" }
      ],
      things_to_do: ["Sunrise Viewing of Taj Mahal", "Explore Agra Fort", "Sunset from Mehtab Bagh", "Taste Authentic Agra Petha"],
      how_to_reach: [
        { mode: "Train", description: "Gatimaan / Vande Bharat Express to Agra Cantt." },
        { mode: "Car", description: "Yamuna Expressway from Delhi (3 hours)." }
      ],
      stay_options: [
        { name: "The Oberoi Amarvilas", type: "Luxury Resort", budget_level: "High", description: "Every room offers uninterrupted views of the Taj Mahal." }
      ],
      restaurant_options: [
        { name: "Pinch of Spice", cuisine: "North Indian, Mughlai", description: "Celebrated for Murgh Boti Masala and Paneer Tikka." }
      ]
    },
    {
      id: "dest_32",
      name: "Varanasi",
      state: "Uttar Pradesh",
      description: "One of the world's oldest continuously inhabited cities, celebrated for its sacred riverfront ghats along the Ganges, spiritual rituals, and timeless alleys.",
      categories: ["Historical"],
      interests: ["Spirituality", "Ghats", "History", "Boat Rides", "Street Food", "Culture"],
      best_season: ["Winter", "Autumn", "Spring"],
      facilities: ["Boatmen", "Heritage Stays", "Guided Alley Walks"],
      estimated_budget_min: 5000,
      estimated_budget_max: 16000,
      recommended_duration_min: 2,
      recommended_duration_max: 4,
      traveller_types: ["Solo", "Couple", "Friends", "Family"],
      rating: 4.8,
      latitude: 25.3176,
      longitude: 82.9739,
      image: "/images/Varanasi.jpg",
      nearby_places: [
        { name: "Sarnath", distance_km: 10, category: "Historical", image: "/images/Varanasi.jpg" }
      ],
      things_to_do: ["Witness Evening Ganga Aarti at Dashashwamedh Ghat", "Dawn Sunrise Boat Ride", "Explore Ancient Alleys", "Visit Kashi Vishwanath Temple"],
      how_to_reach: [
        { mode: "Flight", description: "Lal Bahadur Shastri International Airport." },
        { mode: "Train", description: "Varanasi Junction / Banaras Railway Station." }
      ],
      stay_options: [
        { name: "BrijRama Palace", type: "Heritage Palace", budget_level: "High", description: "18th-century palace right on Darbhanga Ghat." }
      ],
      restaurant_options: [
        { name: "Kashi Chaat Bhandar", cuisine: "Varanasi Street Food", description: "Famous for Tamatar Chaat and Palak Patta Chaat." }
      ]
    }
  ];
};
