import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // For demo purposes, redirect to login
  // In a real app, you'd check authentication state here
  return <Redirect href="/login" />;
}