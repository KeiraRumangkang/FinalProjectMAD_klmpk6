import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MyLibraryScreen() {
  const router = useRouter();

  const libraryData = [
    {
      id: '1',
      title: 'Paradoks Efisiensi',
      description: 'Jika setiap alat membuat kita lebih cepat, mengapa kita merasa punya lebih sedikit waktu? Refleksi tentang akselerasi kerajinan digital.',
      date: '08 Okt 2023',
      type: 'Socratic Session',
      progress: 0.66,
    },
    {
      id: '2',
      title: 'Masalah Awal',
      description: 'Menjelajahi disonansi mendasar antara produktivitas profesional dan keheningan kreatif. Mengapa ruang kerja modern menolak pemikiran mendalam?',
      date: '12 Okt 2023',
      type: 'Socratic Session',
      isNew: true,
    },
    {
      id: '3',
      title: 'Estetika Kesunyian',
      description: 'Peran ruang negatif dalam desain informasi. Seberapa banyak yang bisa kita hapus sebelum pesan kehilangan esensinya?',
      date: '01 Okt 2023',
      type: 'Socratic Session',
      status: 'Complete',
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-indigo-50">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1c1b21" />
        </TouchableOpacity>
        <Text className="text-xl font-serif font-medium text-gray-900">My Library</Text>
        <View className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden border border-indigo-200 items-center justify-center">
             <MaterialIcons name="person" size={28} color="#58569f" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-baseline mb-2">
            <Text className="text-4xl font-serif font-medium text-gray-900">Study Journal</Text>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">34 Sessions</Text>
          </View>
          <Text className="text-lg text-gray-500 font-light leading-6">
            Review your intellectual progress and revisit past Socratic inquiries.
          </Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-8 h-12">
          {['Newest', 'Most Deep', 'Unfinished'].map((filter, index) => (
            <TouchableOpacity 
              key={filter}
              className={`px-6 py-2 rounded-full mr-3 h-10 justify-center ${index === 0 ? 'bg-[#e2dfff]' : 'bg-gray-100'}`}
            >
              <Text className={`font-semibold ${index === 0 ? 'text-[#403e85]' : 'text-gray-500'}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Note List */}
        <View className="flex flex-col pb-24">
          {libraryData.map((item) => (
            <TouchableOpacity 
              key={item.id}
              className="bg-white p-6 rounded-2xl mb-6 shadow-sm border-l-4 border-indigo-500 shadow-indigo-100"
              onPress={() => router.push('/chat')}
            >
              {/* PENGGANTI DIV: Gunakan View */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="psychology" size={18} color="#58569f" />
                  <Text className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">{item.type}</Text>
                </View>
                <Text className="text-[10px] text-gray-400 font-medium">{item.date}</Text>
              </View>

              <Text className="text-2xl font-serif font-semibold text-gray-900 mb-2">{item.title}</Text>
              <Text className="text-sm text-gray-500 leading-5 mb-6" numberOfLines={2}>
                {item.description}
              </Text>

              <View className="flex-row justify-between items-center">
                {item.progress ? (
                  <View className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <View style={{width: `${item.progress * 100}%`}} className="h-full bg-indigo-400" />
                  </View>
                ) : (
                  <Text className="text-[10px] italic text-gray-400">{item.status || 'Session Active'}</Text>
                )}

                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-bold text-indigo-600">
                    {item.status === 'Complete' ? 'Review Note' : 'Continue Inquiry'}
                  </Text>
                  <MaterialIcons name="arrow-forward" size={14} color="#58569f" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <View className="py-12 items-center opacity-30">
            <View className="w-3 h-3 rounded-full bg-indigo-400 mb-2" />
            <Text className="italic font-serif text-gray-600">End of your intellectual path for now.</Text>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        className="absolute bottom-10 right-8 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-xl shadow-indigo-400"
        onPress={() => router.push('/chat')}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}