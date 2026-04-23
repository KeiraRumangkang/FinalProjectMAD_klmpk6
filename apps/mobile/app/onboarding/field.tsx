import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FieldSelectionScreen() {
  const router = useRouter();
  // State untuk menyimpan pilihan major. Default 'Computer Science' agar sesuai gambar
  const [selectedField, setSelectedField] = useState('Computer Science');

  // Daftar bidang studi (Majors)
  const majors = [
    { id: 'Computer Science', icon: 'terminal-outline' },
    { id: 'Medicine', icon: 'medkit-outline' },
    { id: 'Law', icon: 'scale-outline' },
    { id: 'Engineering', icon: 'hammer-outline' },
    { id: 'Arts', icon: 'color-palette-outline' },
    { id: 'Business', icon: 'wallet-outline' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-indigo-50">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-indigo-900 mb-2">Choose Your Field</Text>
          <Text className="text-center text-gray-500 px-4">
            Select the academic major that aligns with your professional aspirations.
          </Text>
        </View>

        {/* Grid Options */}
        <View className="flex-row flex-wrap justify-between">
          {majors.map((major) => {
            const isSelected = selectedField === major.id;
            return (
              <TouchableOpacity
                key={major.id}
                onPress={() => setSelectedField(major.id)}
                className={`w-[48%] bg-white p-4 rounded-2xl mb-4 items-center border-2 ${
                  isSelected ? 'border-indigo-800' : 'border-transparent shadow-sm'
                }`}
              >
                {/* Checkmark indicator */}
                {isSelected && (
                  <View className="absolute top-2 right-2 bg-indigo-800 rounded-full p-0.5">
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                )}
                <View className={`p-3 rounded-xl mb-2 ${isSelected ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  <Ionicons 
                    name={major.icon as any} 
                    size={28} 
                    color={isSelected ? '#3730A3' : '#9CA3AF'} 
                  />
                </View>
                <Text className={`font-semibold text-center ${isSelected ? 'text-indigo-900' : 'text-gray-500'}`}>
                  {major.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Banner */}
        <View className="bg-indigo-800 rounded-2xl p-6 mt-2 mb-6">
          <Text className="text-xl font-bold text-white mb-2">Not sure yet?</Text>
          <Text className="text-indigo-100 mb-4">
            Take our academic assessment to find the best field for your unique skillset.
          </Text>
          <TouchableOpacity>
            <Text className="text-white underline font-semibold">Start Assessment</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          className="bg-indigo-800 py-4 rounded-xl flex-row justify-center items-center mb-8"
          onPress={() => {
            console.log("Field terpilih:", selectedField);
            router.push('/onboarding/pledge' as any);
          }}
        >
          <Text className="text-white font-bold text-lg mr-2">Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}