# Firebase setup troubleshooting

## "test-firebase" (or `firebase.ts`) dosyam neden kırmızı görünüyor?

TypeScript ve VS Code, `firebase/auth/react-native` modülünü web ortamında çözemediği için dosyayı kırmızıya boyar. Projede `src/firebase.ts` dosyasında platforma göre ayrım yapıyoruz ve React Native'e özel olan `getReactNativePersistence` fonksiyonunu sadece mobil platformlarda dinamik `require` ile çağırıyoruz. Böylece web tarafında derleme hatası oluşmuyor. Kodunuzda da aynı yaklaşımı uygularsanız kırmızı uyarılar kaybolacaktır.

```ts
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  const { getReactNativePersistence } = require("firebase/auth/react-native");
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}
```

Detaylı implementasyon için `src/firebase.ts` dosyasına bakabilirsiniz.
