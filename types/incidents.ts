export type IncidentType = 'workplace' | 'cyber' | 'public' | 'domestic' | 'other';

export interface Incident {
  id: string;
  type: IncidentType;
  description: string;
  location?: string;
  date: Date;
  evidence?: string[];
  status: 'received' | 'reviewing' | 'action_taken' | 'closed';
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface LegalResource {
  id: string;
  title: string;
  description: string;
  category: 'law' | 'rights' | 'procedure' | 'document';
  content: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  likes: number;
  responses: number;
  anonymous: boolean;
}