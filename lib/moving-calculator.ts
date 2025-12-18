// Moving service pricing calculator utilities

interface Coordinates {
    lat: number;
    lng: number;
}

interface PricingConfig {
    vehicleBaseRates: Record<string, number>;
    laborCostPerPerson: number;
    materialCosts: {
        box: number;
        tape: number;
        blanket: number;
        wrap: number;
        bubble: number;
    };
    serviceFeePercentage: number;
    fixedMarkup: number;
}

interface HouseConfig {
    vehicle: string;
    loaders: number;
    materials: {
        boxes: number;
        tape: number;
        blankets: number;
        wrap: number;
        bubble: number;
    };
}

const PRICING_CONFIG: PricingConfig = {
    vehicleBaseRates: {
        'Van': 210,
        'Pickup': 220,
        'Mini Truck': 250,
        'Car Rescue': 400,
        'Lorry 5T': 800,
        'Lorry 10T': 1200,
    },
    laborCostPerPerson: 600,
    materialCosts: {
        box: 150,
        tape: 150,
        blanket: 500,
        wrap: 600,
        bubble: 800,
    },
    serviceFeePercentage: 0.10, // 10%
    fixedMarkup: 4000,
};

const HOUSE_CONFIGS: Record<string, HouseConfig> = {
    'Studio': {
        vehicle: 'Pickup',
        loaders: 2,
        materials: { boxes: 10, tape: 2, blankets: 1, wrap: 1, bubble: 1 },
    },
    '1 Bedroom': {
        vehicle: 'Pickup',
        loaders: 2,
        materials: { boxes: 15, tape: 3, blankets: 2, wrap: 1, bubble: 1 },
    },
    '2 Bedroom': {
        vehicle: 'Mini Truck',
        loaders: 3,
        materials: { boxes: 20, tape: 4, blankets: 3, wrap: 2, bubble: 1 },
    },
    '3 Bedroom': {
        vehicle: 'Mini Truck',
        loaders: 3,
        materials: { boxes: 25, tape: 5, blankets: 4, wrap: 2, bubble: 2 },
    },
    '4 Bedroom': {
        vehicle: 'Lorry 5T',
        loaders: 4,
        materials: { boxes: 30, tape: 6, blankets: 5, wrap: 3, bubble: 2 },
    },
    '5 Bedroom': {
        vehicle: 'Lorry 10T',
        loaders: 5,
        materials: { boxes: 40, tape: 8, blankets: 6, wrap: 4, bubble: 3 },
    },
};

/**
 * Calculate distance multiplier based on distance
 * These are PER-KILOMETER rates that decrease with distance (economies of scale)
 */
function getPerKmRate(distanceKm: number): number {
    if (distanceKm <= 2) return 3.5;
    if (distanceKm <= 3) return 3.0;
    if (distanceKm <= 5) return 2.5;
    if (distanceKm <= 10) return 1.2;

    // Over 10 km: rate decreases with distance but has a floor of 0.5
    // This creates economies of scale for longer distances
    const rate = Math.exp(-0.005 * distanceKm);
    return Math.max(rate, 0.5);
}

/**
 * Calculate transport cost only
 * Formula: Base Rate × Distance (km) × Per-Km Rate
 */
export function calculateTransportCost(
    vehicle: string,
    distanceKm: number
): number {
    const baseRate = PRICING_CONFIG.vehicleBaseRates[vehicle] || 0;
    const perKmRate = getPerKmRate(distanceKm);

    // Cost scales with distance
    const cost = baseRate * distanceKm * perKmRate;

    return Math.round(cost);
}

/**
 * Calculate packing materials cost
 */
function calculateMaterialsCost(materials: HouseConfig['materials']): number {
    const { box, tape, blanket, wrap, bubble } = PRICING_CONFIG.materialCosts;

    return (
        materials.boxes * box +
        materials.tape * tape +
        materials.blankets * blanket +
        materials.wrap * wrap +
        materials.bubble * bubble
    );
}

/**
 * Calculate full moving service cost
 */
export function calculateFullMovingCost(
    houseType: string,
    distanceKm: number
): {
    transportCost: number;
    laborCost: number;
    materialsCost: number;
    serviceFee: number;
    markup: number;
    total: number;
    breakdown: HouseConfig;
} {
    const config = HOUSE_CONFIGS[houseType];

    if (!config) {
        throw new Error(`Unknown house type: ${houseType}`);
    }

    // Calculate individual costs
    const transportCost = calculateTransportCost(config.vehicle, distanceKm);
    const laborCost = config.loaders * PRICING_CONFIG.laborCostPerPerson;
    const materialsCost = calculateMaterialsCost(config.materials);

    // Calculate service fee (10% of subtotal)
    const subtotal = transportCost + laborCost + materialsCost;
    const serviceFee = Math.round(subtotal * PRICING_CONFIG.serviceFeePercentage);

    // Add fixed markup
    const markup = PRICING_CONFIG.fixedMarkup;

    // Calculate total
    const total = subtotal + serviceFee + markup;

    return {
        transportCost,
        laborCost,
        materialsCost,
        serviceFee,
        markup,
        total,
        breakdown: config,
    };
}

/**
 * Calculate distance between two coordinates using Google Maps Distance Matrix API
 */
export async function calculateDistance(
    origin: string,
    destination: string
): Promise<{ distanceKm: number; durationMinutes: number }> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        throw new Error('Google Maps API key not configured');
    }

    try {
        const originEncoded = encodeURIComponent(origin);
        const destEncoded = encodeURIComponent(destination);

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originEncoded}&destinations=${destEncoded}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(`Distance Matrix API error: ${data.status}`);
        }

        const element = data.rows[0]?.elements[0];

        if (!element || element.status !== 'OK') {
            throw new Error('Could not calculate distance');
        }

        const distanceMeters = element.distance.value;
        const durationSeconds = element.duration.value;

        return {
            distanceKm: distanceMeters / 1000,
            durationMinutes: Math.round(durationSeconds / 60),
        };
    } catch (error) {
        console.error('Error calculating distance:', error);
        throw error;
    }
}

/**
 * Get available vehicles for transport-only service
 */
export function getAvailableVehicles(): string[] {
    return Object.keys(PRICING_CONFIG.vehicleBaseRates);
}

/**
 * Get available house types for full service
 */
export function getAvailableHouseTypes(): string[] {
    return Object.keys(HOUSE_CONFIGS);
}
