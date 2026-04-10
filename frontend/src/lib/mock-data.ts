// Mock data for the Blood Bank Management System

export const bloodGroups = ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'] as const;
export type BloodGroup = typeof bloodGroups[number];

export interface Donor {
  donorId: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  location: { lat: number; lng: number; city: string };
  lastDonationDate: string;
  availabilityStatus: 'available' | 'unavailable' | 'cooldown';
  contactNumber: string;
  email: string;
  totalDonations: number;
}

export interface BloodInventoryItem {
  bloodGroup: BloodGroup;
  units: number;
  expiringIn24h: number;
  expiringIn72h: number;
  lastUpdated: string;
}

export interface BloodRequest {
  id: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: 'critical' | 'urgent' | 'normal';
  status: 'pending' | 'fulfilled' | 'partial' | 'expired';
  createdAt: string;
  patientInfo: string;
}

export interface ForecastResult {
  bloodGroup: BloodGroup;
  predicted24h: number;
  predicted48h: number;
  predicted72h: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Notification {
  id: string;
  type: 'emergency' | 'shortage' | 'expiry' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
  channel: 'sms' | 'email' | 'whatsapp' | 'system';
}

export const mockDonors: Donor[] = [
  { donorId: 'D001', name: 'Aarav Sharma', bloodGroup: 'O+', age: 28, gender: 'Male', location: { lat: 28.6139, lng: 77.2090, city: 'New Delhi' }, lastDonationDate: '2025-12-15', availabilityStatus: 'available', contactNumber: '+91-9876543210', email: 'aarav@email.com', totalDonations: 12 },
  { donorId: 'D002', name: 'Priya Patel', bloodGroup: 'A+', age: 32, gender: 'Female', location: { lat: 19.0760, lng: 72.8777, city: 'Mumbai' }, lastDonationDate: '2026-01-20', availabilityStatus: 'available', contactNumber: '+91-9876543211', email: 'priya@email.com', totalDonations: 8 },
  { donorId: 'D003', name: 'Rahul Kumar', bloodGroup: 'B+', age: 25, gender: 'Male', location: { lat: 12.9716, lng: 77.5946, city: 'Bangalore' }, lastDonationDate: '2026-02-10', availabilityStatus: 'cooldown', contactNumber: '+91-9876543212', email: 'rahul@email.com', totalDonations: 5 },
  { donorId: 'D004', name: 'Ananya Singh', bloodGroup: 'AB−', age: 30, gender: 'Female', location: { lat: 28.6139, lng: 77.2090, city: 'New Delhi' }, lastDonationDate: '2025-11-05', availabilityStatus: 'available', contactNumber: '+91-9876543213', email: 'ananya@email.com', totalDonations: 15 },
  { donorId: 'D005', name: 'Vikram Reddy', bloodGroup: 'O−', age: 35, gender: 'Male', location: { lat: 17.3850, lng: 78.4867, city: 'Hyderabad' }, lastDonationDate: '2025-10-28', availabilityStatus: 'available', contactNumber: '+91-9876543214', email: 'vikram@email.com', totalDonations: 20 },
  { donorId: 'D006', name: 'Meera Joshi', bloodGroup: 'A−', age: 27, gender: 'Female', location: { lat: 18.5204, lng: 73.8567, city: 'Pune' }, lastDonationDate: '2026-01-02', availabilityStatus: 'available', contactNumber: '+91-9876543215', email: 'meera@email.com', totalDonations: 3 },
  { donorId: 'D007', name: 'Arjun Nair', bloodGroup: 'B−', age: 40, gender: 'Male', location: { lat: 13.0827, lng: 80.2707, city: 'Chennai' }, lastDonationDate: '2025-09-18', availabilityStatus: 'available', contactNumber: '+91-9876543216', email: 'arjun@email.com', totalDonations: 25 },
  { donorId: 'D008', name: 'Sneha Gupta', bloodGroup: 'AB+', age: 29, gender: 'Female', location: { lat: 22.5726, lng: 88.3639, city: 'Kolkata' }, lastDonationDate: '2026-02-28', availabilityStatus: 'cooldown', contactNumber: '+91-9876543217', email: 'sneha@email.com', totalDonations: 7 },
];

export const mockInventory: BloodInventoryItem[] = [
  { bloodGroup: 'A+', units: 145, expiringIn24h: 8, expiringIn72h: 22, lastUpdated: '2026-03-10T08:30:00' },
  { bloodGroup: 'A−', units: 32, expiringIn24h: 2, expiringIn72h: 5, lastUpdated: '2026-03-10T08:30:00' },
  { bloodGroup: 'B+', units: 118, expiringIn24h: 5, expiringIn72h: 15, lastUpdated: '2026-03-10T08:30:00' },
  { bloodGroup: 'B−', units: 24, expiringIn24h: 1, expiringIn72h: 4, lastUpdated: '2026-03-10T08:30:00' },
  { bloodGroup: 'O+', units: 210, expiringIn24h: 12, expiringIn72h: 35, lastUpdated: '2026-03-10T08:30:00' },
  { bloodGroup: 'O−', units: 18, expiringIn24h: 3, expiringIn72h: 6, lastUpdated: '2026-03-10T08:30:00' },
  { bloodGroup: 'AB+', units: 56, expiringIn24h: 2, expiringIn72h: 8, lastUpdated: '2026-03-10T08:30:00' },
  { bloodGroup: 'AB−', units: 12, expiringIn24h: 1, expiringIn72h: 3, lastUpdated: '2026-03-10T08:30:00' },
];

export const mockRequests: BloodRequest[] = [
  { id: 'R001', hospitalName: 'AIIMS Delhi', bloodGroup: 'O−', units: 5, urgency: 'critical', status: 'pending', createdAt: '2026-03-10T06:45:00', patientInfo: 'Emergency surgery' },
  { id: 'R002', hospitalName: 'Apollo Mumbai', bloodGroup: 'AB−', units: 3, urgency: 'urgent', status: 'pending', createdAt: '2026-03-10T07:15:00', patientInfo: 'Thalassemia patient' },
  { id: 'R003', hospitalName: 'Fortis Bangalore', bloodGroup: 'A+', units: 8, urgency: 'normal', status: 'fulfilled', createdAt: '2026-03-09T14:00:00', patientInfo: 'Scheduled surgery' },
  { id: 'R004', hospitalName: 'Medanta Gurugram', bloodGroup: 'B+', units: 4, urgency: 'urgent', status: 'partial', createdAt: '2026-03-10T05:30:00', patientInfo: 'Accident victim' },
  { id: 'R005', hospitalName: 'CMC Vellore', bloodGroup: 'O+', units: 10, urgency: 'normal', status: 'fulfilled', createdAt: '2026-03-08T11:00:00', patientInfo: 'Multiple patients' },
];

export const mockForecasts: ForecastResult[] = [
  { bloodGroup: 'A+', predicted24h: 42, predicted48h: 85, predicted72h: 130, confidence: 0.92, trend: 'up' },
  { bloodGroup: 'A−', predicted24h: 8, predicted48h: 15, predicted72h: 22, confidence: 0.88, trend: 'stable' },
  { bloodGroup: 'B+', predicted24h: 35, predicted48h: 68, predicted72h: 105, confidence: 0.90, trend: 'up' },
  { bloodGroup: 'B−', predicted24h: 5, predicted48h: 12, predicted72h: 18, confidence: 0.85, trend: 'down' },
  { bloodGroup: 'O+', predicted24h: 55, predicted48h: 110, predicted72h: 170, confidence: 0.94, trend: 'up' },
  { bloodGroup: 'O−', predicted24h: 12, predicted48h: 25, predicted72h: 38, confidence: 0.87, trend: 'up' },
  { bloodGroup: 'AB+', predicted24h: 15, predicted48h: 28, predicted72h: 42, confidence: 0.89, trend: 'stable' },
  { bloodGroup: 'AB−', predicted24h: 4, predicted48h: 8, predicted72h: 12, confidence: 0.82, trend: 'down' },
];

export const mockNotifications: Notification[] = [
  { id: 'N001', type: 'emergency', message: 'CRITICAL: O− blood shortage at AIIMS Delhi. 5 units needed urgently.', timestamp: '2026-03-10T06:45:00', read: false, channel: 'system' },
  { id: 'N002', type: 'shortage', message: 'AI Forecast: AB− stock will deplete in 18 hours. Current: 12 units.', timestamp: '2026-03-10T07:00:00', read: false, channel: 'system' },
  { id: 'N003', type: 'expiry', message: '8 units of A+ blood expiring within 24 hours. Prioritize usage.', timestamp: '2026-03-10T08:30:00', read: true, channel: 'email' },
  { id: 'N004', type: 'info', message: 'Donor Aarav Sharma confirmed availability for emergency donation.', timestamp: '2026-03-10T07:30:00', read: true, channel: 'sms' },
  { id: 'N005', type: 'emergency', message: 'Mass casualty event reported near Medanta. Blood drive initiated.', timestamp: '2026-03-10T05:30:00', read: false, channel: 'whatsapp' },
];

export const demandTrendData = [
  { date: 'Mar 4', 'A+': 38, 'O+': 52, 'B+': 30, 'AB+': 12 },
  { date: 'Mar 5', 'A+': 42, 'O+': 48, 'B+': 35, 'AB+': 15 },
  { date: 'Mar 6', 'A+': 35, 'O+': 55, 'B+': 28, 'AB+': 10 },
  { date: 'Mar 7', 'A+': 50, 'O+': 60, 'B+': 40, 'AB+': 18 },
  { date: 'Mar 8', 'A+': 45, 'O+': 58, 'B+': 32, 'AB+': 14 },
  { date: 'Mar 9', 'A+': 40, 'O+': 65, 'B+': 38, 'AB+': 16 },
  { date: 'Mar 10', 'A+': 48, 'O+': 70, 'B+': 42, 'AB+': 20 },
];

export const inventoryTrendData = [
  { date: 'Mar 4', total: 580, used: 120, received: 95 },
  { date: 'Mar 5', total: 555, used: 135, received: 110 },
  { date: 'Mar 6', total: 530, used: 140, received: 115 },
  { date: 'Mar 7', total: 505, used: 155, received: 130 },
  { date: 'Mar 8', total: 480, used: 125, received: 100 },
  { date: 'Mar 9', total: 520, used: 110, received: 150 },
  { date: 'Mar 10', total: 615, used: 105, received: 200 },
];

export const donorResponseData = [
  { month: 'Oct', contacted: 120, responded: 85, donated: 62 },
  { month: 'Nov', contacted: 135, responded: 98, donated: 71 },
  { month: 'Dec', contacted: 150, responded: 110, donated: 88 },
  { month: 'Jan', contacted: 140, responded: 105, donated: 80 },
  { month: 'Feb', contacted: 160, responded: 120, donated: 95 },
  { month: 'Mar', contacted: 175, responded: 140, donated: 108 },
];
