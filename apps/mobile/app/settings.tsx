import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  const options = [
    { icon: 'privacy-tip', label: 'Privacy' },
    { icon: 'notifications', label: 'Notifications' },
    { icon: 'info', label: 'About' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-indigo-50">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1c1b21" />
        </TouchableOpacity>
        <Text className="text-xl font-serif font-medium text-gray-900">Pengaturan</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        <View className="bg-gray-100/50 rounded-[32px] overflow-hidden">
          {options.map((item) => (
            <TouchableOpacity
              key={item.label}
              className="flex-row items-center justify-between p-5 border-b border-white/50"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
                  <MaterialIcons name={item.icon as any} size={22} color="#4338ca" />
                </View>
                <Text className="font-bold text-gray-700">{item.label}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="w-full py-4 bg-indigo-600 rounded-2xl items-center justify-center shadow-xl shadow-indigo-200 mt-8"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold text-[16px]">Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
