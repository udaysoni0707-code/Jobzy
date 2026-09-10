export type UserRole = 'STUDENT' | 'INDUSTRY' | 'INSTITUTE' | 'GOVERNMENT' | 'ADMIN';

export type GapSeverity = 'COVERED' | 'PARTIAL' | 'MISSING' | 'CRITICAL';

export type RecommendationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ActionType = 'ADD_MODULE' | 'EXPAND_LAB' | 'TRAINER_UPSKILLING' | 'REVISE_THEORY';

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  district?: string;
  isVerified?: boolean;
}

export interface ExtractedSkill {
  id?: string;
  name: string;
  category: string;
  matchedAlias?: string;
  confidence: number;
  isEmerging?: boolean;
  frequency?: number;
}

export interface SkillGapItem {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  demandScore: number;
  coverageScore: number;
  gapScore: number;
  gapSeverity: GapSeverity;
  isEmerging: boolean;
}

export interface AIRecommendationExplanation {
  whyReason: string;
  evidence: {
    industryDemandScore: number;
    curriculumCoverageScore: number;
    openJobPositions: number;
    stateShortageIndex: number;
    recentPostingsSnippet: string;
  };
  recommendedAction: string;
  confidenceScore: number;
  suggestedModuleTitle: string;
  suggestedDurationHours: number;
  trainerRequirement: string;
  equipmentRequirement: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  skill: string;
  type: 'COURSE' | 'LAB' | 'CERTIFICATION' | 'PROJECT';
  durationWeeks: number;
  completed: boolean;
  provider: string;
}

export interface DistrictInsight {
  district: string;
  sector: string;
  highDemandSkill: string;
  shortageSkill: string;
  indexScore: number;
  employmentDemand: number;
  trainingCapacity: number;
  topSkills: string[];
  shortageSkills: string[];
  curriculumGaps: string[];
  recommendations: string[];
}
