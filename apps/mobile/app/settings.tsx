import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { api } from '../../../convex/_generated/api';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { clerkId: user.id } : 'skip'
  );
  const deleteUser = useMutation(api.users.deleteUser);
  const email = user?.primaryEmailAddress?.emailAddress || convexUser?.email || 'Belum ada email';

  const handleLogOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hapus Akun',
      'Semua sesi, pesan, dan catatan belajar kamu akan dihapus dari Nexarity. Tindakan ini tidak bisa dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            if (!convexUser?._id || isDeleting) return;

            try {
              setIsDeleting(true);
              await deleteUser({ userId: convexUser._id });
              await signOut();
              router.replace('/login');
            } catch (error) {
              console.warn('Delete account failed:', error);
              Alert.alert('Gagal Menghapus Akun', 'Silakan coba lagi beberapa saat lagi.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fcf8ff]">
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-indigo-50">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1c1b21" />
        </TouchableOpacity>
        <Text className="text-xl font-serif font-medium text-gray-900">Pengaturan</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            Account
          </Text>
          <View className="bg-white rounded-[28px] border border-indigo-50 shadow-sm overflow-hidden">
            <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
              <View className="flex-row items-center gap-4 flex-1">
                <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center">
                  <MaterialIcons name="mail" size={22} color="#4338ca" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-700">Email</Text>
                  <Text className="text-sm text-gray-500 mt-1">{email}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-between p-5"
              onPress={handleLogOut}
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center">
                  <MaterialIcons name="logout" size={22} color="#ef4444" />
                </View>
                <Text className="font-bold text-red-500">Log Out</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            About
          </Text>
          <View className="bg-white rounded-[28px] border border-indigo-50 shadow-sm overflow-hidden">
            <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center">
                  <MaterialIcons name="info" size={22} color="#4338ca" />
                </View>
                <Text className="font-bold text-gray-700">Version</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-500">1.0.0</Text>
            </View>

            <View className="flex-row items-center justify-between p-5">
              <View className="flex-row items-center gap-4 flex-1">
                <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center">
                  <MaterialIcons name="groups" size={22} color="#4338ca" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-700">Team</Text>
                  <Text className="text-sm text-gray-500 mt-1">Ariellya, Keira, Natalia</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 px-1">
            Danger Zone
          </Text>
          <View className="bg-red-50 rounded-[28px] border border-red-100 shadow-sm overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center justify-between p-5"
              onPress={handleDeleteAccount}
              disabled={isDeleting || !convexUser?._id}
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center">
                  <MaterialIcons name="delete-forever" size={22} color="#ef4444" />
                </View>
                <Text className="font-bold text-red-600">Delete Account</Text>
              </View>
              {isDeleting ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <MaterialIcons name="chevron-right" size={20} color="#fca5a5" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
