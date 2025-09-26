import { Redirect } from 'expo-router';

import { Link } from "expo-router";
// JSX içinde:
<Link href="/test-firebase" style={{ marginTop: 12 }}>Firebase Test Ekranı</Link>


export default function IndexScreen() {
  // For demo purposes, redirect to login
  // In a real app, you'd check authentication state here
  return <Redirect href="/login" />;
}