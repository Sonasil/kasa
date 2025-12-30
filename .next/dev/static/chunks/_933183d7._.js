(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/firebase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm.js [app-client] (ecmascript)");
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
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig);
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
const googleProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStorage"])(app);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-toast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
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
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/settings-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-toast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
const SettingsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
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
        // Dialogs
        creating: "Creating...",
        joining: "Joining...",
        enterGroupNamePlaceholder: "Weekend Trip, Apartment 4B, etc.",
        enterInviteCodePlaceholder: "Enter the group invite code",
        inviteNotFound: "This invite code was not found",
        inviteMissingInfo: "Invite is missing group information",
        couldNotJoin: "Could not join the group",
        couldNotCreate: "Could not create the group",
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
        welcomeToKasa: "Welcome to HesAppcım",
        signInDesc: "Sign in to manage your shared expenses",
        createAccount: "Create your account",
        joinKasaDesc: "Join HesAppcım to start sharing expenses with friends",
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
        ksExpenseApp: "HesAppcım Expense Sharing App",
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
        groupNotFound: "Group not found",
        // Groups Page (Tabs & Headers)
        myGroups: "My Groups",
        activeGroups: "active groups",
        activeTab: "Active",
        archivedTab: "Archived",
        unnamedGroup: "Unnamed group",
        noActiveGroups: "No active groups",
        createFirstGroup: "Create Your First Group",
        noArchivedGroups: "No archived groups",
        createGroupDesc: "Create a group to start tracking expenses with friends and family.",
        loginRequired: "Login required",
        loginRequiredDesc: "Please sign in to join a group.",
        enterCodeTitle: "Enter a code",
        enterCodeDesc: "Please paste the invite code.",
        inviteDisabled: "Invite disabled",
        inviteDisabledDesc: "This invite code is no longer active.",
        genericErrorTitle: "Error",
        genericErrorDesc: "Something went wrong. Please try again.",
        joinedTitle: "Joined!",
        joinedDesc: "You have joined the group.",
        // Navigation
        navHome: "Home",
        navGroups: "Groups",
        navProfile: "Profile",
        // Dashboard
        activityDetails: "Activity Details",
        amountLabel: "Amount",
        userLabel: "User",
        groupLabel: "Group",
        timeLabel: "Time",
        tabAll: "All",
        tabExpenses: "Expenses",
        tabSettlements: "Settlements",
        showLess: "Show Less",
        viewAll: "View All",
        noActivityYet: "No activity yet",
        noExpensesYet: "No expenses yet",
        noSettlementsYet: "No settlements yet",
        // Settings Page
        manageProfileInfo: "Manage your profile information",
        enableNotifications: "Enable app notifications",
        camera: "Camera",
        allowed: "Allowed",
        denied: "Denied",
        photosMedia: "Photos & Media",
        contacts: "Contacts",
        termsOfService: "Terms of Service",
        readTerms: "Read our terms",
        privacyPolicy: "Privacy Policy",
        protectData: "How we protect your data",
        licenses: "Licenses",
        openSourceLicenses: "Open source licenses",
        faq: "FAQ",
        frequentlyAsked: "Frequently asked questions",
        contactSupport: "Contact Support",
        getHelp: "Get help from our team",
        reportProblem: "Report a Problem",
        letUsKnow: "Let us know about issues",
        inviteFriends: "Invite Friends",
        shareKasa: "Share HesAppcım with others",
        rateUs: "Rate Us",
        rateAppStore: "Rate us on the app store",
        notificationsEnabled: "Notifications enabled",
        notificationsDisabled: "Notifications disabled",
        willReceive: "You will receive app notifications",
        wontReceive: "You won't receive app notifications",
        currencyUpdated: "Currency updated",
        currencySet: "Default currency set to",
        languageUpdated: "Language updated",
        languageSet: "Language set to",
        themeUpdated: "Theme updated",
        followingSystem: "Following system appearance",
        switchedTo: "Switched to",
        inviteLinkCopied: "Invite link copied",
        shareLink: "Share this link with your friends to invite them",
        thankYou: "Thank you!",
        redirecting: "Redirecting to app store...",
        searchSettings: "Search settings...",
        allRightsReserved: "All rights reserved",
        permission: "Permission",
        permissionAllows: "This permission allows HesAppcım to access your",
        changeInSettings: "You can change this in your device settings",
        gotIt: "Got it",
        // Error & Success Messages
        changesSaved: "Changes saved successfully",
        failedToUpdate: "Failed to update expense. Please try again.",
        failedToSend: "Failed to send message",
        failedToAdd: "Failed to add expense",
        verificationSent: "Verification email sent",
        checkEmail: "Please check your email to verify your account",
        emailNotVerified: "Email not verified",
        resendVerification: "Resend verification email",
        forgotPassword: "Forgot Password?",
        resetPassword: "Reset Password",
        resetEmailSent: "Password reset email sent",
        enterEmailForReset: "Enter your email to reset password",
        noInternet: "No internet connection. Please check your network.",
        // Group Actions
        archiveGroup: "Archive Group",
        deleteGroup: "Delete Group",
        archiveConfirm: "Archive this group?",
        archiveConfirmDesc: "You can restore it later from the Archived tab.",
        deleteConfirm: "Permanently delete this group?",
        deleteConfirmDesc: "This action cannot be undone. All expenses and data will be lost.",
        archiveSuccess: "Group archived",
        deleteSuccess: "Group deleted",
        onlyOwnerDelete: "Only the group owner can delete this group.",
        unarchiveGroup: "Unarchive Group",
        unarchiveSuccess: "Group unarchived",
        unarchiveConfirm: "Unarchive this group?",
        unarchiveConfirmDesc: "It will move back to the Active tab."
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
        // Dialogs
        creating: "Oluşturuluyor...",
        joining: "Katılıyor...",
        enterGroupNamePlaceholder: "Hafta sonu gezisi, Daire 4B, vb.",
        enterInviteCodePlaceholder: "Grup davet kodunu girin",
        inviteNotFound: "Bu davet kodu bulunamadı",
        inviteMissingInfo: "Davet grup bilgisi içermiyor",
        couldNotJoin: "Gruba katılınamadı",
        couldNotCreate: "Grup oluşturulamadı",
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
        welcomeToKasa: "HesAppcım'a Hoşgeldiniz",
        signInDesc: "Paylaşılan harcamalarınızı yönetmek için giriş yapın",
        createAccount: "Hesabınızı oluşturun",
        joinKasaDesc: "Arkadaşlarınızla harcama paylaşmak için HesAppcım'a katılın",
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
        ksExpenseApp: "HesAppcım Harcama Paylaşım Uygulaması",
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
        useMenuToTransfer: "Sahipliği devretmek için üyenin yanındaki ⋮ menüsünü kullanın.",
        // Groups Page (Tabs & Headers)
        myGroups: "Gruplarım",
        activeGroups: "aktif grup",
        activeTab: "Aktif",
        archivedTab: "Arşiv",
        unnamedGroup: "İsimsiz grup",
        noActiveGroups: "Aktif grup yok",
        createFirstGroup: "İlk Grubunu Oluştur",
        noArchivedGroups: "Arşivlenmiş grup yok",
        createGroupDesc: "Arkadaşlarınızla ve ailenizle harcamaları takip etmek için bir grup oluşturun.",
        loginRequired: "Giriş gerekli",
        loginRequiredDesc: "Gruba katılmak için lütfen giriş yapın.",
        enterCodeTitle: "Bir kod girin",
        enterCodeDesc: "Lütfen davet kodunu yapıştırın.",
        inviteDisabled: "Davet devre dışı",
        inviteDisabledDesc: "Bu davet kodu artık aktif değil.",
        genericErrorTitle: "Hata",
        genericErrorDesc: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
        joinedTitle: "Katıldınız!",
        joinedDesc: "Gruba katıldınız.",
        // Navigation
        navHome: "Ana Sayfa",
        navGroups: "Gruplar",
        navProfile: "Profil",
        // Dashboard
        activityDetails: "Aktivite Detayları",
        amountLabel: "Tutar",
        userLabel: "Kullanıcı",
        groupLabel: "Grup",
        timeLabel: "Zaman",
        tabAll: "Tümü",
        tabExpenses: "Harcamalar",
        tabSettlements: "Hesaplaşmalar",
        showLess: "Daha Az Göster",
        viewAll: "Tümünü Gör",
        noActivityYet: "Henüz aktivite yok",
        noExpensesYet: "Henüz harcama yok",
        noSettlementsYet: "Henüz hesaplaşma yok",
        // Settings Page
        manageProfileInfo: "Profil bilgilerinizi yönetin",
        enableNotifications: "Uygulama bildirimlerini etkinleştir",
        camera: "Kamera",
        allowed: "İzin verildi",
        denied: "Reddedildi",
        photosMedia: "Fotoğraflar ve Medya",
        contacts: "Kişiler",
        termsOfService: "Kullanım Koşulları",
        readTerms: "Koşullarımızı okuyun",
        privacyPolicy: "Gizlilik Politikası",
        protectData: "Verilerinizi nasıl koruyoruz",
        licenses: "Lisanslar",
        openSourceLicenses: "Açık kaynak lisansları",
        faq: "SSS",
        frequentlyAsked: "Sıkça sorulan sorular",
        contactSupport: "Destek Ekibi",
        getHelp: "Ekibimizden yardım alın",
        reportProblem: "Sorun Bildir",
        letUsKnow: "Sorunlar hakkında bize bilgi verin",
        inviteFriends: "Arkadaşlarını Davet Et",
        shareKasa: "HesAppcım'ı başkalarıyla paylaş",
        rateUs: "Bizi Değerlendir",
        rateAppStore: "Bizi uygulama mağazasında değerlendirin",
        notificationsEnabled: "Bildirimler etkinleştirildi",
        notificationsDisabled: "Bildirimler devre dışı",
        willReceive: "Uygulama bildirimleri alacaksınız",
        wontReceive: "Uygulama bildirimleri almayacaksınız",
        currencyUpdated: "Para birimi güncellendi",
        currencySet: "Varsayılan para birimi şu şekilde ayarlandı:",
        languageUpdated: "Dil güncellendi",
        languageSet: "Dil şu şekilde ayarlandı:",
        themeUpdated: "Tema güncellendi",
        followingSystem: "Sistem görünümü takip ediliyor",
        switchedTo: "Şuna geçildi:",
        inviteLinkCopied: "Davet linki kopyalandı",
        shareLink: "Davet etmek için bu linki arkadaşlarınızla paylaşın",
        thankYou: "Teşekkürler!",
        redirecting: "Uygulama mağazasına yönlendiriliyor...",
        searchSettings: "Ayarlarda ara...",
        allRightsReserved: "Tüm hakları saklıdır",
        permission: "İzin",
        permissionAllows: "Bu izin, HesAppcım'ın şunlara erişmesine izin verir:",
        changeInSettings: "Bunu cihaz ayarlarınızdan değiştirebilirsiniz",
        gotIt: "Anladım",
        // Error & Success Messages
        changesSaved: "Değişiklikler kaydedildi",
        failedToUpdate: "Harcama güncellenemedi. Lütfen tekrar deneyin.",
        failedToSend: "Mesaj gönderilemedi",
        failedToAdd: "Harcama eklenemedi",
        verificationSent: "Doğrulama e-postası gönderildi",
        checkEmail: "Hesabınızı doğrulamak için lütfen e-postanızı kontrol edin",
        emailNotVerified: "E-posta doğrulanmadı",
        resendVerification: "Doğrulama e-postasını tekrar gönder",
        forgotPassword: "Şifremi Unuttum?",
        resetPassword: "Şifreyi Sıfırla",
        resetEmailSent: "Şifre sıfırlama e-postası gönderildi",
        enterEmailForReset: "Şifrenizi sıfırlamak için e-postanızı girin",
        noInternet: "İnternet bağlantısı yok. Lütfen ağınızı kontrol edin.",
        // Group Actions
        archiveGroup: "Grubu Arşivle",
        archiveSuccess: "Grup arşivlendi",
        archiveConfirm: "Bu grubu arşivlemek istediğinize emin misiniz?",
        archiveConfirmDesc: "Daha sonra Arşiv sekmesinden geri yükleyebilirsiniz.",
        deleteGroup: "Grubu Sil",
        deleteSuccess: "Grup silindi",
        deleteConfirm: "Bu grubu kalıcı olarak silmek istediğinize emin misiniz?",
        deleteConfirmDesc: "Bu işlem geri alınamaz. Tüm harcamalar ve veriler kaybolacak.",
        onlyOwnerDelete: "Sadece grup sahibi bu grubu silebilir.",
        unarchiveGroup: "Grubu Arşivden Çıkar",
        unarchiveSuccess: "Grup arşivden çıkarıldı",
        unarchiveConfirm: "Bu grubu arşivden çıkarmak istiyor musunuz?",
        unarchiveConfirmDesc: "Aktif sekmesine geri taşınacak."
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
    _s();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultSettings);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [uid, setUid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const saveTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const unsubUserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsProvider.useEffect": ()=>{
            const applyThemeClass = {
                "SettingsProvider.useEffect.applyThemeClass": ()=>{
                    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    const shouldUseDark = settings.theme === "dark" || settings.theme === "system" && prefersDark;
                    if (shouldUseDark) {
                        document.documentElement.classList.add("dark");
                    } else {
                        document.documentElement.classList.remove("dark");
                    }
                }
            }["SettingsProvider.useEffect.applyThemeClass"];
            applyThemeClass();
            if (settings.theme === "system") {
                const media = window.matchMedia("(prefers-color-scheme: dark)");
                const listener = {
                    "SettingsProvider.useEffect.listener": ()=>applyThemeClass()
                }["SettingsProvider.useEffect.listener"];
                media.addEventListener("change", listener);
                return ({
                    "SettingsProvider.useEffect": ()=>media.removeEventListener("change", listener)
                })["SettingsProvider.useEffect"];
            }
            return;
        }
    }["SettingsProvider.useEffect"], [
        settings.theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsProvider.useEffect": ()=>{
            const unsubAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "SettingsProvider.useEffect.unsubAuth": (user)=>{
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
                    const userDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "users", user.uid);
                    unsubUserRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(userDocRef, {
                        "SettingsProvider.useEffect.unsubAuth": (snap)=>{
                            const data = snap.data();
                            const nextSettings = {
                                ...defaultSettings,
                                ...typeof data?.settings === "object" ? data.settings : {}
                            };
                            setSettings(nextSettings);
                            setLoading(false);
                        }
                    }["SettingsProvider.useEffect.unsubAuth"], {
                        "SettingsProvider.useEffect.unsubAuth": (err)=>{
                            console.error("Failed to load settings:", err);
                            setSettings(defaultSettings);
                            setLoading(false);
                        }
                    }["SettingsProvider.useEffect.unsubAuth"]);
                }
            }["SettingsProvider.useEffect.unsubAuth"], {
                "SettingsProvider.useEffect.unsubAuth": (err)=>{
                    console.error("Auth state error:", err);
                    setLoading(false);
                }
            }["SettingsProvider.useEffect.unsubAuth"]);
            return ({
                "SettingsProvider.useEffect": ()=>{
                    unsubAuth();
                    if (unsubUserRef.current) {
                        try {
                            unsubUserRef.current();
                        } catch  {}
                    }
                    if (saveTimerRef.current) {
                        clearTimeout(saveTimerRef.current);
                    }
                }
            })["SettingsProvider.useEffect"];
        }
    }["SettingsProvider.useEffect"], []);
    const persistSettings = (next)=>{
        if (!uid) return;
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }
        saveTimerRef.current = setTimeout(async ()=>{
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "users", uid), {
                    settings: next,
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
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
    const formatMoney = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SettingsProvider.useMemo[formatMoney]": ()=>{
            return ({
                "SettingsProvider.useMemo[formatMoney]": (amountCents)=>formatMoneyHelper(amountCents, settings)
            })["SettingsProvider.useMemo[formatMoney]"];
        }
    }["SettingsProvider.useMemo[formatMoney]"], [
        settings
    ]);
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SettingsProvider.useMemo[t]": ()=>{
            const lang = settings.language || "en";
            return ({
                "SettingsProvider.useMemo[t]": (key)=>translations[lang]?.[key] || translations.en?.[key] || key
            })["SettingsProvider.useMemo[t]"];
        }
    }["SettingsProvider.useMemo[t]"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/settings-context.tsx",
        lineNumber: 896,
        columnNumber: 10
    }, this);
}
_s(SettingsProvider, "B6dw+2xrXwCP7jTV1eu8+O0Zb4E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = SettingsProvider;
function useSettings() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SettingsContext);
    if (!ctx) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return ctx;
}
_s1(useSettings, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "SettingsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/user-profile.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserProfileProvider",
    ()=>UserProfileProvider,
    "useUserProfile",
    ()=>useUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const UserProfileContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
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
    _s();
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState);
    const unsubUserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserProfileProvider.useEffect": ()=>{
            const unsubAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "UserProfileProvider.useEffect.unsubAuth": async (user)=>{
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
                    const userDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "users", user.uid);
                    // Auto-create user document if it doesn't exist
                    try {
                        const userSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userDocRef);
                        if (!userSnap.exists()) {
                            // Create user document with auth data
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(userDocRef, {
                                displayName: user.displayName || "",
                                email: user.email || "",
                                photoURL: user.photoURL || "",
                                createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                            });
                        }
                    } catch (error) {
                        console.error("Failed to create user document:", error);
                    }
                    unsubUserRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(userDocRef, {
                        "UserProfileProvider.useEffect.unsubAuth": (snap)=>{
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
                                refreshAuthUser: {
                                    "UserProfileProvider.useEffect.unsubAuth": async ()=>{
                                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser?.reload();
                                    }
                                }["UserProfileProvider.useEffect.unsubAuth"]
                            });
                        }
                    }["UserProfileProvider.useEffect.unsubAuth"], {
                        "UserProfileProvider.useEffect.unsubAuth": ()=>{
                            setProfile({
                                uid: user.uid,
                                displayName: user.displayName || "",
                                email: user.email || "",
                                photoURL: user.photoURL || "",
                                photoUpdatedAt: undefined,
                                loading: false,
                                refreshAuthUser: {
                                    "UserProfileProvider.useEffect.unsubAuth": async ()=>{
                                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser?.reload();
                                    }
                                }["UserProfileProvider.useEffect.unsubAuth"]
                            });
                        }
                    }["UserProfileProvider.useEffect.unsubAuth"]);
                }
            }["UserProfileProvider.useEffect.unsubAuth"], {
                "UserProfileProvider.useEffect.unsubAuth": ()=>{
                    setProfile({
                        ...initialState,
                        loading: false
                    });
                }
            }["UserProfileProvider.useEffect.unsubAuth"]);
            return ({
                "UserProfileProvider.useEffect": ()=>{
                    try {
                        unsubAuth();
                    } catch  {}
                    if (unsubUserRef.current) {
                        try {
                            unsubUserRef.current();
                        } catch  {}
                    }
                }
            })["UserProfileProvider.useEffect"];
        }
    }["UserProfileProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserProfileContext.Provider, {
        value: profile,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/user-profile.tsx",
        lineNumber: 133,
        columnNumber: 10
    }, this);
}
_s(UserProfileProvider, "B7K+el3aTAP8KSVhTVaIrS+YLCk=");
_c = UserProfileProvider;
function useUserProfile() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(UserProfileContext);
    if (!ctx) {
        throw new Error("useUserProfile must be used within UserProfileProvider");
    }
    return ctx;
}
_s1(useUserProfile, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "UserProfileProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/groups-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GroupsProvider",
    ()=>GroupsProvider,
    "useGroups",
    ()=>useGroups
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const GroupsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    groups: [],
    activeGroups: [],
    archivedGroups: [],
    loading: true,
    error: null
});
function GroupsProvider({ children }) {
    _s();
    const [groups, setGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GroupsProvider.useEffect": ()=>{
            let unsubscribe;
            const unsubAuth = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].onAuthStateChanged({
                "GroupsProvider.useEffect.unsubAuth": (user)=>{
                    if (unsubscribe) {
                        try {
                            unsubscribe();
                        } catch  {}
                        unsubscribe = undefined;
                    }
                    if (!user) {
                        setGroups([]);
                        setLoading(false);
                        setError(null);
                        return;
                    }
                    setLoading(true);
                    setError(null);
                    const groupsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "groups"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("memberIds", "array-contains", user.uid));
                    unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(groupsQuery, {
                        "GroupsProvider.useEffect.unsubAuth": (snapshot)=>{
                            const groupsData = snapshot.docs.map({
                                "GroupsProvider.useEffect.unsubAuth.groupsData": (doc)=>({
                                        id: doc.id,
                                        ...doc.data()
                                    })
                            }["GroupsProvider.useEffect.unsubAuth.groupsData"]);
                            setGroups(groupsData);
                            setLoading(false);
                        }
                    }["GroupsProvider.useEffect.unsubAuth"], {
                        "GroupsProvider.useEffect.unsubAuth": (err)=>{
                            console.error("Groups query error:", err);
                            setError(err.message);
                            setLoading(false);
                        }
                    }["GroupsProvider.useEffect.unsubAuth"]);
                }
            }["GroupsProvider.useEffect.unsubAuth"]);
            return ({
                "GroupsProvider.useEffect": ()=>{
                    try {
                        unsubAuth();
                    } catch  {}
                    if (unsubscribe) {
                        try {
                            unsubscribe();
                        } catch  {}
                    }
                }
            })["GroupsProvider.useEffect"];
        }
    }["GroupsProvider.useEffect"], []);
    // Derive active and archived groups
    const activeGroups = groups.filter((g)=>g.isActive !== false);
    const archivedGroups = groups.filter((g)=>g.isActive === false);
    const value = {
        groups,
        activeGroups,
        archivedGroups,
        loading,
        error
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GroupsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/groups-context.tsx",
        lineNumber: 109,
        columnNumber: 10
    }, this);
}
_s(GroupsProvider, "j9ve90bvbfZj7hGXODH8ul9qRxE=");
_c = GroupsProvider;
function useGroups() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(GroupsContext);
    if (context === undefined) {
        throw new Error("useGroups must be used within a GroupsProvider");
    }
    return context;
}
_s1(useGroups, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "GroupsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert,
    "AlertDescription",
    ()=>AlertDescription,
    "AlertTitle",
    ()=>AlertTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const alertVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current', {
    variants: {
        variant: {
            default: 'bg-card text-card-foreground',
            destructive: 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
function Alert({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert",
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(alertVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = Alert;
function AlertTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c1 = AlertTitle;
function AlertDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c2 = AlertDescription;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Alert");
__turbopack_context__.k.register(_c1, "AlertTitle");
__turbopack_context__.k.register(_c2, "AlertDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/OfflineAlert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflineAlert",
    ()=>OfflineAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/settings-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function OfflineAlert() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const [isOnline, setIsOnline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OfflineAlert.useEffect": ()=>{
            setIsOnline(navigator.onLine);
            const handleOnline = {
                "OfflineAlert.useEffect.handleOnline": ()=>setIsOnline(true)
            }["OfflineAlert.useEffect.handleOnline"];
            const handleOffline = {
                "OfflineAlert.useEffect.handleOffline": ()=>setIsOnline(false)
            }["OfflineAlert.useEffect.handleOffline"];
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            return ({
                "OfflineAlert.useEffect": ()=>{
                    window.removeEventListener('online', handleOnline);
                    window.removeEventListener('offline', handleOffline);
                }
            })["OfflineAlert.useEffect"];
        }
    }["OfflineAlert.useEffect"], []);
    if (isOnline) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-0 left-0 right-0 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
            variant: "destructive",
            className: "rounded-none border-x-0 border-t-0 flex items-center justify-center h-10 px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                    className: "h-4 w-4 mr-2"
                }, void 0, false, {
                    fileName: "[project]/components/OfflineAlert.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                    children: t("noInternet")
                }, void 0, false, {
                    fileName: "[project]/components/OfflineAlert.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/OfflineAlert.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/OfflineAlert.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_s(OfflineAlert, "/SjDuswKBUggdGAKECNtTUJdkd8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
_c = OfflineAlert;
var _c;
__turbopack_context__.k.register(_c, "OfflineAlert");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-2 rounded-xl border py-2 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 29,
        columnNumber: 10
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 10
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-3 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 51,
        columnNumber: 10
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ErrorBoundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorBoundary",
    ()=>ErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
"use client";
;
;
;
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }
    handleReset = ()=>{
        this.setState({
            hasError: false,
            error: null
        });
        window.location.reload();
    };
    render() {
        if (this.state.hasError) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen flex items-center justify-center p-4 bg-background",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "max-w-md p-6 sm:p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto w-fit mb-4 p-3 rounded-full bg-destructive/10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "h-8 w-8 sm:h-10 sm:w-10 text-destructive"
                            }, void 0, false, {
                                fileName: "[project]/components/ErrorBoundary.tsx",
                                lineNumber: 42,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ErrorBoundary.tsx",
                            lineNumber: 41,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl sm:text-2xl font-bold mb-2",
                            children: "Bir şeyler ters gitti"
                        }, void 0, false, {
                            fileName: "[project]/components/ErrorBoundary.tsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-muted-foreground mb-6",
                            children: "Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün."
                        }, void 0, false, {
                            fileName: "[project]/components/ErrorBoundary.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this),
                        this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "mb-6 text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    className: "text-xs text-muted-foreground cursor-pointer mb-2",
                                    children: "Hata detayları"
                                }, void 0, false, {
                                    fileName: "[project]/components/ErrorBoundary.tsx",
                                    lineNumber: 50,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: "text-xs bg-muted p-2 rounded overflow-x-auto",
                                    children: this.state.error.message
                                }, void 0, false, {
                                    fileName: "[project]/components/ErrorBoundary.tsx",
                                    lineNumber: 53,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ErrorBoundary.tsx",
                            lineNumber: 49,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-2 justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: this.handleReset,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ErrorBoundary.tsx",
                                            lineNumber: 60,
                                            columnNumber: 17
                                        }, this),
                                        "Tekrar Dene"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ErrorBoundary.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>window.location.href = "/",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ErrorBoundary.tsx",
                                            lineNumber: 64,
                                            columnNumber: 17
                                        }, this),
                                        "Ana Sayfa"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ErrorBoundary.tsx",
                                    lineNumber: 63,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ErrorBoundary.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ErrorBoundary.tsx",
                    lineNumber: 40,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ErrorBoundary.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_933183d7._.js.map