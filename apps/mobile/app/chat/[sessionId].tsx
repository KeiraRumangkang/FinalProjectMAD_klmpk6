import React, { useEffect, useRef, useState } from 'react';
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
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export default function ChatSessionScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { sessionId } = useLocalSearchParams();
  const sessionIdValue = Array.isArray(sessionId) ? sessionId[0] : sessionId;
  const typedSessionId = sessionIdValue as Id<'sessions'> | undefined;
  const scrollViewRef = useRef<ScrollView>(null);
  const hasRequestedInitialResponse = useRef(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCompletingSession, setIsCompletingSession] = useState(false);
  
  // State untuk mengatur progres Hint
  const [hintStep, setHintStep] = useState(0);
  const messages = useQuery(
    api.messages.getMessages,
    typedSessionId ? { sessionId: typedSessionId } : 'skip'
  );
  const sessionData = useQuery(
    api.sessions.getSessionById,
    typedSessionId ? { sessionId: typedSessionId } : 'skip'
  );
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkId: user.id } : 'skip'
  );
  const streakData = useQuery(
    api.users.getUserStreak,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );
  const sendMessage = useMutation(api.messages.sendMessage);
  const askGroq = useAction(api.gemini.askGemini);
  const completeSession = useMutation(api.sessions.completeSession);
  const updateStreak = useMutation(api.users.updateStreak);
  const streakCount = streakData?.streak ?? 0;
  const canSummarize = Boolean(messages && messages.length >= 10);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages?.length]);

  useEffect(() => {
    hasRequestedInitialResponse.current = false;
  }, [typedSessionId]);

  useEffect(() => {
    if (
      !typedSessionId ||
      messages === undefined ||
      messages.length > 0 ||
      !sessionData?.problem ||
      hasRequestedInitialResponse.current
    ) {
      return;
    }

    hasRequestedInitialResponse.current = true;
    setIsSending(true);
    void askGroq({
      sessionId: typedSessionId,
      userMessage: `Saya butuh bimbingan tentang: ${sessionData.problem}. Tolong mulai bimbingan sokratik ini dengan menyapa saya dan menanyakan sejauh mana pemahaman saya tentang topik ini.`,
    }).catch((error) => {
      hasRequestedInitialResponse.current = false;
      console.warn('Initial AI response failed:', error);
    }).finally(() => {
      setIsSending(false);
    });
  }, [typedSessionId, messages, sessionData?.problem, askGroq]);

  const handleSendMessage = async () => {
    const inputText = message.trim();

    if (!inputText || !typedSessionId || isSending) return;

    setMessage('');
    setIsSending(true);

    try {
      await sendMessage({
        sessionId: typedSessionId,
        role: 'user',
        content: inputText,
      });
      await askGroq({
        sessionId: typedSessionId,
        userMessage: inputText,
      });
    } catch (error) {
      console.warn('Send message failed:', error);
      setMessage(inputText);
    } finally {
      setIsSending(false);
    }
  };

  const handleHint = async () => {
    if (!typedSessionId || isSending) return;

    setHintStep(prev => Math.min(prev + 1, 3));
    setIsSending(true);

    try {
      await askGroq({
        sessionId: typedSessionId,
        userMessage: 'Tolong berikan saya satu petunjuk kecil secara sokratik untuk memecahkan masalah ini tanpa memberikan jawaban langsung.',
      });
    } catch (error) {
      console.warn('Hint request failed:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!typedSessionId || isCompletingSession) return;

    try {
      setIsCompletingSession(true);
      await completeSession({ sessionId: typedSessionId });
      if (convexUser?._id) {
        await updateStreak({ userId: convexUser._id });
      }
      router.replace({
        pathname: '/summary',
        params: { sessionId: typedSessionId },
      });
    } catch (error) {
      console.warn('Complete session failed:', error);
    } finally {
      setIsCompletingSession(false);
    }
  };

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
          <Text className="text-lg text-indigo-600 font-serif tracking-tight">{streakCount} 🔥</Text>
        </View>
      </View>

      {/* MAIN CHAT AREA */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
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
                    {`"${sessionData?.problem ?? 'Diskusi ini akan dipandu secara sokratik berdasarkan masalah yang kamu kirim dari dashboard.'}"`}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Chat Bubbles Area */}
          <View className="space-y-6 mb-4">
            {messages === undefined && (
              <View className="flex-col items-start max-w-[85%] mb-6">
                <View className="flex-row items-center gap-2 px-1 mb-2">
                  <MaterialIcons name="auto-awesome" size={20} color="#58569f" />
                  <Text className="text-[12px] font-bold text-[#58569f] uppercase tracking-widest opacity-80 font-serif">Panduan Sokratik</Text>
                </View>
                <View className="bg-[#f0ecf6] p-6 rounded-2xl rounded-tl-none shadow-sm border border-[#e2dfff]/20">
                  <Text className="text-[18px] text-[#282933] font-serif leading-relaxed">
                    Memuat percakapan...
                  </Text>
                </View>
              </View>
            )}

            {messages?.map((chatMessage) => {
              if (chatMessage.role === 'user') {
                return (
                  <View key={chatMessage._id} className="flex-col items-end max-w-[85%] self-end mb-6">
                    <View className="bg-[#58569f] p-6 rounded-2xl rounded-tr-none shadow-md mb-2">
                      <Text className="text-[16px] text-white leading-relaxed">
                        {chatMessage.content}
                      </Text>
                    </View>
                    <Text className="text-[12px] font-bold text-[#777682] px-1">Terkirim</Text>
                  </View>
                );
              }

              return (
                <View key={chatMessage._id} className="flex-col items-start max-w-[85%] mb-6">
                  <View className="flex-row items-center gap-2 px-1 mb-2">
                    <MaterialIcons name="auto-awesome" size={20} color="#58569f" />
                    <Text className="text-[12px] font-bold text-[#58569f] uppercase tracking-widest opacity-80 font-serif">Panduan Sokratik</Text>
                  </View>
                  <View className="bg-[#f0ecf6] p-6 rounded-2xl rounded-tl-none shadow-sm border border-[#e2dfff]/20">
                    <Text className="text-[18px] text-[#282933] font-serif leading-relaxed">
                      {chatMessage.content}
                    </Text>
                  </View>
                </View>
              );
            })}
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
            </View>
          )}

          {canSummarize && (
            <TouchableOpacity 
              className="w-full py-4 bg-[#58569f] rounded-full shadow-lg items-center mb-2 active:scale-95"
              onPress={handleCompleteSession}
              disabled={isCompletingSession}
            >
              <Text className="text-white font-bold text-[16px]">
                {isCompletingSession ? 'Menyiapkan Ringkasan...' : 'Buat Ringkasan Pemahaman'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* FIXED BOTTOM CONTROLS - POSISI DITURUNKAN */}
        <View className="absolute bottom-0 w-full">
          
          {/* Input Area: PB-8 membuat posisi lebih rendah ke bawah */}
          <View className="px-8 pb-8 pt-4 pointer-events-auto">
            
            {/* Tombol Hint */}
            {hintStep < 3 && (
              <View className="items-center mb-3">
                <TouchableOpacity 
                  onPress={handleHint}
                  disabled={isSending}
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
                onPress={handleSendMessage}
                disabled={!message.trim() || isSending}
              >
                <MaterialIcons name="arrow-upward" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
