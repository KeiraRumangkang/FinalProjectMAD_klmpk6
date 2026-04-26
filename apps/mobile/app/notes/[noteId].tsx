import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export default function NoteDetailScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Problem');
  const noteIdValue = Array.isArray(noteId) ? noteId[0] : noteId;
  const typedNoteId = noteIdValue as Id<'notes'> | undefined;
  const note = useQuery(
    api.notes.getNoteById,
    typedNoteId ? { noteId: typedNoteId } : 'skip'
  );

  const formatNoteDate = (timestamp?: number) => {
    if (!timestamp) return '';

    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const noteDate = formatNoteDate(note?.createdAt);
  const renderNoteCard = (item: {
    id: string;
    title: string;
    description: string;
    date: string;
    type: string;
    status: string;
  }) => (
    <TouchableOpacity 
      key={item.id}
      className="bg-white p-6 rounded-2xl mb-6 shadow-sm border-l-4 border-indigo-500 shadow-indigo-100"
      onPress={() => setActiveTab('Concepts')}
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
      <Text className="text-sm text-gray-500 leading-5 mb-6">
        {item.description}
      </Text>

      <View className="flex-row justify-between items-center">
        <Text className="text-[10px] italic text-gray-400">{item.status}</Text>

        <View className="flex-row items-center gap-1">
          <Text className="text-xs font-bold text-indigo-600">
            Review Note
          </Text>
          <MaterialIcons name="arrow-forward" size={14} color="#58569f" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-indigo-50">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1c1b21" />
        </TouchableOpacity>
        <Text className="text-xl font-serif font-medium text-gray-900">My Library</Text>
        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden border border-indigo-200 items-center justify-center"
        >
             <MaterialIcons name="person" size={28} color="#58569f" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-baseline mb-2">
            <Text className="text-4xl font-serif font-medium text-gray-900">Study Journal</Text>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">{noteDate}</Text>
          </View>
          <Text className="text-lg text-gray-500 font-light leading-6">
            Review your intellectual progress and revisit past Socratic inquiries.
          </Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-8 h-12">
          {['Problem', 'Concepts', 'Flow', 'Answer'].map((filter) => (
            <TouchableOpacity 
              key={filter}
              onPress={() => setActiveTab(filter)}
              className={`px-6 py-2 rounded-full mr-3 h-10 justify-center ${activeTab === filter ? 'bg-[#e2dfff]' : 'bg-gray-100'}`}
            >
              <Text className={`font-semibold ${activeTab === filter ? 'text-[#403e85]' : 'text-gray-500'}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Note List */}
        <View className="flex flex-col pb-24">
          {activeTab === 'Problem' && renderNoteCard({
              id: 'problem',
              title: 'Masalah Awal',
              description: note?.problem || 'Memuat catatan...',
              date: noteDate,
              type: 'Socratic Session',
              status: 'Problem',
          })}

          {activeTab === 'Concepts' && renderNoteCard({
              id: 'concepts',
              title: 'Konsep Kunci',
              description: note?.keyConcepts || 'Memuat catatan...',
              date: noteDate,
              type: 'Socratic Session',
              status: 'Concepts',
          })}

          {activeTab === 'Flow' && renderNoteCard({
              id: 'flow',
              title: 'Alur Pemikiran',
              description: note?.thinkingFlow || 'Memuat catatan...',
              date: noteDate,
              type: 'Socratic Session',
              status: 'Thinking Flow',
          })}

          {activeTab === 'Answer' && renderNoteCard({
              id: 'answer',
              title: 'Jawaban Akhir',
              description: note?.finalAnswer || 'Memuat catatan...',
              date: noteDate,
              type: 'Socratic Session',
              status: 'Complete',
          })}
          
          <View className="py-12 items-center opacity-30">
            <View className="w-3 h-3 rounded-full bg-indigo-400 mb-2" />
            <Text className="italic font-serif text-gray-600">End of your intellectual path for now.</Text>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        className="absolute bottom-10 right-8 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-xl shadow-indigo-400"
        onPress={() => router.push('/dashboard')}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
