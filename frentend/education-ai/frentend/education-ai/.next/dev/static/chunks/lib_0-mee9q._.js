(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "getFileUrl",
    ()=>getFileUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const rawUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.VITE_API_BASE_URL;
const DIRECT_URL = (rawUrl || "http://127.0.0.1:8000").replace(/\/$/, "");
// In the browser, use the Next.js proxy to avoid CORS. On the server (SSR), call directly.
const API_BASE_URL = ("TURBOPACK compile-time truthy", 1) ? "/api-proxy" : "TURBOPACK unreachable";
const getFileUrl = (filePath)=>("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : `/api-proxy${filePath}`;
const TOKEN_KEY = "eduinsight_access_token";
const ROLE_KEY = "eduinsight_role";
function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
}
async function request(path, init = {}) {
    const token = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : localStorage.getItem(TOKEN_KEY);
    const headers = new Headers(init.headers);
    if (!(typeof FormData !== "undefined" && init.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
        cache: "no-store"
    });
    if (response.status === 401) {
        clearSession();
        if (("TURBOPACK compile-time value", "object") !== "undefined" && window.location.pathname !== "/login") {
            window.location.assign("/login");
        }
        throw new Error("We could not verify your sign-in session. Please sign in with Google again.");
    }
    const payload = await response.json().catch(()=>null);
    if (!response.ok) {
        const detail = payload && typeof payload.detail === "string" ? payload.detail : "Request failed";
        throw new Error(detail);
    }
    return payload;
}
const api = {
    startGoogleSignIn: ()=>{
        window.location.assign(`${DIRECT_URL}/auth/google/login`);
    },
    setupAdmin: (data)=>request("/admin/setup", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    saveSession: (session)=>{
        localStorage.setItem(TOKEN_KEY, session.access_token);
        localStorage.setItem(ROLE_KEY, session.role);
    },
    getSession: ()=>({
            token: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : localStorage.getItem(TOKEN_KEY),
            role: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : localStorage.getItem(ROLE_KEY)
        }),
    logout: ()=>clearSession(),
    getTeacher: ()=>request("/teachers/me"),
    getTeacherClasses: ()=>request("/teachers/me/classes"),
    getTeacherCourses: ()=>request("/teachers/me/courses"),
    getTeacherExercises: ()=>request("/teachers/me/exercises"),
    createCourse: (data)=>{
        const formData = new FormData();
        formData.append("course_name", data.course_name);
        formData.append("class_id", String(data.class_id));
        formData.append("semester", data.semester);
        if (data.file) formData.append("file", data.file);
        return request("/teachers/me/courses", {
            method: "POST",
            body: formData
        });
    },
    createExercise: (data)=>{
        const formData = new FormData();
        formData.append("exercise_name", data.exercise_name);
        formData.append("course_id", String(data.course_id));
        formData.append("max_score", String(data.max_score));
        formData.append("file", data.file, data.file.name);
        return request("/teachers/me/exercises", {
            method: "POST",
            body: formData
        });
    },
    sendClassAnnouncement: (data)=>request("/teachers/me/notifications", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    sendStudentFeedback: (studentId, data)=>request(`/teachers/me/notifications/${studentId}`, {
            method: "POST",
            body: JSON.stringify(data)
        }),
    getTeacherStudents: ()=>request("/teachers/me/students"),
    getNotifications: ()=>request("/notifications/"),
    getAdminNotifications: ()=>request("/admin/notifications"),
    sendAdminNotification: (data)=>request("/admin/notifications", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    getAdminProfile: ()=>request("/admin/me"),
    getAttendanceStudents: (classId)=>request(`/teachers/me/attendance/classes/${classId}/students`),
    saveAttendance: (classId, date, records)=>request("/teachers/me/attendance", {
            method: "POST",
            body: JSON.stringify({
                class_id: classId,
                date,
                records
            })
        }),
    getTeacherAttendance: (classId, month)=>request(`/teachers/me/attendance${classId || month ? `?${new URLSearchParams({
            ...classId ? {
                class_id: String(classId)
            } : {},
            ...month ? {
                month
            } : {}
        })}` : ""}`),
    getTeacherGrades: ()=>request("/teachers/me/grades"),
    getExerciseSubmissions: (exerciseId)=>request(`/submissions/exercise/${exerciseId}`),
    createGrades: (grades)=>Promise.all(grades.map((grade)=>request("/teachers/me/grades", {
                method: "POST",
                body: JSON.stringify(grade)
            }))).then(()=>({
                message: "Grades saved successfully."
            })),
    updateGrade: (gradeId, score)=>request(`/teachers/me/grades/${gradeId}`, {
            method: "PUT",
            body: JSON.stringify({
                score
            })
        }),
    getStudentProfile: ()=>request("/students/me"),
    getStudentCourses: ()=>request("/students/me/courses"),
    getStudentExercises: ()=>request("/students/me/exercises"),
    getStudentGrades: ()=>request("/students/me/grades"),
    getStudentSubmissions: ()=>request("/students/me/submissions"),
    createSubmission: (data)=>{
        const formData = new FormData();
        formData.append("exercise_id", String(data.exercise_id));
        formData.append("file", data.file);
        return request("/students/me/submissions", {
            method: "POST",
            body: formData
        });
    },
    replaceStudentSubmission: (submissionId, file)=>{
        const formData = new FormData();
        formData.append("file", file);
        return request(`/students/me/submissions/${submissionId}`, {
            method: "PUT",
            body: formData
        });
    },
    deleteStudentSubmission: (submissionId)=>request(`/students/me/submissions/${submissionId}`, {
            method: "DELETE"
        }),
    getStudentNotifications: ()=>request("/students/me/notifications"),
    updateStudentProfile: (data)=>request("/students/me", {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    updateTeacherProfile: (data)=>request("/teachers/me", {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    getStudents: ()=>request("/admin/students"),
    searchStudents: (fullName)=>request(`/admin/students/search?full_name=${encodeURIComponent(fullName)}`),
    getTeachers: ()=>request("/admin/teachers"),
    searchTeachers: (fullName)=>request(`/admin/teachers/search?full_name=${encodeURIComponent(fullName)}`),
    getClasses: ()=>request("/admin/classes"),
    createClass: (data)=>request("/admin/classes", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    updateAdminProfile: (data)=>request("/admin/me", {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    assignStudentClass: (studentId, classId)=>request(`/admin/students/${studentId}/class/${classId}`, {
            method: "POST"
        }),
    getStudentReport: (studentId)=>request(`/admin/students/${studentId}/report`),
    createStudent: (data)=>request("/admin/students", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    updateStudent: (studentId, data)=>request(`/admin/students/${studentId}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    deleteStudent: (studentId)=>request(`/admin/students/${studentId}`, {
            method: "DELETE"
        }),
    createTeacher: (data)=>request("/admin/teachers", {
            method: "POST",
            body: JSON.stringify(data)
        }),
    updateTeacher: (teacherId, data)=>request(`/admin/teachers/${teacherId}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    deleteTeacher: (teacherId)=>request(`/admin/teachers/${teacherId}`, {
            method: "DELETE"
        }),
    assignTeacherClasses: (teacherId, classIds)=>request(`/admin/teachers/${teacherId}/classes`, {
            method: "POST",
            body: JSON.stringify({
                class_ids: classIds
            })
        }),
    updateClass: (classId, data)=>request(`/admin/classes/${classId}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),
    deleteClass: (classId)=>request(`/admin/classes/${classId}`, {
            method: "DELETE"
        }),
    getMonthlyAttendance: (classId, month)=>request(`/admin/attendance/report?class_id=${classId}&month=${month}`)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LANGUAGE_KEY",
    ()=>LANGUAGE_KEY,
    "languages",
    ()=>languages,
    "translate",
    ()=>translate
]);
const LANGUAGE_KEY = "eduinsight_language";
const languages = [
    {
        value: "en",
        label: "English",
        nativeLabel: "English"
    },
    {
        value: "fr",
        label: "French",
        nativeLabel: "Francais"
    },
    {
        value: "ar",
        label: "Arabic",
        nativeLabel: "العربية"
    }
];
const translations = {
    en: {
        workspace: "Workspace",
        overview: "Overview",
        dashboard: "Dashboard",
        reports: "Reports",
        notifications: "Notifications",
        profile: "Profile",
        myclasses: "My Classes",
        mystudents: "My Students",
        mycourses: "My Courses",
        submissions: "Submissions",
        attendance: "Attendance",
        progress: "Progress",
        logout: "Logout",
        adminAccount: "Admin Account",
        adminWorkspace: "Admin workspace",
        communicationCenter: "Communication center",
        notificationsTitle: "Notifications",
        sendToClassOrStudent: "Send an announcement to a class or select one student by name.",
        wholeClass: "Whole class",
        oneStudent: "One student",
        class: "Class",
        selectStudent: "Select a student",
        title: "Title",
        message: "Message",
        sendNotification: "Send notification",
        sending: "Sending...",
        selectStudentFirst: "Select a student first.",
        notificationSent: "Notification sent successfully.",
        allStudentsIn: "This notification will be sent to all students in",
        noStudentsInClass: "No students in this class.",
        noClasses: "No classes available.",
        welcomeBack: "Welcome back",
        signInAccount: "Sign in to your account",
        email: "Email",
        password: "Password",
        signIn: "Sign In",
        language: "Language"
    },
    fr: {
        workspace: "Espace de travail",
        overview: "Vue d'ensemble",
        dashboard: "Tableau de bord",
        reports: "Rapports",
        notifications: "Notifications",
        profile: "Profil",
        myclasses: "Mes classes",
        mystudents: "Mes eleves",
        mycourses: "Mes cours",
        submissions: "Devoirs remis",
        attendance: "Presence",
        progress: "Progression",
        logout: "Se deconnecter",
        adminAccount: "Compte administrateur",
        adminWorkspace: "Espace administrateur",
        communicationCenter: "Centre de communication",
        notificationsTitle: "Notifications",
        sendToClassOrStudent: "Envoyez une annonce a une classe ou selectionnez un eleve.",
        wholeClass: "Toute la classe",
        oneStudent: "Un eleve",
        class: "Classe",
        selectStudent: "Selectionner un eleve",
        title: "Titre",
        message: "Message",
        sendNotification: "Envoyer la notification",
        sending: "Envoi...",
        selectStudentFirst: "Selectionnez d'abord un eleve.",
        notificationSent: "Notification envoyee avec succes.",
        allStudentsIn: "Cette notification sera envoyee a tous les eleves de",
        noStudentsInClass: "Aucun eleve dans cette classe.",
        noClasses: "Aucune classe disponible.",
        welcomeBack: "Bon retour",
        signInAccount: "Connectez-vous a votre compte",
        email: "E-mail",
        password: "Mot de passe",
        signIn: "Se connecter",
        language: "Langue"
    },
    ar: {
        workspace: "مساحة العمل",
        overview: "نظرة عامة",
        dashboard: "لوحة التحكم",
        reports: "التقارير",
        notifications: "الإشعارات",
        profile: "الملف الشخصي",
        myclasses: "فصولي",
        mystudents: "طلابي",
        mycourses: "دروسي",
        submissions: "التسليمات",
        attendance: "الحضور",
        progress: "التقدم",
        logout: "تسجيل الخروج",
        adminAccount: "حساب المسؤول",
        adminWorkspace: "مساحة عمل المسؤول",
        communicationCenter: "مركز التواصل",
        notificationsTitle: "الإشعارات",
        sendToClassOrStudent: "أرسل إعلانا إلى فصل أو اختر طالبا واحدا بالاسم.",
        wholeClass: "الفصل بالكامل",
        oneStudent: "طالب واحد",
        class: "الفصل",
        selectStudent: "اختر طالبا",
        title: "العنوان",
        message: "الرسالة",
        sendNotification: "إرسال الإشعار",
        sending: "جار الإرسال...",
        selectStudentFirst: "اختر طالبا أولا.",
        notificationSent: "تم إرسال الإشعار بنجاح.",
        allStudentsIn: "سيتم إرسال هذا الإشعار إلى جميع الطلاب في",
        noStudentsInClass: "لا يوجد طلاب في هذا الفصل.",
        noClasses: "لا توجد فصول متاحة.",
        welcomeBack: "مرحبًا بعودتك",
        signInAccount: "سجل الدخول إلى حسابك",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        signIn: "تسجيل الدخول",
        language: "اللغة"
    }
};
function translate(language, key) {
    return translations[language][key] ?? translations.en[key] ?? key;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_0-mee9q._.js.map