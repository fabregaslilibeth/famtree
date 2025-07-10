export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  middleName?: string;
  familyId?: string;
  placeOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  religion?: string;
  language?: string;
  ethnicity?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  maritalStatus?: string;
  occupation?: string;
  tellMeMore?: string;
  fatherName?: string;
  fatherRelation?: string;
  motherName?: string;
  motherRelation?: string;
  spouseName?: string;
  spouseRelation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  firstName: string;
  lastName?: string;
  middleName?: string;
  familyId?: string;
  placeOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  religion?: string;
  language?: string;
  ethnicity?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  maritalStatus?: string;
  occupation?: string;
  tellMeMore?: string;
  fatherName?: string;
  fatherRelation?: string;
  motherName?: string;
  motherRelation?: string;
  spouseName?: string;
  spouseRelation?: string;
} 