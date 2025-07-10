'use client';

import React, { useState } from 'react';
import { FormData } from '../types/user';
import { FirebaseService } from '../lib/firebase-service';
import AddUserModal from './AddUserModal';

const relationOptions = [
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Husband',
  'Wife',
  'Grandfather',
  'Grandmother',
  'Uncle',
  'Aunt',
  'Cousin',
  'Friend',
  'Other'
];

export default function UserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showFatherModal, setShowFatherModal] = useState(false);
  const [showMotherModal, setShowMotherModal] = useState(false);
  const [showSpouseModal, setShowSpouseModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    familyId: '',
    placeOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    religion: '',
    language: '',
    ethnicity: '',
    birthDate: '',
    gender: undefined,
    maritalStatus: '',
    occupation: '',
    tellMeMore: '',
    fatherName: '',
    fatherRelation: '',
    motherName: '',
    motherRelation: '',
    spouseName: '',
    spouseRelation: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddUser = async (firstName: string, lastName: string, type: 'father' | 'mother' | 'spouse') => {
    try {
      await FirebaseService.createUser({
        firstName,
        lastName
      });
      
      const fullName = `${firstName} ${lastName}`;
      setFormData(prev => ({
        ...prev,
        [`${type}Name`]: fullName
      }));
      
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting form submission...');
      
      // Check if family ID is null/empty and create a new family if needed
      let familyId = formData.familyId;
      if (!familyId && formData.lastName) {
        console.log('No family ID provided, creating new family with name:', formData.lastName);
        try {
          familyId = await FirebaseService.createFamily(formData.lastName);
          console.log('New family created with ID:', familyId);
        } catch (error) {
          console.error('Error creating family:', error);
          alert('Error creating family. Please try again.');
          return;
        }
      }
      
      // Create the main user with all form data
      console.log('Creating main user...');
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        familyId: familyId,
        placeOfBirth: formData.placeOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        religion: formData.religion,
        language: formData.language,
        ethnicity: formData.ethnicity,
        birthDate: formData.birthDate,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        occupation: formData.occupation,
        tellMeMore: formData.tellMeMore,
        fatherName: formData.fatherName,
        fatherRelation: formData.fatherRelation,
        motherName: formData.motherName,
        motherRelation: formData.motherRelation,
        spouseName: formData.spouseName,
        spouseRelation: formData.spouseRelation,
      };
      console.log('User data to save:', userData);

      await FirebaseService.createUser(userData);
      console.log('User created successfully!');

      setShowSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        familyId: '',
        placeOfBirth: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        religion: '',
        language: '',
        ethnicity: '',
        birthDate: '',
        gender: undefined,
        maritalStatus: '',
        occupation: '',
        tellMeMore: '',
        fatherName: '',
        fatherRelation: '',
        motherName: '',
        motherRelation: '',
        spouseName: '',
        spouseRelation: '',
      });
      setErrors({});
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving user:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      alert(`Error saving user: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          User saved successfully!
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-black mb-8">Family Member Information</h1>
          
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* First Name - Required */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name - Required */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter middle name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Marital Status
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select marital status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter occupation"
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Address Information</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter city"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter state"
                    />
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter zip code"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            {/* Cultural Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Cultural Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Religion */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter religion"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter primary language"
                  />
                </div>

                {/* Ethnicity */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Ethnicity
                  </label>
                  <input
                    type="text"
                    value={formData.ethnicity}
                    onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter ethnicity"
                  />
                </div>
              </div>

              {/* Place of Birth */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Place of Birth
                </label>
                <input
                  type="text"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter place of birth"
                />
              </div>
            </div>

            {/* Family Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Family Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Father Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">Father</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Father's Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter father's name"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFatherModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Add New
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Relation to Father
                    </label>
                    <select
                      value={formData.fatherRelation}
                      onChange={(e) => handleInputChange('fatherRelation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select relation</option>
                      {relationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mother Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">Mother</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Mother's Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.motherName}
                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter mother's name"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMotherModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Add New
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Relation to Mother
                    </label>
                    <select
                      value={formData.motherRelation}
                      onChange={(e) => handleInputChange('motherRelation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select relation</option>
                      {relationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Spouse Information */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium text-black">Spouse</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Spouse's Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.spouseName}
                        onChange={(e) => handleInputChange('spouseName', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter spouse's name"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSpouseModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Add New
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Relation to Spouse
                    </label>
                    <select
                      value={formData.spouseRelation}
                      onChange={(e) => handleInputChange('spouseRelation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select relation</option>
                      {relationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Additional Information</h2>
              
              <div className="space-y-4">
                {/* Family ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Family ID
                  </label>
                  <input
                    type="text"
                    value={formData.familyId}
                    onChange={(e) => handleInputChange('familyId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter family ID"
                  />
                </div>

                {/* Tell Me More */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Tell Me More
                  </label>
                  <textarea
                    value={formData.tellMeMore}
                    onChange={(e) => handleInputChange('tellMeMore', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share any additional information about this family member..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save User'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showFatherModal}
        onClose={() => setShowFatherModal(false)}
        onAdd={(firstName, lastName) => handleAddUser(firstName, lastName, 'father')}
        title="Add Father"
      />

      <AddUserModal
        isOpen={showMotherModal}
        onClose={() => setShowMotherModal(false)}
        onAdd={(firstName, lastName) => handleAddUser(firstName, lastName, 'mother')}
        title="Add Mother"
      />

      <AddUserModal
        isOpen={showSpouseModal}
        onClose={() => setShowSpouseModal(false)}
        onAdd={(firstName, lastName) => handleAddUser(firstName, lastName, 'spouse')}
        title="Add Spouse"
      />
    </div>
  );
} 