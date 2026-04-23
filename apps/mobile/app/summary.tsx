import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SummaryScreen() {
  const router = useRouter();

  const [masalah, setMasalah] = useState('Awalnya saya bingung bagaimana cara mengimplementasikan visual tokens yang konsisten di seluruh platform mobile tanpa mengorbankan performa render.');
  const [konsep, setKonsep] = useState('• Tonal Layering: Menggunakan bayangan ambient untuk hirarki.\n• Semantic Shell: Struktur navigasi yang adaptif.\n• Baseline Grid: Ritme vertikal 8px untuk keteraturan.');
  const [alur, setAlur] = useState('1. Menganalisis dokumentasi desain system yang ada.\n2. Melakukan audit terhadap palet warna yang tidak sesuai standar aksesibilitas.\n3. Melakukan iterasi pada komponen Shell untuk mendukung context-aware navigation.');
  const [jawaban, setJawaban] = useState('Implementasi visual tokens yang efektif membutuhkan pemisahan yang jelas antara Identity (JSON) dan Visual Style (Tailwind Config), di mana context-aware logic mengontrol visibilitas shell navigasi.');

  const handleSaveToLibrary = async () => {
    try {
      const newSession = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        title: "Refleksi: " + masalah.split(' ').slice(0, 3).join(' ') + "...", 
        summary: jawaban, 
        status: 'Review Note' 
      };

      const existingData = await AsyncStorage.getItem('@my_library');
      let libraryData = existingData ? JSON.parse(existingData) : [];
      libraryData.unshift(newSession);
      await AsyncStorage.setItem('@my_library', JSON.stringify(libraryData));

      router.push('/library');
      
    } catch (error) {
      console.error('Gagal menyimpan ke Library:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      {/* ========================================== */}
      {/* HEADER (IKON TELAH DIUBAH MENJADI BACK)    */}
      {/* ========================================== */}
      <View className="flex-row justify-between items-center px-8 py-4 bg-[#FDFDFE] border-b border-[#8B89D6]/10 z-50">
        {/* Perubahan di sini: name="arrow-back" */}
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-[#8B89D6]/5">
          <MaterialIcons name="arrow-back" size={26} color="#58569f" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-serif italic text-[#8B89D6]">Nexarity</Text>
        
        <View className="w-10 h-10 rounded-full bg-[#f0ecf6] overflow-hidden">
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=1' }} 
            className="w-full h-full"
          />
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-8 pt-8"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="items-center mb-8">
          <Text className="text-[32px] font-serif text-[#1c1b21] mb-2 font-medium">Ringkasan Pemahamanmu</Text>
          <Text className="text-[16px] text-[#474650] text-center px-4 leading-relaxed">
            Tinjau kembali perjalanan belajarmu dan saring intisari pemikiranmu sebelum disimpan.
          </Text>
        </View>

        {/* Reflection Cards Stack */}
        <View className="space-y-6">
          <View className="bg-white rounded-[32px] p-8 border border-[#8b89d6]/10 shadow-lg shadow-indigo-100/50 mb-6">
            <View className="flex-row items-center gap-3 mb-4">
              <MaterialIcons name="lightbulb" size={24} color="#58569f" />
              <Text className="text-[24px] font-serif font-semibold text-[#1c1b21]">Masalah Awal</Text>
            </View>
            <TextInput
              multiline
              value={masalah}
              onChangeText={setMasalah}
              className="text-[16px] text-[#474650] leading-relaxed min-h-[100px]"
              placeholder="Apa pertanyaan atau kendala utama yang kamu hadapi?"
              textAlignVertical="top"
            />
          </View>

          <View className="bg-white rounded-[32px] p-8 border border-[#8b89d6]/10 shadow-lg shadow-indigo-100/50 mb-6">
            <View className="flex-row items-center gap-3 mb-4">
              <MaterialIcons name="key" size={24} color="#58569f" />
              <Text className="text-[24px] font-serif font-semibold text-[#1c1b21]">Konsep Kunci</Text>
            </View>
            <TextInput
              multiline
              value={konsep}
              onChangeText={setKonsep}
              className="text-[16px] text-[#474650] leading-relaxed min-h-[80px]"
              placeholder="Sebutkan prinsip-prinsip utama yang kamu pelajari."
              textAlignVertical="top"
            />
          </View>

          <View className="bg-white rounded-[32px] p-8 border border-[#8b89d6]/10 shadow-lg shadow-indigo-100/50 mb-6 overflow-hidden relative">
            <View className="absolute top-8 right-8 opacity-5">
              <MaterialIcons name="route" size={100} color="#1c1b21" />
            </View>
            <View className="flex-row items-center gap-3 mb-4">
              <MaterialIcons name="timeline" size={24} color="#58569f" />
              <Text className="text-[24px] font-serif font-semibold text-[#1c1b21]">Alur Pemikiran</Text>
            </View>
            <TextInput
              multiline
              value={alur}
              onChangeText={setAlur}
              className="text-[16px] text-[#474650] leading-relaxed min-h-[120px]"
              placeholder="Bagaimana proses kamu mencapai kesimpulan?"
              textAlignVertical="top"
            />
          </View>

          <View className="bg-[#58569f]/5 rounded-[32px] p-8 border-2 border-dashed border-[#58569f]/20 mb-6">
            <View className="flex-row items-center gap-3 mb-4">
              <MaterialIcons name="auto-awesome" size={24} color="#58569f" />
              <Text className="text-[24px] font-serif font-semibold text-[#1c1b21]">Jawaban Akhir</Text>
            </View>
            <TextInput
              multiline
              value={jawaban}
              onChangeText={setJawaban}
              className="text-[18px] text-[#1c1b21] font-medium leading-relaxed italic min-h-[100px]"
              placeholder="Tuliskan kesimpulan final kamu di sini..."
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* AI Guidance Prompt */}
        <View className="mt-8 bg-[#eae6f0] p-6 rounded-2xl border border-[#58569f]/10 flex-row gap-4 items-start">
          <View className="bg-white p-2 rounded-full shadow-sm">
            <MaterialIcons name="psychology" size={20} color="#58569f" />
          </View>
          <View className="flex-1">
            <Text className="font-serif font-medium text-[18px] text-[#58569f] mb-1">Panduan Refleksi</Text>
            <Text className="text-[#474650] text-[14px] leading-relaxed">
              Coba hubungkan Jawaban Akhirmu dengan satu situasi praktis di minggu depan untuk memperkuat ingatan jangka panjang.
            </Text>
          </View>
        </View>

        <View className="mt-8 mb-12 items-center space-y-4">
          <TouchableOpacity 
            className="w-full py-4 bg-[#58569f] rounded-2xl shadow-xl shadow-indigo-200 flex-row items-center justify-center gap-3 active:scale-95 mb-4"
            onPress={handleSaveToLibrary} 
          >
            <MaterialIcons name="archive" size={22} color="white" />
            <Text className="text-white font-bold text-[16px]">Simpan ke Library</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-[#777682] font-bold text-[12px] uppercase tracking-wider">
              Nanti saja, teruskan eksplorasi
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}