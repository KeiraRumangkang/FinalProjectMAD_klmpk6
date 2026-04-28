import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { api } from '../../../convex/_generated/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [nickname, setNickname] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkId: user.id } : 'skip'
  );
  const updateProfile = useMutation(api.users.updateProfile);

  useEffect(() => {
    if (!convexUser) return;

    setNickname(convexUser.nickname ?? '');
    setLearningGoal(convexUser.learningGoal ?? '');
  }, [convexUser]);

  const handleSave = async () => {
    if (!convexUser?._id || isSaving) return;

    try {
      setIsSaving(true);
      await updateProfile({
        userId: convexUser._id,
        nickname: nickname.trim(),
        learningGoal: learningGoal.trim(),
      });
      Alert.alert('Profil Disimpan', 'Perubahan profil kamu berhasil disimpan.');
      router.back();
    } catch (error) {
      console.warn('Update profile failed:', error);
      Alert.alert('Gagal Menyimpan', 'Silakan coba lagi beberapa saat lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-indigo-50">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1c1b21" />
        </TouchableOpacity>
        <Text className="text-xl font-serif font-medium text-gray-900">Edit Profil</Text>
        <View className="w-10 h-10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-6 pt-8">
          <View className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
            <Text className="text-2xl font-serif font-semibold text-gray-900 mb-2">
              Profil Nexarity
            </Text>
            <Text className="text-sm text-gray-500 leading-5 mb-6">
              Atur nama panggilan dan target belajar yang ingin kamu capai.
            </Text>

            <View className="mb-5">
              <Text className="text-sm font-bold text-gray-700 mb-2">Nama Panggilan</Text>
              <TextInput
                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-indigo-50 text-gray-900"
                placeholder="Contoh: Nat"
                placeholderTextColor="#9ca3af"
                value={nickname}
                onChangeText={setNickname}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-bold text-gray-700 mb-2">Target Belajar</Text>
              <TextInput
                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-indigo-50 text-gray-900 min-h-[110px]"
                placeholder="Contoh: Lebih paham matematika dan berani bertanya."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                value={learningGoal}
                onChangeText={setLearningGoal}
              />
            </View>

            <TouchableOpacity
              className="w-full py-4 bg-indigo-600 rounded-2xl items-center justify-center shadow-xl shadow-indigo-200"
              onPress={handleSave}
              disabled={isSaving || !convexUser?._id}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-[16px]">Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
