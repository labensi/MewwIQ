// ══════════════════════════════════════════════
//  MewIQ  –  firebase-config.js  (v2 – Fixed)
//  ⚠️  Uses window.db to avoid variable conflicts
// ══════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyCpS6Sbg5-li3r23IVK68UuKtxcwHcgQt4",
  authDomain:        "mewiq-10e80.firebaseapp.com",
  projectId:         "mewiq-10e80",
  storageBucket:     "mewiq-10e80.firebasestorage.app",
  messagingSenderId: "270956264723",
  appId:             "1:270956264723:web:988fee1e2b3ff933dbeee6",
  measurementId:     "G-BGJD6GMCQZ"
};

// Initialize Firebase app (guard against duplicate init)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Expose Firestore on window so all scripts share the same instance
window.db = firebase.firestore();

// Analytics – optional (won't crash if SDK not loaded)
try {
  if (typeof firebase.analytics === 'function') {
    window.analytics = firebase.analytics();
  }
} catch (e) {
  console.warn('Analytics unavailable:', e.message);
}

console.log('🔥 Firebase initialized – Firestore ready');

// ── Firestore Security Rules (paste in Firebase Console) ────────────────────
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /leaderboard/{docId} {
//       allow read: if true;
//       allow create, update: if
//         request.resource.data.keys().hasAll(['name','totalScore']) &&
//         request.resource.data.name is string &&
//         request.resource.data.name.size() > 0 &&
//         request.resource.data.name.size() <= 30 &&
//         request.resource.data.totalScore is number;
//       allow delete: if false;
//     }
//   }
// }
// ────────────────────────────────────────────────────────────────────────────
