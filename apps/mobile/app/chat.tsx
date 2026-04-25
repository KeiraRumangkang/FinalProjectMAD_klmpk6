import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ChatSessionScreen() {
  const router = useRouter();
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  
  // State untuk mengatur progres Hint
  const [hintStep, setHintStep] = useState(0);

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white/80 border-b border-indigo-100/50 z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full active:bg-indigo-50">
            <MaterialIcons name="arrow-back" size={26} color="#4f46e5" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-indigo-700 font-serif">Nexarity</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-lg text-indigo-600 font-serif tracking-tight">7 🔥</Text>
        </View>
      </View>

      {/* MAIN CHAT AREA */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          className="flex-1 px-8 pt-6"
          contentContainerStyle={{ paddingBottom: 160 }} // Dikurangi karena input diturunkan
          showsVerticalScrollIndicator={false}
        >
          {/* Collapsible Context */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setIsContextExpanded(!isContextExpanded)}
            className="bg-[#f6f2fb] rounded-xl border border-[#c8c5d2]/30 overflow-hidden mb-8"
          >
            <View className="flex-row justify-between items-center p-6">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="lightbulb" size={24} color="#58569f" />
                <Text className="text-[18px] font-bold text-[#58569f] font-serif">Konteks Permasalahan</Text>
              </View>
              <MaterialIcons 
                name={isContextExpanded ? "expand-less" : "expand-more"} 
                size={24} 
                color="#777682" 
              />
            </View>
            {isContextExpanded && (
              <View className="px-6 pb-6">
                <View className="border-l-2 border-[#8b89d6] pl-4">
                  <Text className="text-[15px] text-[#474650] italic leading-relaxed">
                    {'"Dalam sebuah sistem ekonomi yang tertutup, bagaimana peningkatan tabungan masyarakat dapat mempengaruhi investasi jangka panjang tanpa menyebabkan deflasi yang berlebihan?"'}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Chat Bubbles Area */}
          <View className="space-y-6 mb-4">
            {/* AI Bubble 1 */}
            <View className="flex-col items-start max-w-[85%] mb-6">
              <View className="flex-row items-center gap-2 px-1 mb-2">
                <MaterialIcons name="auto-awesome" size={20} color="#58569f" />
                <Text className="text-[12px] font-bold text-[#58569f] uppercase tracking-widest opacity-80 font-serif">Panduan Sokratik</Text>
              </View>
              <View className="bg-[#f0ecf6] p-6 rounded-2xl rounded-tl-none shadow-sm border border-[#e2dfff]/20">
                <Text className="text-[18px] text-[#282933] font-serif leading-relaxed">
                  Sebelum kita masuk ke mekanisme investasi, menurutmu apa yang terjadi pada konsumsi saat tabungan meningkat?
                </Text>
              </View>
            </View>

            {/* User Bubble */}
            <View className="flex-col items-end max-w-[85%] self-end mb-6">
              <View className="bg-[#58569f] p-6 rounded-2xl rounded-tr-none shadow-md mb-2">
                <Text className="text-[16px] text-white leading-relaxed">
                  Sepertinya konsumsi akan menurun karena uang dialokasikan untuk disimpan.
                </Text>
              </View>
              <Text className="text-[12px] font-bold text-[#777682] px-1">Terkirim</Text>
            </View>

            {/* AI Bubble 2 */}
            <View className="flex-col items-start max-w-[85%] mb-6">
              <View className="flex-row items-center gap-2 px-1 mb-2">
                <MaterialIcons name="auto-awesome" size={20} color="#58569f" />
                <Text className="text-[12px] font-bold text-[#58569f] uppercase tracking-widest opacity-80 font-serif">Panduan Sokratik</Text>
              </View>
              <View className="bg-[#f0ecf6] p-6 rounded-2xl rounded-tl-none shadow-sm border border-[#e2dfff]/20">
                <Text className="text-[18px] text-[#282933] font-serif leading-relaxed">
                  Tepat sekali. Jika konsumsi turun, bagaimana para pengusaha melihat prospek penjualan mereka di masa depan?
                </Text>
              </View>
            </View>
          </View>

          {/* PROGRESSIVE HINTS AREA */}
          {hintStep > 0 && (
            <View className="mt-2 mb-8">
              <View className="items-center mb-4">
                <View className="flex-row items-center gap-2 bg-[#eae6f0] px-4 py-2 rounded-full border border-[#c8c5d2]/20">
                  <View className="h-2 w-2 rounded-full bg-[#58569f]" />
                  <Text className="text-[12px] font-bold text-[#474650]">
                    Hint Terbuka: Langkah {hintStep} dari 3
                  </Text>
                </View>
              </View>

              <View className="space-y-3">
                {/* Hint 1 */}
                <View className="bg-[#f0ecf6] rounded-2xl p-6 border border-[#58569f]/10 shadow-sm mb-3">
                  <View className="flex-row items-start gap-3">
                    <MaterialIcons name="psychology" size={24} color="#58569f" style={{ marginTop: 2 }} />
                    <View className="flex-1">
                      <Text className="text-[12px] font-bold text-[#58569f] uppercase tracking-wider mb-1">Hint 1</Text>
                      <Text className="text-[16px] text-[#1c1b21]">
                        Bayangkan jika orang mulai berhenti belanja, apakah pemilik toko berani buka cabang?
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Slot Hint 2 & 3 (Logikanya sama dengan code sebelumnya) */}
                {hintStep < 2 && (
                    <View className="w-full bg-[#f6f2fb] rounded-xl p-4 border border-[#c8c5d2]/30 flex-row items-center justify-between opacity-80 mb-3">
                        <Text className="text-[14px] font-bold text-[#474650]">Hint 2: Terkunci</Text>
                        <MaterialIcons name="lock" size={20} color="#777682" />
                    </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* FIXED BOTTOM CONTROLS - POSISI DITURUNKAN */}
        <View className="absolute bottom-0 w-full">
          
          {/* Input Area: PB-8 membuat posisi lebih rendah ke bawah */}
          <View className="px-8 pb-8 pt-4 pointer-events-auto">
            
            {/* Tombol Hint */}
            {hintStep < 3 && !isSessionComplete && (
              <View className="items-center mb-3">
                <TouchableOpacity 
                  onPress={() => setHintStep(prev => prev + 1)}
                  className="flex-row items-center gap-2 bg-white border border-[#58569f]/20 px-6 py-3 rounded-full shadow-lg shadow-indigo-200 active:scale-95"
                >
                  <MaterialIcons name="psychology" size={20} color="#58569f" />
                  <Text className="text-[14px] font-bold text-[#58569f]">
                    {hintStep === 0 ? "Saya Butuh Hint" : "Hint Berikutnya"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Input Box Atau Tombol Summary */}
            {isSessionComplete ? (
              <TouchableOpacity 
                className="w-full py-4 bg-[#58569f] rounded-full shadow-lg items-center mb-2 active:scale-95"
                onPress={() => router.push('/summary')}
              >
                <Text className="text-white font-bold text-[16px]">Buat Ringkasan Pemahaman</Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-white/95 p-3 rounded-[32px] shadow-2xl border border-indigo-100/50 flex-row items-end gap-3 mb-2">
                <View className="flex-1">
                  <TextInput
                    className="w-full bg-transparent text-[16px] text-[#1c1b21] px-4 py-3 max-h-32 min-h-[45px]"
                    placeholder="Tulis pemikiranmu..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>
                <TouchableOpacity 
                  className={`h-11 w-11 items-center justify-center rounded-full mb-1 ${message.trim() ? 'bg-[#58569f]' : 'bg-gray-300'}`}
                  onPress={() => {
                    if (message.trim()) {
                      setIsSessionComplete(true); 
                      setMessage('');
                    }
                  }}
                >
                  <MaterialIcons name="arrow-upward" size={22} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
