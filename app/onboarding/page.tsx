"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const GRADE_OPTIONS = [
  "9th Grade", "10th Grade", "11th Grade", "12th Grade",
  "College Freshman", "College Sophomore", "College Junior", "College Senior",
  "Gap Year",
];

const SKILL_SUGGESTIONS = [
  "React", "Python", "Node.js", "iOS Development", "Android", "Machine Learning",
  "UI/UX Design", "Figma", "Video Production", "Data Analysis", "Marketing",
  "Content Strategy", "Business Development", "Finance", "Research", "Writing",
  "Public Speaking", "Backend Development", "Robotics", "Hardware/Electronics",
  "Graphic Design", "Animation", "Social Media", "Grant Writing",
];

export default function OnboardingPage() {
  const { update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [lookingToBuild, setLookingToBuild] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Pre-fill if the user already has a profile (edit mode)
  useEffect(() => {
    let active = true;
    fetch("/api/auth/onboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (data.name) setName(data.name);
        if (data.grade) setGrade(data.grade);
        if (data.school) setSchool(data.school);
        if (data.bio) setBio(data.bio);
        if (Array.isArray(data.skills)) setSkills(data.skills);
        if (data.lookingToBuild) setLookingToBuild(data.lookingToBuild);
        if (data.onboardingComplete) setIsEditing(true);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function addCustomSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, grade, school, bio, skills, lookingToBuild }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }

      await update({ name: data.name, onboardingComplete: true });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= 1 ? "bg-accent text-white" : "bg-surface text-ink-3"}`}>1</div>
            <span className={`text-xs transition-colors ${step === 1 ? "text-ink" : "text-ink-3"}`}>Basics</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= 2 ? "bg-accent text-white" : "bg-surface text-ink-3"}`}>2</div>
            <span className={`text-xs transition-colors ${step === 2 ? "text-ink" : "text-ink-3"}`}>Skills</span>
          </div>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-1">
            {step === 1 ? "Tell us about yourself" : "What can you bring to a team?"}
          </h1>
          <p className="text-sm text-ink-2">
            {step === 1
              ? "This is how other students will find and recognize you."
              : "Pick skills you have and describe what you want to build."}
          </p>
        </div>

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); if (!name || !grade || !school) { setError("Name, grade, and school are required."); return; } setError(""); setStep(2); } : handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-2 mb-1.5">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-2 mb-1.5">Grade</label>
                  <select
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="input"
                  >
                    <option value="">Select grade</option>
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-2 mb-1.5">School</label>
                  <input
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Lincoln High School"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-2 mb-1.5">
                  Bio <span className="text-ink-3">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other students a bit about yourself — what you've built, what drives you..."
                  className="input resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-ink-2 mb-3">
                  Your skills <span className="text-ink-3">— pick all that apply</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_SUGGESTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-100 ${
                        skills.includes(skill)
                          ? "bg-accent text-white border-accent"
                          : "border-border text-ink-2 hover:text-ink hover:border-ink-3 bg-white"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {/* Custom skill input */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); } }}
                    placeholder="Add your own..."
                    className="input flex-1 text-xs"
                  />
                  <button type="button" onClick={addCustomSkill} className="btn-secondary text-xs px-3">
                    Add
                  </button>
                </div>
                {skills.filter((s) => !SKILL_SUGGESTIONS.includes(s)).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.filter((s) => !SKILL_SUGGESTIONS.includes(s)).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-white border border-accent flex items-center gap-1.5"
                      >
                        {skill}
                        <button type="button" onClick={() => toggleSkill(skill)} className="opacity-70 hover:opacity-100">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-2 mb-1.5">
                  What are you looking to build? <span className="text-ink-3">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={lookingToBuild}
                  onChange={(e) => setLookingToBuild(e.target.value)}
                  placeholder="I want to build a tool that helps students find internships, or join a climate tech startup, or explore research in AI safety..."
                  className="input resize-none"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-accent bg-accent/5 border border-accent/20 rounded-lg px-3.5 py-2.5">
              {error}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                Back
              </button>
            )}
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? "Saving..." : step === 1 ? "Continue" : isEditing ? "Save changes" : "Complete profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
