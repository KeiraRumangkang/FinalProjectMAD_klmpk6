import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function PledgeScreen() {
  const router = useRouter();
  const { field } = useLocalSearchParams<{ field?: string }>();
  const { user } = useUser();
  const [isChecked, setIsChecked] = useState(false);
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkId: user.id } : 'skip'
  );
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const handleCompleteOnboarding = async () => {
    if (!isChecked) return;

    try {
      if (!field || !convexUser?._id) {
        throw new Error('Missing selected field or user profile.');
      }

      await completeOnboarding({
        userId: convexUser._id,
        field,
      });

      router.replace('/dashboard');
    } catch (error) {
      console.error('Complete onboarding error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-50">
      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-2xl bg-indigo-100 items-center justify-center mb-4">
            <MaterialIcons name="security" size={36} color="#3730A3" />
          </View>
          <Text className="text-3xl font-bold text-indigo-900 mb-2 text-center">Komitmen Belajar Mandiri</Text>
          <Text className="text-center text-gray-600 px-4">
            Di Nexarity, kamu tidak akan diberikan jawaban langsung. Kamu akan dibimbing untuk berpikir.
          </Text>
        </View>

        {/* Pledge Card */}
        <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden items-center mb-8">
          {/* Top border line */}
          <View className="absolute top-0 left-0 w-full h-1 bg-indigo-800" />
          
          <MaterialIcons name="format-quote" size={48} color="#E0E7FF" className="mb-2" />
          <Text className="text-lg text-gray-800 font-medium italic text-center leading-relaxed mb-6">
            {'"Saya berkomitmen untuk belajar secara mandiri, tidak meminta jawaban instan, dan benar-benar memahami setiap proses berpikir."'}
          </Text>
          
          <View className="pt-4 border-t border-gray-100 w-full">
            <Text className="text-xs text-center text-gray-400 uppercase tracking-widest font-bold">
              Kontrak Belajar Nexarity
            </Text>
          </View>
        </View>

        {/* Form Area */}
        <View className="mb-8">
          {/* Custom Checkbox */}
          <TouchableOpacity 
            className="flex-row items-start mb-6 pr-4"
            onPress={() => setIsChecked(!isChecked)}
            activeOpacity={0.8}
          >
            <View className={`w-6 h-6 rounded border mr-3 mt-0.5 items-center justify-center ${
              isChecked ? 'bg-indigo-800 border-indigo-800' : 'bg-white border-gray-400'
            }`}>
              {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text className={`text-base ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
              Saya memahami komitmen ini
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            className={`w-full py-4 rounded-xl flex-row justify-center items-center ${
              isChecked ? 'bg-indigo-800 shadow-md' : 'bg-indigo-200'
            }`}
            disabled={!isChecked}
            onPress={handleCompleteOnboarding}
          >
            <Text className={`font-bold text-lg mr-2 ${isChecked ? 'text-white' : 'text-indigo-400'}`}>
              Saya Setuju & Lanjut
            </Text>
            <Ionicons name="arrow-forward" size={20} color={isChecked ? "white" : "#818CF8"} />
          </TouchableOpacity>
          
          <Text className="text-center text-xs text-gray-400 mt-4">
            Langkah ini formal dan tidak dapat dilewati.
          </Text>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
