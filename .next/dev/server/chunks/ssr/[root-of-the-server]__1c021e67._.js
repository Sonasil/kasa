module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/lib/firebase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/firebase.ts
__turbopack_context__.s([
    "auth",
    ()=>auth,
    "db",
    ()=>db,
    "googleProvider",
    ()=>googleProvider,
    "storage",
    ()=>storage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/node-esm/index.node.esm.js [app-ssr] (ecmascript)");
;
;
;
;
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyBTycxfDSIQunjsSEqxvkK-79lNq7bJ7Y4"),
    authDomain: ("TURBOPACK compile-time value", "kasa-fc1ce.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "kasa-fc1ce"),
    storageBucket: ("TURBOPACK compile-time value", "kasa-fc1ce.firebasestorage.app"),
    messagingSenderId: ("TURBOPACK compile-time value", "281748931815"),
    appId: ("TURBOPACK compile-time value", "1:281748931815:web:757ede60dc681911910e42"),
    measurementId: ("TURBOPACK compile-time value", "G-J6GZ01NNKL")
};
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApp"])() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig);
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(app);
const googleProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStorage"])(app);
}),
"[project]/hooks/use-toast.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST'
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case 'DISMISS_TOAST':
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: 'UPDATE_TOAST',
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: 'DISMISS_TOAST',
            toastId: id
        });
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: 'DISMISS_TOAST',
                toastId
            })
    };
}
;
}),
"[project]/lib/settings-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsProvider",
    ()=>SettingsProvider,
    "formatMoneyHelper",
    ()=>formatMoneyHelper,
    "getLocale",
    ()=>getLocale,
    "useSettings",
    ()=>useSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-toast.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const defaultSettings = {
    theme: "light",
    currency: "TRY",
    language: "en",
    notificationsEnabled: true
};
const SettingsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const translations = {
    en: {
        // Settings
        settings: "Settings",
        general: "General",
        profile: "Profile",
        currency: "Currency",
        language: "Language",
        notifications: "Notifications",
        theme: "Theme",
        system: "System",
        light: "Light",
        dark: "Dark",
        permissions: "Permissions",
        help: "Help",
        legal: "Legal",
        inviteRate: "Invite & Rate Us",
        selectCurrency: "Select Currency",
        selectLanguage: "Select Language",
        selectTheme: "Select Theme",
        // Groups List
        groupsTitle: "Groups",
        createNewGroup: "Create New Group",
        joinGroup: "Join Group",
        joinViaCode: "Join via Code",
        groupName: "Group Name",
        enterGroupName: "Weekend Trip, Apartment, etc.",
        inviteCode: "Invite Code",
        enterInviteCode: "Enter invite code",
        noGroupsYet: "No groups yet",
        noGroupsDesc: "Create a new group or join an existing one to start tracking expenses with friends and family.",
        membersCount: "members",
        totalExpenses: "Total expenses",
        groupCreated: "Group created",
        groupCreatedDesc: "has been created successfully",
        joinedGroup: "Joined group",
        joinedGroupDesc: "You've successfully joined the group",
        invalidInput: "Invalid input",
        enterGroupNameError: "Please enter a group name",
        enterInviteCodeError: "Please enter an invite code",
        // Status Dialog
        groupBalance: "Group Balance",
        netBalance: "Net Balance",
        youOwe: "You owe",
        youreOwed: "You're owed",
        allSettled: "All Settled!",
        noOutstandingDebts: "No outstanding debts",
        debts: "Debts",
        owes: "owes",
        you: "you",
        You: "You",
        // Record Payment
        recordPayment: "Record Payment",
        trackPayments: "Track received payments",
        member: "Member",
        selectMember: "Select member",
        amount: "Amount",
        paymentType: "Payment Type",
        full: "Full",
        custom: "Custom",
        partial: "Partial",
        enterAmount: "Enter amount",
        recording: "Recording...",
        // Expense Management
        addExpense: "Add Expense",
        description: "Description",
        groceriesEtc: "Groceries, dinner, etc.",
        category: "Category (optional)",
        selectCategory: "Select a category",
        enterCustomCategory: "Enter custom category",
        splitWith: "Split with",
        adding: "Adding...",
        saving: "Saving...",
        saveChanges: "Save Changes",
        expenseDetails: "Expense Details",
        // Categories
        electricity: "Electricity",
        water: "Water",
        groceries: "Groceries/Market",
        internet: "Internet",
        rent: "Rent",
        transport: "Transport",
        dining: "Dining",
        entertainment: "Entertainment",
        other: "Other",
        // Group Page
        status: "Status",
        members: "Members",
        feed: "Feed",
        group: "Group",
        sendMessage: "Send a message",
        typeMessage: "Type a message...",
        markAsPaid: "Mark as Paid",
        edit: "Edit",
        deleteExpense: "Delete Expense",
        paidBy: "Paid by",
        splitBetween: "Split between",
        // Error/Success Messages
        error: "Error",
        success: "Success",
        invalidAmount: "Invalid amount",
        pleaseTryAgain: "Please try again.",
        failedToLoad: "Failed to load",
        paymentRecorded: "Payment recorded",
        expenseAdded: "Expense added successfully",
        expenseUpdated: "Expense updated successfully",
        paymentMarked: "Payment marked",
        couldNotSave: "Could not save settings",
        goBack: "Go Back",
        noActivityYet: "No activity yet",
        settlementRecorded: "Settlement recorded",
        memberJoined: "Member joined",
        someone: "Someone",
        groupMembers: "Group Members",
        owner: "Owner",
        transferOwnership: "Transfer Ownership",
        removeMember: "Remove Member",
        generateInviteCode: "Generate Invite Code",
        generateInviteCodeDesc: "Generate a code to share with others",
        leaveGroup: "Leave Group",
        leaveGroupDesc: "You can leave this group anytime.",
        leaveGroupOwnerDesc: "You're the group owner. Transfer ownership to someone else before leaving.",
        leaveGroupLastMemberDesc: "You're the last member. Leaving will permanently delete this group.",
        useMenuToTransfer: "Use the ⋮ menu next to a member to transfer ownership.",
        // Time
        justNow: "Just now",
        minutesAgo: "m ago",
        hoursAgo: "h ago",
        daysAgo: "d ago",
        // Common
        cancel: "Cancel",
        close: "Close",
        delete: "Delete",
        update: "Update",
        save: "Save",
        email: "Email",
        password: "Password",
        signIn: "Sign In",
        signUp: "Sign Up",
        signOut: "Sign Out",
        // Auth
        welcomeToKasa: "Welcome to Kasa",
        signInDesc: "Sign in to manage your shared expenses",
        createAccount: "Create your account",
        joinKasaDesc: "Join Kasa to start sharing expenses with friends",
        orContinueWith: "Or continue with",
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        loginWithGoogle: "Login with Google",
        signingIn: "Signing in...",
        connecting: "Connecting...",
        creatingAccount: "Creating account...",
        fullName: "Full Name",
        confirmPassword: "Confirm Password",
        enterPassword: "Enter your password",
        enterPasswordConfirm: "Re-enter your password",
        createStrongPassword: "Create a strong password",
        googleSignInFailed: "Google sign-in failed. Please try again.",
        signInFailed: "Sign in failed. Please check your credentials.",
        // Password Strength
        passwordStrength: "Password strength:",
        weak: "Weak",
        fair: "Fair",
        good: "Good",
        strong: "Strong",
        atLeast8Chars: "At least 8 characters",
        upperAndLowerCase: "Upper and lowercase letters",
        atLeastOneNumber: "At least one number",
        passwordsDoNotMatch: "Passwords do not match",
        passwordTooWeak: "Password is too weak",
        invalidEmail: "Invalid email address",
        emailRequired: "Email is required",
        passwordRequired: "Password is required",
        nameRequired: "Full name is required",
        // Profile
        profileUpdated: "Profile updated",
        profileSaved: "Your profile has been saved.",
        couldNotSaveProfile: "Could not save profile",
        totalSpent: "Total Spent",
        balance: "Balance",
        appSettings: "App Settings",
        preferencesPermissions: "Preferences and permissions",
        ksExpenseApp: "Kasa Expense Sharing App",
        signOutConfirmTitle: "Sign Out",
        signOutConfirmDesc: "Are you sure you want to sign out? You'll need to sign in again to access your groups and expenses.",
        memberSince: "Member since",
        noName: "(No name)",
        paid: "paid",
        people: "people",
        hello: "Hello",
        expenseOverview: "Here's your expense overview",
        // Toasts
        invalidSplitAmount: "Invalid split amount",
        splitMismatch: "Split amounts don't match",
        inviteCodeGenerated: "Invite code generated",
        copiedToClipboard: "Copied to clipboard",
        memberRemoved: "Member removed",
        ownershipTransferred: "Ownership transferred",
        leftGroup: "Left group",
        transferOwnershipFirst: "Transfer ownership first",
        paymentReceived: "Payment received",
        createFailed: "Create failed",
        joinFailed: "Join failed",
        invalidCode: "Invalid code",
        inviteMissingGroup: "Invite is missing group information",
        groupNotFound: "Group not found"
    },
    tr: {
        // Settings
        settings: "Ayarlar",
        general: "Genel",
        profile: "Profil",
        currency: "Para birimi",
        language: "Dil",
        notifications: "Bildirimler",
        theme: "Tema",
        system: "Sistem",
        light: "Açık",
        dark: "Koyu",
        permissions: "İzinler",
        help: "Yardım",
        legal: "Hukuki",
        inviteRate: "Davet Et & Puanla",
        selectCurrency: "Para Birimi Seç",
        selectLanguage: "Dil Seç",
        selectTheme: "Tema Seç",
        // Groups List
        groupsTitle: "Gruplar",
        createNewGroup: "Yeni Grup Oluştur",
        joinGroup: "Gruba Katıl",
        joinViaCode: "Kod ile Katıl",
        groupName: "Grup Adı",
        enterGroupName: "Hafta sonu gezisi, Ev, vb.",
        inviteCode: "Davet Kodu",
        enterInviteCode: "Davet kodu gir",
        noGroupsYet: "Henüz grup yok",
        noGroupsDesc: "Arkadaşlarınızla ve ailenizle harcamaları takip etmek için yeni bir grup oluşturun veya mevcut bir gruba katılın.",
        membersCount: "üye",
        totalExpenses: "Toplam harcama",
        groupCreated: "Grup oluşturuldu",
        groupCreatedDesc: "başarıyla oluşturuldu",
        joinedGroup: "Gruba katıldınız",
        joinedGroupDesc: "Gruba başarıyla katıldınız",
        invalidInput: "Geçersiz giriş",
        enterGroupNameError: "Lütfen bir grup adı girin",
        enterInviteCodeError: "Lütfen bir davet kodu girin",
        // Status Dialog
        groupBalance: "Grup Bakiyesi",
        netBalance: "Net Bakiye",
        youOwe: "Borçlusun",
        youreOwed: "Alacaklısın",
        allSettled: "Herkes Ödedi!",
        noOutstandingDebts: "Bekleyen borç yok",
        debts: "Borçlar",
        owes: "borçlu",
        you: "sana",
        You: "Sen",
        // Record Payment
        recordPayment: "Ödeme Kaydet",
        trackPayments: "Alınan ödemeleri kaydet",
        member: "Üye",
        selectMember: "Üye seç",
        amount: "Tutar",
        paymentType: "Ödeme Tipi",
        full: "Tam",
        custom: "Özel",
        partial: "Kısmi",
        enterAmount: "Tutar gir",
        recording: "Kaydediliyor...",
        // Expense Management
        addExpense: "Harcama Ekle",
        description: "Açıklama",
        groceriesEtc: "Market, yemek, vs.",
        category: "Kategori (opsiyonel)",
        selectCategory: "Kategori seç",
        enterCustomCategory: "Özel kategori gir",
        splitWith: "Paylaşım",
        adding: "Ekleniyor...",
        saving: "Kaydediliyor...",
        saveChanges: "Değişiklikleri Kaydet",
        expenseDetails: "Harcama Detayları",
        // Categories  
        electricity: "Elektrik",
        water: "Su",
        groceries: "Market",
        internet: "İnternet",
        rent: "Kira",
        transport: "Ulaşım",
        dining: "Yemek",
        entertainment: "Eğlence",
        other: "Diğer",
        // Group Page
        status: "Durum",
        members: "Üyeler",
        feed: "Akış",
        group: "Grup",
        sendMessage: "Mesaj gönder",
        typeMessage: "Mesaj yaz...",
        markAsPaid: "Ödendi Olarak İşaretle",
        edit: "Düzenle",
        deleteExpense: "Harcamayı Sil",
        paidBy: "Ödeyen",
        splitBetween: "Paylaşanlar",
        // Error/Success Messages
        error: "Hata",
        success: "Başarılı",
        invalidAmount: "Geçersiz tutar",
        pleaseTryAgain: "Lütfen tekrar deneyin.",
        failedToLoad: "Yüklenemedi",
        paymentRecorded: "Ödeme kaydedildi",
        expenseAdded: "Harcama başarıyla eklendi",
        expenseUpdated: "Harcama başarıyla güncellendi",
        paymentMarked: "Ödeme işaretlendi",
        couldNotSave: "Ayarlar kaydedilemedi",
        // Time
        justNow: "Şimdi",
        minutesAgo: "dk önce",
        hoursAgo: "sa önce",
        daysAgo: "gün önce",
        // Common
        cancel: "İptal",
        close: "Kapat",
        delete: "Sil",
        update: "Güncelle",
        save: "Kaydet",
        email: "E-posta",
        password: "Şifre",
        signIn: "Giriş Yap",
        signUp: "Kayıt Ol",
        signOut: "Çıkış Yap",
        // Auth
        welcomeToKasa: "Kasa'ya Hoşgeldiniz",
        signInDesc: "Paylaşılan harcamalarınızı yönetmek için giriş yapın",
        createAccount: "Hesabınızı oluşturun",
        joinKasaDesc: "Arkadaşlarınızla harcama paylaşmak için Kasa'ya katılın",
        orContinueWith: "veya şununla devam et",
        dontHaveAccount: "Hesabınız yok mu?",
        alreadyHaveAccount: "Zaten hesabınız var mı?",
        loginWithGoogle: "Google ile giriş yap",
        signingIn: "Giriş yapılıyor...",
        connecting: "Bağlanılıyor...",
        creatingAccount: "Hesap oluşturuluyor...",
        fullName: "Ad Soyad",
        confirmPassword: "Şifreyi Onayla",
        enterPassword: "Şifrenizi girin",
        enterPasswordConfirm: "Şifrenizi tekrar girin",
        createStrongPassword: "Güçlü bir şifre oluşturun",
        googleSignInFailed: "Google ile giriş başarısız. Lütfen tekrar deneyin.",
        signInFailed: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
        // Password Strength
        passwordStrength: "Şifre gücü:",
        weak: "Zayıf",
        fair: "Orta",
        good: "İyi",
        strong: "Güçlü",
        atLeast8Chars: "En az 8 karakter",
        upperAndLowerCase: "Büyük ve küçük harfler",
        atLeastOneNumber: "En az bir rakam",
        passwordsDoNotMatch: "Şifreler eşleşmiyor",
        passwordTooWeak: "Şifre çok zayıf",
        invalidEmail: "Geçersiz e-posta adresi",
        emailRequired: "E-posta gereklidir",
        passwordRequired: "Şifre gereklidir",
        nameRequired: "Ad soyad gereklidir",
        // Profile
        profileUpdated: "Profil güncellendi",
        profileSaved: "Profiliniz kaydedildi.",
        couldNotSaveProfile: "Profil kaydedilemedi",
        totalSpent: "Toplam Harcama",
        balance: "Bakiye",
        appSettings: "Uygulama Ayarları",
        preferencesPermissions: "Tercihler ve izinler",
        ksExpenseApp: "Kasa Harcama Paylaşım Uygulaması",
        signOutConfirmTitle: "Çıkış Yap",
        signOutConfirmDesc: "Çıkış yapmak istediğinize emin misiniz? Gruplarınıza ve harcamalarınıza erişmek için tekrar giriş yapmanız gerekecek.",
        memberSince: "Üyelik tarihi",
        noName: "(İsimsiz)",
        paid: "ödedi",
        people: "kişi",
        hello: "Merhaba",
        expenseOverview: "Harcama özetiniz",
        // Toasts
        invalidSplitAmount: "Geçersiz paylaşım tutarı",
        splitMismatch: "Paylaşım tutarları eşleşmiyor",
        inviteCodeGenerated: "Davet kodu oluşturuldu",
        copiedToClipboard: "Panoya kopyalandı",
        memberRemoved: "Üye çıkarıldı",
        ownershipTransferred: "Sahiplik devredildi",
        leftGroup: "Gruptan ayrıldı",
        transferOwnershipFirst: "Önce sahipliği devredin",
        paymentReceived: "Ödeme alındı",
        createFailed: "Oluşturma başarısız",
        joinFailed: "Katılma başarısız",
        invalidCode: "Geçersiz kod",
        inviteMissingGroup: "Davet grup bilgisi içermiyor",
        groupNotFound: "Grup bulunamadı",
        goBack: "Geri Dön",
        noActivityYet: "Henüz harcama yok",
        settlementRecorded: "Ödeme kaydedildi",
        memberJoined: "Üye katıldı",
        someone: "Biri",
        groupMembers: "Grup Üyeleri",
        owner: "Kurucu",
        transferOwnership: "Sahipliği Devret",
        removeMember: "Üyeyi Çıkar",
        generateInviteCode: "Davet Kodu Oluştur",
        generateInviteCodeDesc: "Başkalarıyla paylaşmak için kod oluşturun",
        leaveGroup: "Gruptan Ayrıl",
        leaveGroupDesc: "İstediğiniz zaman gruptan ayrılabilirsiniz.",
        leaveGroupOwnerDesc: "Grup kurucusunuz. Ayrılmadan önce sahipliği başkasına devretmelisiniz.",
        leaveGroupLastMemberDesc: "Son üyesiniz. Ayrılırsanız grup kalıcı olarak silinecek.",
        useMenuToTransfer: "Sahipliği devretmek için üyenin yanındaki ⋮ menüsünü kullanın."
    }
};
const getLocale = (settings)=>settings?.language === "tr" ? "tr-TR" : "en-US";
const formatMoneyHelper = (amountCents, settings)=>{
    const locale = getLocale(settings);
    const currency = settings?.currency ?? defaultSettings.currency;
    const safeCents = Number.isFinite(amountCents) ? amountCents : 0;
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency
    }).format(safeCents / 100);
};
function SettingsProvider({ children }) {
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultSettings);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [uid, setUid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const saveTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const unsubUserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const applyThemeClass = ()=>{
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const shouldUseDark = settings.theme === "dark" || settings.theme === "system" && prefersDark;
            if (shouldUseDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };
        applyThemeClass();
        if (settings.theme === "system") {
            const media = window.matchMedia("(prefers-color-scheme: dark)");
            const listener = ()=>applyThemeClass();
            media.addEventListener("change", listener);
            return ()=>media.removeEventListener("change", listener);
        }
        return;
    }, [
        settings.theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsubAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"], (user)=>{
            if (unsubUserRef.current) {
                try {
                    unsubUserRef.current();
                } catch  {}
                unsubUserRef.current = null;
            }
            if (!user) {
                setUid(null);
                setSettings(defaultSettings);
                setLoading(false);
                return;
            }
            setUid(user.uid);
            const userDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], "users", user.uid);
            unsubUserRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])(userDocRef, (snap)=>{
                const data = snap.data();
                const nextSettings = {
                    ...defaultSettings,
                    ...typeof data?.settings === "object" ? data.settings : {}
                };
                setSettings(nextSettings);
                setLoading(false);
            }, (err)=>{
                console.error("Failed to load settings:", err);
                setSettings(defaultSettings);
                setLoading(false);
            });
        }, (err)=>{
            console.error("Auth state error:", err);
            setLoading(false);
        });
        return ()=>{
            unsubAuth();
            if (unsubUserRef.current) {
                try {
                    unsubUserRef.current();
                } catch  {}
            }
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, []);
    const persistSettings = (next)=>{
        if (!uid) return;
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }
        saveTimerRef.current = setTimeout(async ()=>{
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], "users", uid), {
                    settings: next,
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                }, {
                    merge: true
                });
            } catch (err) {
                console.error("Failed to persist settings:", err);
                toast({
                    variant: "destructive",
                    title: "Could not save settings",
                    description: "Please try again."
                });
            }
        }, 250);
    };
    const updateSettings = (partial)=>{
        setSettings((prev)=>{
            const merged = {
                ...prev,
                ...partial
            };
            persistSettings(merged);
            return merged;
        });
    };
    const formatMoney = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (amountCents)=>formatMoneyHelper(amountCents, settings);
    }, [
        settings
    ]);
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const lang = settings.language || "en";
        return (key)=>translations[lang]?.[key] || translations.en?.[key] || key;
    }, [
        settings.language
    ]);
    const value = {
        settings,
        loading,
        setTheme: (theme)=>updateSettings({
                theme
            }),
        setCurrency: (currency)=>updateSettings({
                currency
            }),
        setLanguage: (language)=>updateSettings({
                language
            }),
        setNotificationsEnabled: (value)=>updateSettings({
                notificationsEnabled: value
            }),
        formatMoney,
        t
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/settings-context.tsx",
        lineNumber: 639,
        columnNumber: 10
    }, this);
}
function useSettings() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SettingsContext);
    if (!ctx) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return ctx;
}
}),
"[project]/lib/user-profile.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserProfileProvider",
    ()=>UserProfileProvider,
    "useUserProfile",
    ()=>useUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const UserProfileContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const initialState = {
    uid: null,
    displayName: "",
    email: "",
    photoURL: "",
    loading: true,
    photoUpdatedAt: undefined,
    refreshAuthUser: async ()=>{}
};
const appendCacheBust = (url, updatedAt)=>{
    if (!url) return "";
    if (!updatedAt) return url;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}v=${updatedAt}`;
};
function UserProfileProvider({ children }) {
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialState);
    const unsubUserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsubAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"], async (user)=>{
            if (unsubUserRef.current) {
                try {
                    unsubUserRef.current();
                } catch  {}
                unsubUserRef.current = null;
            }
            if (!user) {
                setProfile({
                    ...initialState,
                    loading: false
                });
                return;
            }
            const userDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], "users", user.uid);
            // Auto-create user document if it doesn't exist
            try {
                const userSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(userDocRef);
                if (!userSnap.exists()) {
                    // Create user document with auth data
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])(userDocRef, {
                        displayName: user.displayName || "",
                        email: user.email || "",
                        photoURL: user.photoURL || "",
                        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                    });
                }
            } catch (error) {
                console.error("Failed to create user document:", error);
            }
            unsubUserRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onSnapshot"])(userDocRef, (snap)=>{
                const data = snap.data();
                const displayName = data?.displayName || user.displayName || "";
                const email = data?.email || user.email || "";
                const rawPhoto = data?.photoURL || user.photoURL || "";
                const updatedAt = data?.updatedAt?.toMillis ? data.updatedAt.toMillis() : undefined;
                const photoURL = appendCacheBust(rawPhoto, updatedAt);
                setProfile({
                    uid: user.uid,
                    displayName,
                    email,
                    photoURL,
                    photoUpdatedAt: updatedAt,
                    loading: false,
                    refreshAuthUser: async ()=>{
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"].currentUser?.reload();
                    }
                });
            }, ()=>{
                setProfile({
                    uid: user.uid,
                    displayName: user.displayName || "",
                    email: user.email || "",
                    photoURL: user.photoURL || "",
                    photoUpdatedAt: undefined,
                    loading: false,
                    refreshAuthUser: async ()=>{
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"].currentUser?.reload();
                    }
                });
            });
        }, ()=>{
            setProfile({
                ...initialState,
                loading: false
            });
        });
        return ()=>{
            try {
                unsubAuth();
            } catch  {}
            if (unsubUserRef.current) {
                try {
                    unsubUserRef.current();
                } catch  {}
            }
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UserProfileContext.Provider, {
        value: profile,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/user-profile.tsx",
        lineNumber: 133,
        columnNumber: 10
    }, this);
}
function useUserProfile() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(UserProfileContext);
    if (!ctx) {
        throw new Error("useUserProfile must be used within UserProfileProvider");
    }
    return ctx;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1c021e67._.js.map