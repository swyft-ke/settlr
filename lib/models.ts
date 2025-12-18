export type Role = 'CLIENT' | 'SCOUT' | 'ADMIN';

export interface User {
    id: string;
    phone: string;
    role: Role;
    created_at: string;
}

export interface Listing {
    id: string;
    location: string;
    price: number;
    description: string;
    images: string[];
    status: 'AVAILABLE' | 'TAKEN';
    created_at: string;
    scout_id: string;
    title?: string;
    tags?: string[];
}

export interface Tour {
    id: string;
    client_id: string;
    scout_id?: string;
    status: 'PAID' | 'SCHEDULED' | 'ACTIVE' | 'DONE';
    payment_ref?: string;
    scheduled_date?: string;
    scheduled_time?: string;
    pickup_location?: string;
    created_at: string;
}

export interface TourStop {
    id: string;
    tour_id: string;
    listing_id: string;
    sequence_order: number;
    client_feedback?: string;
    rating?: number;
}
