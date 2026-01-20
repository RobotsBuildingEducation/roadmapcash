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
          amount: Schema.number({
            description: "Monthly amount for this expense",
          }),
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
- Be conservative with estimates if information is vague
- Handle short or loose statements like "I make 3500 a month and want to save 7000"`;

const MONTHLY_MULTIPLIERS = {
  week: 4.33,
  weekly: 4.33,
  month: 1,
  monthly: 1,
  year: 1 / 12,
  yearly: 1 / 12,
  annual: 1 / 12,
  annually: 1 / 12,
};

const normalizeAmount = (amount, period) => {
  if (!amount || Number.isNaN(amount)) return null;
  const multiplier = period ? MONTHLY_MULTIPLIERS[period] || 1 : 1;
  return Math.round(amount * multiplier);
};

const parseNumber = (value) => {
  if (!value) return null;
  const normalized = value.replace(/,/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const extractMatch = (text, pattern) => {
  const match = text.match(pattern);
  if (!match) return null;
  const amountGroup = match.find(
    (value, index) => index > 0 && /\d/.test(value),
  );
  const periodGroup = match.find(
    (value, index) =>
      index > 0 &&
      typeof value === "string" &&
      /(week|month|year|annual|annually|weekly|monthly|yearly)/i.test(value),
  );
  const amount = parseNumber(amountGroup);
  const period = periodGroup?.toLowerCase();
  return normalizeAmount(amount, period);
};

const parseExpensesFromText = (text) => {
  const lines = text
    .split(/\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);

  const expenses = [];
  const seen = new Map();

  lines.forEach((line) => {
    const match = line.match(
      /^([a-z][a-z\s/&]+?)\s*(?:[:=-]|is)?\s*\$?(\d[\d,]*)(?:\s*(?:per|a)?\s*(week|month|year|annual|annually|weekly|monthly|yearly))?/i,
    );
    if (!match) return;
    const name = match[1].trim();
    const lowerName = name.toLowerCase();
    if (/(income|salary|save|saving|goal|target)/i.test(lowerName)) return;
    const amount = normalizeAmount(
      parseNumber(match[2]),
      match[3]?.toLowerCase(),
    );
    if (!amount) return;
    const current = seen.get(lowerName) || 0;
    seen.set(lowerName, current + amount);
  });

  seen.forEach((amount, name) => {
    expenses.push({ name, amount });
  });

  return expenses;
};

const extractLooseData = (text) => {
  const cleaned = text.toLowerCase();
  const income =
    extractMatch(
      cleaned,
      /(income|salary|make|earn|bring in|take home)[^\d]*\$?(\d[\d,]*)(?:\s*(?:per|a)?\s*(week|month|year|annual|annually|weekly|monthly|yearly))?/i,
    ) ||
    extractMatch(
      cleaned,
      /(?:i|we)\s*(?:make|earn)\s*\$?(\d[\d,]*)(?:\s*(?:per|a)?\s*(week|month|year|annual|annually|weekly|monthly|yearly))?/i,
    );

  const savingsGoal =
    extractMatch(
      cleaned,
      /(savings goal|goal to save|goal of|target to save|target)[^\d]*\$?(\d[\d,]*)(?:\s*(?:per|a)?\s*(week|month|year|annual|annually|weekly|monthly|yearly))?/i,
    ) ||
    extractMatch(
      cleaned,
      /(want to save|plan to save|save up|save)[^\d]*\$?(\d[\d,]*)/i,
    );

  const currentSavings = extractMatch(
    cleaned,
    /(current savings|already saved|have saved|saved so far|currently have)[^\d]*\$?(\d[\d,]*)/i,
  );

  const expenses = parseExpensesFromText(text);

  return {
    income,
    savingsGoal,
    currentSavings,
    expenses,
  };
};

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
      const fallback = extractLooseData(userInput);

      // Ensure expenses array exists and has valid data
      if (!parsed.expenses) {
        parsed.expenses = [];
      }

      if (parsed.expenses.length === 0 && fallback.expenses.length > 0) {
        parsed.expenses = fallback.expenses;
      }

      // Filter out any invalid expenses
      parsed.expenses = parsed.expenses.filter(
        (e) => e && e.name && typeof e.amount === "number" && e.amount > 0,
      );

      // Set default values
      if (
        parsed.income === null ||
        parsed.income === undefined ||
        parsed.income === 0
      ) {
        parsed.income = fallback.income ?? 0;
      }

      if (
        parsed.currentSavings === null ||
        parsed.currentSavings === undefined
      ) {
        parsed.currentSavings = fallback.currentSavings ?? 0;
      }

      if (parsed.savingsGoal === null || parsed.savingsGoal === undefined) {
        parsed.savingsGoal = fallback.savingsGoal ?? null;
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
