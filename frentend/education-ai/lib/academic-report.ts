export type AcademicScoreEntry = {
  subject: string;
  score: number | null;
  max_score: number;
};

export type SubjectAverage = {
  subject: string;
  average: number | null;
  gradedCount: number;
};

export function calculateAverageOutOf20(entries: AcademicScoreEntry[]) {
  const graded = entries.filter(
    (entry) =>
      entry.score !== null &&
      Number.isFinite(entry.score) &&
      Number.isFinite(entry.max_score) &&
      entry.max_score > 0,
  );
  const totalMaxScore = graded.reduce((total, entry) => total + entry.max_score, 0);
  if (!totalMaxScore) return null;
  const totalAchievedScore = graded.reduce(
    (total, entry) => total + (entry.score ?? 0),
    0,
  );
  return Number(((totalAchievedScore / totalMaxScore) * 20).toFixed(2));
}

export function getSubjectAverages(entries: AcademicScoreEntry[]): SubjectAverage[] {
  const subjects = [...new Set(entries.map((entry) => entry.subject || "Other"))];
  return subjects.map((subject) => {
    const subjectEntries = entries.filter(
      (entry) => (entry.subject || "Other") === subject,
    );
    const gradedCount = subjectEntries.filter(
      (entry) => entry.score !== null && Number.isFinite(entry.score),
    ).length;
    return {
      subject,
      average: calculateAverageOutOf20(subjectEntries),
      gradedCount,
    };
  });
}

export function getPerformanceStatus(scoreOutOf20: number) {
  if (scoreOutOf20 >= 16) return { text: "Excellent", color: "text-green-600" };
  if (scoreOutOf20 >= 14) return { text: "Good", color: "text-blue-600" };
  if (scoreOutOf20 >= 10) return { text: "Average", color: "text-yellow-600" };
  return { text: "Needs Attention", color: "text-red-600" };
}
