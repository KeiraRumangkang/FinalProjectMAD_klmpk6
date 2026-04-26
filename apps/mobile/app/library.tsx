import React, { useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function LibraryScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [activeFilter, setActiveFilter] = useState('Newest');
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkId: user.id } : 'skip'
  );
  const notes = useQuery(
    api.notes.getNotes,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );

  const formatNoteDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getNoteTitle = (problem: string) => {
    const words = problem.trim().split(/\s+/).slice(0, 3).join(' ');
    return words ? `${words}${problem.trim().split(/\s+/).length > 3 ? '...' : ''}` : 'Refleksi Pembelajaran';
  };

  const displayedNotes = useMemo(() => {
    const sortedNotes = [...(notes ?? [])];

    if (activeFilter === 'Most Deep') {
      return sortedNotes.sort((a, b) => {
        return b.keyConcepts.length - a.keyConcepts.length;
      });
    }

    if (activeFilter === 'Unfinished') {
      return sortedNotes
        .filter((note) => !note.finalAnswer.trim() || note.finalAnswer.trim().length < 10)
        .sort((a, b) => b._creationTime - a._creationTime);
    }

    return sortedNotes.sort((a, b) => b._creationTime - a._creationTime);
  }, [notes, activeFilter]);

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      {/* Top Header */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white/80 border-b border-indigo-100/50 z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full hover:bg-indigo-50">
            <MaterialIcons name="menu" size={26} color="#4f46e5" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#1c1b21] font-serif">My Library</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          className="w-10 h-10 rounded-full overflow-hidden border border-[#8b89d6]/50"
        >
          <Image 
            source={{ uri: user?.imageUrl || 'https://ui-avatars.com/api/?name=User&background=c3c0ff&color=140c59' }} 
            className="w-full h-full"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View className="mb-8">
          <View className="flex-row items-baseline justify-between mb-3">
            <Text className="text-[32px] font-bold text-[#1c1b21] font-serif">Study Journal</Text>
            <Text className="text-[12px] font-bold text-[#777682] uppercase tracking-widest">{displayedNotes.length} Sessions</Text>
          </View>
          <Text className="text-[16px] text-[#474650] leading-relaxed">
            Review your intellectual progress and revisit past Socratic inquiries.
          </Text>
        </View>

        {/* Filters */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row flex-nowrap pb-2 gap-3">
            {['Newest', 'Most Deep', 'Unfinished'].map((filter) => (
              <TouchableOpacity 
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`${activeFilter === filter ? 'bg-[#e2dfff]' : 'bg-[#f6f2fb] border border-[#e5e1ea]'} px-6 py-2 rounded-full active:scale-95`}
              >
                <Text className={`${activeFilter === filter ? 'text-[#130c59]' : 'text-[#474650]'} font-bold text-[14px]`}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Note List */}
        <View className="space-y-4">
          {displayedNotes.map((note) => (
            <TouchableOpacity 
              key={note._id}
              activeOpacity={0.8}
              className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(88,86,159,0.1)] border-l-4 border-l-[#58569f] mb-4"
              onPress={() => router.push({
                pathname: '/notes/[noteId]',
                params: { noteId: note._id },
              })}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="psychology" size={18} color="#58569f" />
                  <Text className="text-[12px] font-bold text-[#58569f] uppercase tracking-wider">Socratic Session</Text>
                </View>
                <Text className="text-[12px] text-[#777682]">{formatNoteDate(note.createdAt)}</Text>
              </View>
              
              <Text className="text-[20px] font-bold text-[#1c1b21] mb-2 font-serif">{getNoteTitle(note.problem)}</Text>
              <Text className="text-[15px] text-[#474650] leading-relaxed mb-6" numberOfLines={2}>
                {note.finalAnswer}
              </Text>

              <View className="flex-row justify-between items-center">
                <View className="w-8 h-8 rounded-full bg-[#e2dfff] flex items-center justify-center">
                  <Text className="text-[10px] font-bold text-[#58569f]">AI</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-[#58569f] font-bold text-[14px]">Review Note</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#58569f" />
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Empty State / End */}
          <View className="py-12 items-center opacity-50">
            <Text className="font-serif italic text-[#474650]">End of your intellectual path for now.</Text>
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-28 right-6 w-14 h-14 bg-[#58569f] rounded-full shadow-lg items-center justify-center active:scale-95 z-50">
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Bottom Navigation (Opsional, jika ini bukan tab navigation bawaan expo) */}
      <View className="absolute bottom-0 w-full flex-row justify-around items-center px-4 pb-8 pt-4 bg-white border-t border-indigo-100 z-50">
        {/* ... (Isi nav bar seperti pada layar sebelumnya) ... */}
      </View>
    </SafeAreaView>
  );
}
