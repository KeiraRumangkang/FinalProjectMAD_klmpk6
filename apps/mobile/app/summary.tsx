import React, { useEffect, useRef, useState } from 'react';
import { 
  ActivityIndicator,
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export default function SummaryScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const { user } = useUser();
  const sessionIdValue = Array.isArray(sessionId) ? sessionId[0] : sessionId;
  const typedSessionId = sessionIdValue as Id<'sessions'> | undefined;
  const hasGeneratedSummary = useRef(false);

  const [summaryData, setSummaryData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [masalah, setMasalah] = useState('');
  const [konsep, setKonsep] = useState('');
  const [alur, setAlur] = useState('');
  const [jawaban, setJawaban] = useState('');

  const sessionData = useQuery(
    api.sessions.getSessionById,
    typedSessionId ? { sessionId: typedSessionId } : 'skip'
  );
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkId: user.id } : 'skip'
  );
  const generateSummary = useAction(api.gemini.generateSummary);
  const createNote = useMutation(api.notes.createNote);
  const updateStreak = useMutation(api.users.updateStreak);

  const stringifySummaryValue = (value: unknown, fallback = '') => {
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
        .join('\n');
    }

    if (typeof value === 'string') {
      return value;
    }

    if (value === null || value === undefined) {
      return fallback;
    }

    return JSON.stringify(value, null, 2);
  };

  useEffect(() => {
    if (!typedSessionId || summaryData || hasGeneratedSummary.current) return;
    if (sessionData === undefined) return;

    hasGeneratedSummary.current = true;

    const loadSummary = async () => {
      try {
        setIsGenerating(true);

        const generatedSummary = await generateSummary({ sessionId: typedSessionId });
        const generatedProblem = stringifySummaryValue(
          generatedSummary?.problem,
          sessionData?.problem || 'Sesi Pembelajaran'
        );
        const generatedKeyConcepts = stringifySummaryValue(generatedSummary?.keyConcepts);
        const generatedThinkingFlow = stringifySummaryValue(generatedSummary?.thinkingFlow);
        const generatedFinalAnswer = stringifySummaryValue(
          generatedSummary?.finalAnswer,
          JSON.stringify(generatedSummary)
        );

        setSummaryData(generatedSummary);
        setMasalah(generatedProblem);
        setKonsep(generatedKeyConcepts);
        setAlur(generatedThinkingFlow);
        setJawaban(generatedFinalAnswer);
      } catch (error) {
        console.error('Gagal membuat ringkasan:', error);
        setSummaryData({});
        setMasalah(sessionData?.problem || 'Sesi Pembelajaran');
      } finally {
        setIsGenerating(false);
      }
    };

    void loadSummary();
  }, [typedSessionId, summaryData, sessionData, generateSummary]);

  const handleSaveToLibrary = async () => {
    if (!user?.id || !typedSessionId || !convexUser?._id || isSaving) return;

    try {
      setIsSaving(true);

      await createNote({
        userId: convexUser._id,
        sessionId: typedSessionId,
        problem: masalah || sessionData?.problem || 'Sesi Pembelajaran',
        keyConcepts: konsep || stringifySummaryValue(summaryData?.keyConcepts),
        thinkingFlow: alur || stringifySummaryValue(summaryData?.thinkingFlow),
        finalAnswer: jawaban || stringifySummaryValue(summaryData?.finalAnswer, JSON.stringify(summaryData)),
      });

      await updateStreak({ userId: convexUser._id });

      router.replace('/dashboard');
    } catch (error) {
      console.error('Gagal menyimpan ke Library:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      {/* ========================================== */}
      {/* HEADER (IKON TELAH DIUBAH MENJADI BACK)    */}
      {/* ========================================== */}
      <View className="flex-row justify-between items-center px-8 py-4 bg-[#FDFDFE] border-b border-[#8B89D6]/10 z-50">
        {/* Perubahan di sini: name="arrow-back" */}
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-[#8B89D6]/5">
          <MaterialIcons name="arrow-back" size={26} color="#58569f" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-serif italic text-[#8B89D6]">Nexarity</Text>
        
        <View className="w-10 h-10 rounded-full bg-[#f0ecf6] overflow-hidden">
          <Image 
            source={{ uri: user?.imageUrl || 'https://i.pravatar.cc/150?img=1' }} 
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
          {isGenerating ? (
            <View className="bg-white rounded-[32px] p-8 border border-[#8b89d6]/10 shadow-lg shadow-indigo-100/50 mb-6">
              <ActivityIndicator color="#58569f" />
              <Text className="text-[16px] text-[#474650] leading-relaxed text-center mt-4">
                Menyusun ringkasan pemahamanmu...
              </Text>
            </View>
          ) : (
            <>
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
            </>
          )}
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
            disabled={isGenerating || isSaving}
          >
            <MaterialIcons name="archive" size={22} color="white" />
            <Text className="text-white font-bold text-[16px]">{isSaving ? 'Menyimpan...' : 'Simpan ke Library'}</Text>
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
