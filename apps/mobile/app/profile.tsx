import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  SafeAreaView, Image 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkId: user.id } : 'skip'
  );
  const streakData = useQuery(
    api.users.getUserStreak,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );
  const notes = useQuery(
    api.notes.getNotes,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );
  const sessions = useQuery(
    api.sessions.getSessions,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );

  const displayName = convexUser?.nickname?.trim() || user?.firstName || user?.fullName || convexUser?.name || 'Scholar';
  const displayEmail = user?.primaryEmailAddress?.emailAddress || convexUser?.email || 'scholar@nexarity.app';
  const avatarUrl = user?.imageUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const fieldLabel = convexUser?.field || 'Scholar';
  const learningGoal = convexUser?.learningGoal?.trim() || 'Target belajar belum diatur.';
  const streakCount = streakData?.streak ?? 0;
  const sessionCount = sessions?.length ?? 0;
  const notesCount = notes?.length ?? 0;
  const strugglesCount = sessionCount - notesCount;
  const journeyNotes = notes?.slice(0, 3) ?? [];

  const formatJourneyDate = (timestamp?: number) => {
    if (!timestamp) return 'Belum ada catatan';

    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const menuItems = [
    { icon: 'person-edit', label: 'Edit Profile', color: '#4338ca', onPress: () => router.push('/edit-profile') },
    { icon: 'settings-suggest', label: 'Pengaturan', color: '#4338ca', onPress: () => router.push('/settings') },
    { icon: 'help-center', label: 'Bantuan', color: '#4338ca', onPress: () => router.push('/settings') },
    { icon: 'logout', label: 'Logout', color: '#ef4444', onPress: handleLogout },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      {/* Header Navigation */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-indigo-50">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1c1b21" />
        </TouchableOpacity>
        <Text className="text-xl font-serif font-medium text-gray-900">Profil</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <MaterialIcons name="settings" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Identity */}
        <View className="items-center py-10 px-6">
          <View className="relative">
            <View className="w-28 h-28 rounded-full border-4 border-indigo-50 shadow-lg overflow-hidden">
              <Image 
                source={{ uri: avatarUrl }} 
                className="w-full h-full"
              />
            </View>
            <View className="absolute bottom-1 right-1 bg-indigo-600 p-1 rounded-full border-2 border-white">
              <MaterialIcons name="verified" size={16} color="white" />
            </View>
          </View>
          
          <View className="flex-col items-center gap-2 mt-4 w-full">
            <Text className="text-2xl font-bold text-gray-900 text-center">{displayName}</Text>
            <Text className="text-gray-500 font-medium text-center" numberOfLines={1}>{displayEmail}</Text>
            <View className="px-4 py-1.5 bg-indigo-100 rounded-full flex-row items-center gap-2 max-w-full">
              <MaterialIcons name="psychology" size={16} color="#4338ca" />
              <Text className="text-indigo-700 font-bold text-xs uppercase tracking-widest text-center">{fieldLabel}</Text>
            </View>
          </View>

          <View className="w-full bg-emerald-50 border border-emerald-100 rounded-3xl p-5 mt-6">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="flag" size={20} color="#047857" />
              <Text className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Target Belajar</Text>
            </View>
            <Text className="text-[16px] text-emerald-900 font-serif italic leading-6">
              {learningGoal}
            </Text>
          </View>
        </View>

        {/* Progress Card (Bento Style) */}
        <View className="px-6 mb-8">
          <View className="bg-indigo-600 p-6 rounded-[32px] shadow-xl shadow-indigo-200 relative overflow-hidden">
            <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
            <View className="relative z-10 flex-row justify-between items-start">
              <View>
                <Text className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Focus</Text>
                <Text className="text-white text-2xl font-bold font-serif">🔥 {streakCount} Day Streak</Text>
                <Text className="text-indigo-100 text-sm mt-1">Kamu konsisten belajar!</Text>
              </View>
              <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
                <MaterialIcons name="auto-awesome" size={28} color="white" />
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row px-6 gap-4 mb-10">
          {[
            { label: 'Sessions', val: String(sessionCount), color: 'text-indigo-600' },
            { label: 'Notes', val: String(notesCount), color: 'text-indigo-600' },
            { label: 'Struggles', val: String(Math.max(0, strugglesCount)), color: 'text-red-500' }
          ].map((stat, i) => (
            <View key={i} className="flex-1 bg-white p-4 rounded-2xl items-center border border-indigo-50 shadow-sm">
              <Text className={`text-2xl font-bold ${stat.color}`}>{stat.val}</Text>
              <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Timeline Perjalanan */}
        <View className="px-6 mb-10">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">Perjalanan Belajarmu</Text>
            <MaterialIcons name="history-edu" size={20} color="#94a3b8" />
          </View>

          <View className="pl-4 border-l-2 border-indigo-50 ml-3">
            {journeyNotes.length > 0 ? (
              journeyNotes.map((note, index) => (
                <View key={note._id} className={`${index < journeyNotes.length - 1 ? 'mb-8' : ''} relative`}>
                  <View className={`absolute -left-[23px] top-0 w-4 h-4 rounded-full ${index === 0 ? 'bg-indigo-600' : 'bg-indigo-300'} border-2 border-white`} />
                  <View className="bg-white p-4 rounded-2xl border border-indigo-50 shadow-sm ml-4">
                    <Text className="text-xs font-bold text-indigo-400 mb-1">{formatJourneyDate(note._creationTime)}</Text>
                    <Text className="font-bold text-gray-900">{note.problem}</Text>
                    <Text className="text-gray-500 text-sm mt-1 leading-5">{note.finalAnswer || 'Catatan belajar tersimpan di Library.'}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="relative">
                <View className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-indigo-300 border-2 border-white" />
                <View className="bg-white p-4 rounded-2xl border border-indigo-50 shadow-sm ml-4">
                  <Text className="text-gray-500 text-sm mt-1 leading-5">Belum ada perjalanan belajar. Mulai sesi pertamamu!</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Action Menu */}
        <View className="px-6 mb-24">
          <View className="bg-gray-100/50 rounded-[32px] overflow-hidden">
            {menuItems.map((item, i) => (
              <TouchableOpacity 
                key={i} 
                className="flex-row items-center justify-between p-5 border-b border-white/50"
                onPress={item.onPress}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
                    <MaterialIcons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <Text className={`font-bold ${item.color === '#ef4444' ? 'text-red-500' : 'text-gray-700'}`}>
                    {item.label}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
