import React from 'react';
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-indigo-50">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1c1b21" />
        </TouchableOpacity>
        <Text className="text-xl font-serif font-medium text-gray-900">Edit Profil</Text>
        <View className="w-10 h-10" />
      </View>

      <View className="flex-1 px-6 pt-8">
        <View className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
          <Text className="text-2xl font-serif font-semibold text-gray-900 mb-2">Profil Nexarity</Text>
          <Text className="text-sm text-gray-500 leading-5 mb-6">
            Kelola nama, foto, dan preferensi belajar kamu dari halaman ini.
          </Text>

          <TouchableOpacity
            className="w-full py-4 bg-indigo-600 rounded-2xl items-center justify-center shadow-xl shadow-indigo-200"
            onPress={() => Alert.alert('Edit Profil', 'Ciri ini akan tersedia tidak lama lagi.')}
          >
            <Text className="text-white font-bold text-[16px]">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
