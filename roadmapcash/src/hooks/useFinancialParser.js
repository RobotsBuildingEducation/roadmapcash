import { useState, useCallback } from "react";
import { getGenerativeModel, Schema } from "@firebase/vertexai";
import { ai } from "@/database/firebaseConfig";

const financialDataSchema = Schema.object({
  properties: {
    income: Schema.number({
      description: "Monthly income amount",
      nullable: true,
    }),
    expenses: Schema.array({
      items: Schema.object({
        properties: {
          name: Schema.string({ description: "Name of the expense category" }),
          amount: Schema.number({ description: "Monthly amount for this expense" }),
        },
        required: ["name", "amount"],
      }),
      description: "List of monthly expenses",
    }),
    savingsGoal: Schema.number({
      description: "Total savings goal amount",
      nullable: true,
    }),
    currentSavings: Schema.number({
      description: "Current savings amount",
      nullable: true,
    }),
    summary: Schema.string({
      description: "Brief analysis and advice for the user",
    }),
  },
  required: ["expenses", "summary"],
});

const financialModel = getGenerativeModel(ai, {
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: financialDataSchema,
  },
});

const SYSTEM_PROMPT = `You are a financial analyst assistant. Parse the user's financial information and extract structured data.

Guidelines:
- Extract monthly income if mentioned
- Identify all expense categories and their monthly amounts
- Look for savings goals, emergency fund targets, or financial objectives
- If current savings are mentioned, include them
- Provide a brief, encouraging summary with actionable advice
- If amounts are given weekly, multiply by 4.33 for monthly
- If amounts are given yearly, divide by 12 for monthly
- Round all amounts to whole numbers
- Be conservative with estimates if information is vague`;

export function useFinancialParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState(null);

  const parseFinancialInput = useCallback(async (userInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `${SYSTEM_PROMPT}\n\nUser's financial information:\n${userInput}`;
      const result = await financialModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const parsed = JSON.parse(text);

      // Ensure expenses array exists and has valid data
      if (!parsed.expenses) {
        parsed.expenses = [];
      }

      // Filter out any invalid expenses
      parsed.expenses = parsed.expenses.filter(
        (e) => e && e.name && typeof e.amount === "number" && e.amount > 0
      );

      // Set default values
      if (parsed.income === null || parsed.income === undefined) {
        parsed.income = 0;
      }

      if (parsed.currentSavings === null || parsed.currentSavings === undefined) {
        parsed.currentSavings = 0;
      }

      setFinancialData(parsed);
      return parsed;
    } catch (err) {
      console.error("Error parsing financial data:", err);
      setError(err.message || "Failed to analyze financial data");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setFinancialData(null);
    setError(null);
  }, []);

  return {
    parseFinancialInput,
    clearData,
    financialData,
    isLoading,
    error,
  };
}
