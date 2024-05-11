interface WCAGGuideline {
  ref_id: string;
  title: string;
  description: string;
  url: string;
  guidelines: Guideline[];
}

interface Guideline {
  ref_id: string;
  title: string;
  description: string;
  url: string;
  references: Reference[];
  success_criteria: SuccessCriterion[];
}

interface Reference {
  title: string;
  url: string;
}

interface SuccessCriterion {
  ref_id: string;
  title: string;
  description: string;
  url: string;
  level: string;
  special_cases: SpecialCase[] | null;
  notes: Note[] | null;
  references: Reference[];
}

interface SpecialCase {
  type: string;
  title: string;
  description: string;
}

interface Note {
  content: string;
}

type WCAGGuidelines = WCAGGuideline[]

export interface WCAGItem {
  ref_id: string;
  title: string;
  level?: string;
  description?: string;
  url?: string;
  special_cases?: WCAGItem[];
  notes?: { content: string }[];
  references?: { url: string; title: string }[];
  guidelines?: WCAGItem[];
  success_criteria?: WCAGItem[];
}

export default WCAGGuidelines;