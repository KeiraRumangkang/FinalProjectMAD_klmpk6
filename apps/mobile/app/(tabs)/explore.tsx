import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  SafeAreaView, Image 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LibraryScreen() {
  const router = useRouter();

  const sessions = [
    {
      id: 1,
      title: "Masalah Awal",
      desc: "Exploring the fundamental dissonance between professional productivity and creative stillness. Why does the modern workspace repel deep thought?",
      date: "12 Okt 2023",
      type: "Socratic Session",
      status: "Continue Inquiry",
      active: true
    },
    {
      id: 2,
      title: "Paradoks Efisiensi",
      desc: "If every tool makes us faster, why do we feel we have less time? A reflection on the acceleration of digital craftsmanship.",
      date: "08 Okt 2023",
      type: "Socratic Session",
      status: "Read Insights",
      active: false
    },
    {
      id: 3,
      title: "Estetika Kesunyian",
      desc: "The role of negative space in information design. How much can we remove before the message loses its essence?",
      date: "01 Okt 2023",
      type: "Socratic Session",
      status: "Review Note",
      active: false
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-8 py-4 bg-white border-b border-indigo-50 shadow-sm">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full">
            <MaterialIcons name="menu" size={24} color="#474650" />
          </TouchableOpacity>
          <Text className="text-xl font-serif font-medium text-gray-800">My Library</Text>
        </View>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=1' }} 
          className="w-10 h-10 rounded-full border border-indigo-100"
        />
      </View>

      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* HERO SECTION */}
        <View className="mb-8">
          <View className="flex-row justify-between items-baseline mb-2">
            <Text className="text-3xl font-serif font-medium text-[#1c1b21]">Study Journal</Text>
            <Text className="text-[10px] text-[#777682] font-bold uppercase tracking-widest">34 Sessions</Text>
          </View>
          <Text className="text-lg text-[#474650] font-serif leading-relaxed">
            Review your intellectual progress and revisit past Socratic inquiries.
          </Text>
        </View>

        {/* FILTERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-8">
          <TouchableOpacity className="bg-[#e2dfff] px-6 py-2 rounded-full mr-3">
            <Text className="text-[#130c59] font-medium">Newest</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#f6f2fb] px-6 py-2 rounded-full mr-3">
            <Text className="text-[#474650] font-medium">Most Deep</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#f6f2fb] px-6 py-2 rounded-full mr-3">
            <Text className="text-[#474650] font-medium">Unfinished</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* SESSION LIST CARD */}
        <View className="flex-col gap-6">
          {sessions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              className={`bg-white p-6 rounded-2xl border-l-4 shadow-sm ${item.active ? 'border-[#58569f]' : 'border-transparent'}`}
              style={{ elevation: 2 }}
            >
              <View className="flex-row justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="psychology" size={18} color="#58569f" />
                  <Text className="text-[10px] font-bold text-[#58569f] uppercase tracking-wider">{item.type}</Text>
                </View>
                <Text className="text-[11px] text-[#777682]">{item.date}</Text>
              </View>
              
              <Text className="text-xl font-serif font-bold text-[#1c1b21] mb-2">{item.title}</Text>
              <Text className="text-[#474650] leading-relaxed mb-6" numberOfLines={2}>{item.desc}</Text>
              
              <View className="flex-row justify-between items-center">
                <View className="w-8 h-8 rounded-full bg-[#e2dfff] items-center justify-center">
                  <Text className="text-[10px] font-bold text-[#58569f]">AI</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-[#58569f] font-bold text-sm mr-1">{item.status}</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#58569f" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* FOOTER */}
        <View className="py-12 items-center opacity-30">
          <View className="w-12 h-1 bg-[#8b89d6] rounded-full mb-4" />
          <Text className="font-serif italic text-[#474650]">End of your intellectual path.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}