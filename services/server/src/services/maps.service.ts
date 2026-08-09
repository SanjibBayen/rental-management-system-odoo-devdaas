import { Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { config } from '../config/env';

const client = new Client({});

export class MapsService {
    private apiKey: string;

    constructor() {
        // Support configs that may not have googleMaps typed; fallback to env var
        this.apiKey = (config as any).googleMaps?.apiKey || process.env.GOOGLE_MAPS_API_KEY || '';
    }
    async geocodeAddress(address: string) {
        try {
            const response = await client.geocode({
                params: {
                    address,
                    key: this.apiKey,
                },
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Geocoding failed: ${response.data.status}`);
            }

            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
                formatted_address: response.data.results[0].formatted_address,
            };
        } catch (error: any) {
            console.error('Geocoding error:', error.message);
            throw error;
        }
    }
    async calculateDistances(origins: string[], destinations: string[]) {
        try {
            const response = await client.distancematrix({
                params: {
                    origins,
                    destinations,
                    key: this.apiKey,
                    mode: 'driving' as TravelMode,
                },
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Distance Matrix failed: ${response.data.status}`);
            }

            return response.data.rows;
        } catch (error: any) {
            console.error('Distance Matrix error:', error.message);
            throw error;
        }
    }
    async optimizeRoute(addresses: string[]): Promise<string[]> {
        if (addresses.length <= 1) return addresses;

        // Step 1: Geocode all addresses
        const geocoded = await Promise.all(
            addresses.map((addr) => this.geocodeAddress(addr))
        );

        // Step 2: Simple nearest neighbor optimization
        const optimized: string[] = [];
        const visited = new Set<number>();
        let currentIndex = 0;

        optimized.push(geocoded[0].formatted_address);
        visited.add(0);

        while (optimized.length < geocoded.length) {
            let nearestIndex = -1;
            let nearestDistance = Infinity;

            const current = geocoded[currentIndex];

            for (let i = 0; i < geocoded.length; i++) {
                if (visited.has(i)) continue;

                const target = geocoded[i];
                const distance = this.haversineDistance(
                    current.lat,
                    current.lng,
                    target.lat,
                    target.lng
                );

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = i;
                }
            }

            if (nearestIndex !== -1) {
                optimized.push(geocoded[nearestIndex].formatted_address);
                visited.add(nearestIndex);
                currentIndex = nearestIndex;
            }
        }

        return optimized;
    }
    private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}