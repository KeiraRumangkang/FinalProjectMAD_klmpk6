import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter(); // <--- Tambahkan baris ini
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  const handleSignIn = () => {
    // Handle sign in logic here
    console.log('Sign in:', { email, password, rememberMe });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Identity */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBox}>
              <MaterialIcons name="school" size={32} color="#ffffff" />
            </View>
            <Text style={styles.brandTitle}>Scholar Portal</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              {/* Heading */}
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>Welcome Back</Text>
                <Text style={styles.subheading}>
                  Sign in to access your academic dashboard
                </Text>
              </View>

              {/* Google Sign In */}
              <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt1N6n6DUqxRSk7SKgiv3gp-Vf4cqHXlz8b9GKiPpXOXIs2RVWtEEUXTQoMVR2kkAgtJrpz4x2xRaiTun8gzNCrKjTuLQAz-IWQwdt3CqQwVIKBRFBLm-Kv0ik9f_rWq0kUxWJqNY4adYVR9ze8HDrA8ZHP0hhK-u9jTLweyGbzeAgdGBhiTDqo28bPRCem8DXR34i00X9qITd4AuzEmLTpCm-_AwfVztZ7VbR0Ia-7cmAEcJdkvPUn4-XJcPvqBFR7a3dHTXfjck',
                  }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH EMAIL</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@university.edu"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me */}
              <TouchableOpacity
                style={styles.rememberMeRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && (
                    <MaterialIcons name="check" size={12} color="#ffffff" />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Keep me signed in</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={styles.signInButton}
                activeOpacity={0.85}
                onPress={() => router.replace('/onboarding/field')}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>
                New to Scholar Portal?{' '}
                <Text style={styles.footerLink}>Create an account</Text>
              </Text>
            </View>
          </View>

          {/* Trust Badges */}
          <View style={styles.trustBadges}>
            <View style={styles.trustItem}>
              <MaterialIcons name="verified" size={18} color="#94a3b8" />
              <Text style={styles.trustText}>Academic Trust</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialIcons name="lock" size={18} color="#94a3b8" />
              <Text style={styles.trustText}>Secure Access</Text>
            </View>
            <View style={styles.trustItem}>
              <MaterialIcons name="language" size={18} color="#94a3b8" />
              <Text style={styles.trustText}>Global Network</Text>
            </View>
          </View>

          {/* Privacy Footer */}
          <TouchableOpacity style={styles.privacyLink}>
            <Text style={styles.privacyText}>Privacy Policy & Terms of Service</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fcf8ff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 48,
  },

  // Brand
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: '#3730a3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#3730a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#312e81',
    letterSpacing: -0.6,
  },

  // Card
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 24,
  },

  // Heading
  headingContainer: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  // Google Button
  googleButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: 0.5,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
    marginHorizontal: 16,
    letterSpacing: 0.8,
  },

  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotPassword: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3730a3',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  eyeButton: {
    padding: 4,
  },

  // Remember Me
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#3730a3',
    borderColor: '#3730a3',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#475569',
  },

  // Sign In Button
  signInButton: {
    height: 48,
    backgroundColor: '#3730a3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#312e81',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  // Card Footer
  cardFooter: {
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 14,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  footerLink: {
    color: '#3730a3',
    fontWeight: '600',
  },

  // Trust Badges
  trustBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 32,
    opacity: 0.5,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  // Privacy
  privacyLink: {
    marginTop: 24,
  },
  privacyText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});