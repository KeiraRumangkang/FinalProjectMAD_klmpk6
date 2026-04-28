import React, { useMemo, useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  SafeAreaView, Modal, Pressable, Image 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { api } from '../../../convex/_generated/api';

const SOCRATIC_QUOTES = [
  'The only true wisdom is in knowing you know nothing. - Socrates',
  'Education is the kindling of a flame, not the filling of a vessel. - Socrates',
  'I cannot teach anybody anything. I can only make them think. - Socrates',
  'Wonder is the beginning of wisdom. - Socrates',
  'The unexamined life is not worth living. - Socrates',
  'Strong minds discuss ideas; curious minds ask better questions.',
  'Learning begins when certainty becomes a question.',
];

export default function DashboardScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [question, setQuestion] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const quoteOfTheDay = useMemo(() => {
    return SOCRATIC_QUOTES[Math.floor(Math.random() * SOCRATIC_QUOTES.length)];
  }, []);
  const avatarUrl = user?.imageUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkId: user.id } : 'skip'
  );
  const displayName = convexUser?.nickname?.trim() || user?.firstName || user?.fullName || 'Student';
  const learningGoal = convexUser?.learningGoal?.trim();
  const streakData = useQuery(
    api.users.getUserStreak,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );
  const activeSessions = useQuery(
    api.sessions.getActiveSessions,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );
  const createSession = useMutation(api.sessions.createSession);
  const streakCount = streakData?.streak ?? 0;

  const formatSessionDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getSessionTitle = (problem: string) => {
    const words = problem.trim().split(/\s+/).slice(0, 3).join(' ');
    return words ? `${words}${problem.trim().split(/\s+/).length > 3 ? '...' : ''}` : 'Sesi Belajar';
  };

  // Fungsi Helper untuk Navigasi & Tutup Drawer
  const navigateTo = (path: string) => {
    setIsDrawerOpen(false);
    // Jika sudah di halaman tersebut, jangan push lagi
    if (pathname === path) return;
    router.push(path as any);
  };

  const handleLogOut = async () => {
    setIsDrawerOpen(false);
    await signOut();
    router.replace('/'); 
  };

  const handleStartSession = async () => {
    if (!question.trim() || !convexUser?._id || isCreatingSession) return;

    try {
      setIsCreatingSession(true);
      const newSessionId = await createSession({
        userId: convexUser._id,
        problem: question.trim(),
      });

      setQuestion('');
      router.push({
        pathname: '/chat/[sessionId]',
        params: { sessionId: newSessionId },
      });
    } catch (error) {
      console.warn('Create session failed:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      
      {/* ========================================== */}
      {/* NAVIGATION DRAWER (SIDEBAR)                */}
      {/* ========================================== */}
      <Modal visible={isDrawerOpen} transparent={true} animationType="fade">
        <View className="flex-1 flex-row">
          <Pressable 
            className="absolute inset-0 bg-black/40" 
            onPress={() => setIsDrawerOpen(false)} 
          />
          
          <View className="w-80 h-full bg-[#fafaf9] py-8 px-4 shadow-2xl flex-col">
            {/* Header Profil di Sidebar */}
            <TouchableOpacity 
              onPress={() => navigateTo('/profile')}
              className="flex-row items-center gap-4 mb-8 px-4 mt-8"
            >
              <View className="relative">
                <Image 
                  source={{ uri: avatarUrl }} 
                  className="w-14 h-14 rounded-full border-2 border-indigo-100"
                />
                <View className="absolute bottom-0 right-0 bg-indigo-600 p-0.5 rounded-full border border-white">
                  <MaterialIcons name="verified" size={10} color="white" />
                </View>
              </View>
              <View>
                <Text className="text-lg font-bold text-indigo-600 font-serif">{displayName}</Text>
                <Text className="text-xs text-gray-500 font-serif">Socratic Learner</Text>
              </View>
            </TouchableOpacity>

            {/* Menu Navigasi Utama */}
            <View className="flex-1 gap-2 border-t border-gray-200 pt-4">
              
              {/* HOME / DASHBOARD */}
              <TouchableOpacity 
                className={`flex-row items-center gap-4 p-4 rounded-xl ${pathname === '/dashboard' ? 'bg-indigo-50' : ''}`}
                onPress={() => navigateTo('/dashboard')}
              >
                <MaterialIcons 
                  name="home" 
                  size={24} 
                  color={pathname === '/dashboard' ? '#4338ca' : '#818cf8'} 
                />
                <Text className={`text-base font-serif ${pathname === '/dashboard' ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>
                  Home / Dashboard
                </Text>
              </TouchableOpacity>

              {/* PROFILE (DITAMBAHKAN) */}
              <TouchableOpacity 
                className={`flex-row items-center gap-4 p-4 rounded-xl ${pathname === '/profile' ? 'bg-indigo-50' : ''}`}
                onPress={() => navigateTo('/profile')}
              >
                <MaterialIcons 
                  name="person" 
                  size={24} 
                  color={pathname === '/profile' ? '#4338ca' : '#818cf8'} 
                />
                <Text className={`text-base font-serif ${pathname === '/profile' ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>
                  My Profile
                </Text>
              </TouchableOpacity>
              
              {/* LIBRARY */}
              <TouchableOpacity 
                className={`flex-row items-center gap-4 p-4 rounded-xl ${pathname === '/library' ? 'bg-indigo-50' : ''}`}
                onPress={() => navigateTo('/library')}
              >
                <MaterialIcons 
                  name="library-books" 
                  size={24} 
                  color={pathname === '/library' ? '#4338ca' : '#818cf8'} 
                />
                <Text className={`text-base font-serif ${pathname === '/library' ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>
                  My Library
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center gap-4 p-4 rounded-xl"
                onPress={() => navigateTo('/settings')}
              >
                <MaterialIcons name="settings" size={24} color="#818cf8" />
                <Text className="text-base text-gray-600 font-serif">Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center gap-4 p-4 rounded-xl mt-4 border-t border-gray-100"
                onPress={handleLogOut}
              >
                <MaterialIcons name="logout" size={24} color="#ef4444" />
                <Text className="text-base text-red-500 font-serif">Log Out</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Sidebar */}
            <View className="mt-auto pt-4 border-t border-gray-200 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-indigo-600 italic font-serif">Nexarity</Text>
              <TouchableOpacity 
                className="p-2 bg-gray-100 rounded-full" 
                onPress={() => setIsDrawerOpen(false)}
              >
                <MaterialIcons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* HEADER UTAMA DASHBOARD (ENHANCED) */}
      <View className="px-6 pt-4 pb-5 bg-[#f3f0ff] border-b border-indigo-100/40 shadow-sm z-10">
  
      {/* Background Glow */}
      <View className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl" />
      <View className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />

      <View className="flex-row justify-between items-center">
    
      {/* LEFT: MENU + LOGO */}
      <View className="flex-row items-center gap-4">
      <TouchableOpacity 
        className="p-2 bg-white/80 rounded-full shadow-sm border border-indigo-100"
        onPress={() => setIsDrawerOpen(true)}
      >
        <MaterialIcons name="menu" size={24} color="#4f46e5" />
      </TouchableOpacity>

      <View>
        <Text className="text-2xl font-bold text-indigo-700 italic font-serif tracking-tight">
          Nexarity
        </Text>
        <Text className="text-[10px] text-indigo-400 -mt-1">
          Think Deeper
        </Text>
      </View>
    </View>

    {/* RIGHT: STREAK BADGE */}
    <TouchableOpacity 
      onPress={() => navigateTo('/profile')}
      className="flex-row items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-indigo-100"
    >
      <Text className="text-base font-bold text-indigo-600">{streakCount}</Text>
      <Text className="text-base">🔥</Text>
    </TouchableOpacity>

  </View>
</View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-1 font-serif">Selamat Belajar,</Text>
          <Text className="text-3xl font-bold text-gray-900 mb-2 font-serif">{displayName}</Text>
          <Text className="text-base text-gray-500">Apa yang ingin kamu diskusikan hari ini?</Text>
        </View>

        {/* Learning Goal Banner */}
        <TouchableOpacity
          activeOpacity={learningGoal ? 1 : 0.85}
          onPress={() => {
            if (!learningGoal) router.push('/edit-profile');
          }}
          className="bg-emerald-50 rounded-3xl shadow-sm border border-emerald-200 p-5 mb-8 overflow-hidden"
        >
          <View className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-100 rounded-full opacity-70" />
          <View className="flex-row items-start gap-3">
            <View className="w-11 h-11 rounded-2xl bg-white items-center justify-center border border-emerald-100 shadow-sm">
              <MaterialIcons name="flag" size={23} color="#047857" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
                Fokus Tujuanmu:
              </Text>
              <Text className="text-[16px] text-emerald-950 font-serif leading-6">
                {learningGoal || 'Tetapkan target belajarmu di menu Edit Profile!'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Input Card */}
        <View className="bg-white rounded-3xl shadow-sm border border-indigo-50 p-5 mb-8">
          <TextInput
            className="w-full min-h-[120px] text-base text-gray-800"
            placeholder="Tempelkan soal atau konsep di sini..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            value={question}
            onChangeText={setQuestion}
          />
          <View className="flex-row justify-end items-end mt-4">
            <TouchableOpacity 
              className="px-6 py-3 bg-[#e2dfff] rounded-full flex-row items-center gap-2"
              onPress={handleStartSession}
              disabled={isCreatingSession}
            >
              <Text className="text-[#403e85] font-bold">{isCreatingSession ? 'Membuka...' : 'Bimbing Saya'}</Text>
              <MaterialIcons name="auto-awesome" size={18} color="#403e85" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Socratic Quote Card */}
        <View className="bg-emerald-50 rounded-3xl shadow-sm border border-emerald-100 p-5 mb-8">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-9 h-9 rounded-full bg-emerald-100 items-center justify-center">
              <MaterialIcons name="format-quote" size={21} color="#047857" />
            </View>
            <Text className="text-sm font-bold text-emerald-700 uppercase tracking-widest">
              Socratic Quote
            </Text>
          </View>
          <Text className="text-[17px] text-emerald-900 italic leading-7 font-serif">
            {quoteOfTheDay}
          </Text>
        </View>

        {/* Section: Sedang Dipelajari */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-xl font-bold text-gray-900">Sedang Dipelajari</Text>
            <TouchableOpacity onPress={() => router.push('/library')}>
              <Text className="text-sm font-semibold text-[#58569f]">Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {activeSessions?.map((session, index) => {
            const sessionTime = session._creationTime ?? session.createdAt;
            const formattedDate = formatSessionDate(sessionTime);
            const sessionRoute = {
              pathname: '/chat/[sessionId]',
              params: { sessionId: session._id },
            } as const;

            if (index === 0) {
              return (
                <TouchableOpacity 
                  key={session._id}
                  onPress={() => router.push(sessionRoute)}
                  activeOpacity={0.9}
                  className="bg-[#4338ca] rounded-[32px] p-6 mb-6 shadow-xl shadow-indigo-200 relative overflow-hidden"
                >
                  <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="px-3 py-1 bg-white/20 rounded-full">
                      <Text className="text-white text-[10px] font-bold uppercase tracking-widest">In Focus Session</Text>
                    </View>
                    <MaterialIcons name="bolt" size={20} color="#fbbf24" />
                  </View>
                  <Text className="text-white text-2xl font-serif font-bold mb-2">{getSessionTitle(session.problem)}</Text>
                  <Text className="text-indigo-100 text-sm leading-5 mb-6 font-light">
                    {session.problem}
                  </Text>
                  <View className="flex-row items-center justify-between border-t border-white/10 pt-4">
                    <Text className="text-white/80 text-xs italic">{formattedDate}</Text>
                    <View className="flex-row items-center">
                      <Text className="text-white font-bold text-xs mr-1">Lanjutkan</Text>
                      <MaterialIcons name="chevron-right" size={18} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity 
                key={session._id}
                className="flex-row items-center p-4 bg-white rounded-2xl border border-indigo-50 mb-3 shadow-sm"
                onPress={() => router.push(sessionRoute)}
              >
                <View className="w-12 h-12 bg-indigo-50 rounded-xl items-center justify-center mr-4">
                  <MaterialIcons name="calculate" size={24} color="#58569f" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900">{getSessionTitle(session.problem)}</Text>
                  <Text className="text-xs text-gray-400">{formattedDate}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#d1d5db" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
