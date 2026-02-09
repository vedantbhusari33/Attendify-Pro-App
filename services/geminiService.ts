
import { GoogleGenAI, Type } from "@google/genai";
import { AttendanceRecord, Student } from "../types";

// Analyze attendance data and generate executive insights using Gemini
export const generateAttendanceInsights = async (records: AttendanceRecord[], students: Student[]) => {
  // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const dataSummary = {
    totalRecords: records.length,
    students: students.map(s => s.name),
    recentAttendance: records.slice(-20).map(r => `${r.name}: ${r.status} on ${r.date}`)
  };

  try {
    // Basic Text Task: Summarization and reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this attendance data and provide a professional executive summary. Identify any students with declining attendance and suggest 3 actionable improvements for classroom engagement. Data: ${JSON.stringify(dataSummary)}`,
      config: {
        // Disable thinking for faster response on text tasks
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // The GenerateContentResponse object features a text property (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI insights at this time. Please check your internet connection or API key.";
  }
};
