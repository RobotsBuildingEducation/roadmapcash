import { useState, useCallback } from "react";
import { simplemodel } from "@/database/firebaseConfig";

const SYSTEM_PROMPT = `You are an opinionated financial coach who creates personalized, actionable financial plans. You're direct, specific, and encouraging.

IMPORTANT: Generate a COMPLETE, DETAILED financial plan with specific recommendations.

Guidelines for parsing:
- Extract monthly income if mentioned
- Identify all expense categories and their monthly amounts
- Look for savings goals, emergency fund targets, or financial objectives
- If current savings are mentioned, include them
- If amounts are given weekly, multiply by 4.33 for monthly
- If amounts are given yearly, divide by 12 for monthly
- Round all amounts to whole numbers

Guidelines for recommendations (BE OPINIONATED):
- For each expense, give a SPECIFIC recommendation - don't be generic
- Classify expenses as essential (housing, utilities, basic food, healthcare), important (transportation, insurance, reasonable phone), or discretionary (entertainment, dining out, subscriptions)
- If an expense seems high for its category, say so and suggest a specific target
- If they're overspending on discretionary items, be direct about cutting back
- Suggest specific alternatives (e.g., "Switch from $150 cable to $15 streaming")

For the plan:
- Create a motivating, personalized title based on their goal (e.g., "Your Path to a $10K Emergency Fund")
- Use the 50/30/20 rule as a baseline but adjust based on their situation
- Strategies should be SPECIFIC to their expenses, not generic advice
- Action items should be things they can do THIS WEEK
- Be encouraging but realistic about the timeline
- If they have high-interest debt, prioritize that
- If they have no emergency fund, that's priority #1
- Calculate potential savings by looking at expenses that could be reduced

Additional context about the user (if provided) should heavily influence your recommendations.

Return ONLY valid JSON with the structure described in the prompt.`;

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const finalizeFinancialData = useCallback((parsed, fallback) => {
    const result = { ...parsed };

    if (!result.expenses) {
      result.expenses = fallback.expenses || [];
    }

    if (result.expenses.length === 0 && fallback.expenses?.length > 0) {
      result.expenses = fallback.expenses.map((expense) => ({
        ...expense,
        recommendation: expense.recommendation || "Review this expense",
        priority: expense.priority || "important",
      }));
    }

    result.expenses = result.expenses
      .filter((expense) => expense && expense.name && typeof expense.amount === "number" && expense.amount > 0)
      .map((expense) => ({
        ...expense,
        recommendation: expense.recommendation || "Review this expense",
        priority: expense.priority || "important",
      }));

    if (result.income === null || result.income === undefined || result.income === 0) {
      result.income = fallback.income ?? 0;
    }

    if (result.currentSavings === null || result.currentSavings === undefined) {
      result.currentSavings = fallback.currentSavings ?? 0;
    }

    if (result.savingsGoal === null || result.savingsGoal === undefined) {
      result.savingsGoal = fallback.savingsGoal ?? null;
    }

    const totalExpenses = result.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlySavings = (result.income || 0) - totalExpenses;
    const basePlan = fallback.plan || {};
    const plan = result.plan || {};

    const monthlyBudget = plan.monthlyBudget || basePlan.monthlyBudget || {
      needs: Math.round((result.income || 0) * 0.5),
      wants: Math.round((result.income || 0) * 0.3),
      savings: Math.round((result.income || 0) * 0.2),
    };

    result.plan = {
      title: plan.title || basePlan.title || "Your Financial Roadmap",
      overview:
        plan.overview ||
        basePlan.overview ||
        "Let's analyze your finances and create a plan to reach your goals.",
      monthlyBudget,
      strategies: plan.strategies || basePlan.strategies || [],
      actionItems: plan.actionItems || basePlan.actionItems || [],
      weeklyCheckIn:
        plan.weeklyCheckIn ||
        basePlan.weeklyCheckIn ||
        "Review your spending and track progress toward your goal.",
      potentialSavings:
        plan.potentialSavings ||
        basePlan.potentialSavings ||
        Math.max(0, monthlySavings),
      motivationalNote:
        plan.motivationalNote ||
        basePlan.motivationalNote ||
        "You've taken the first step by creating a plan. Stay consistent!",
    };

    return result;
  }, []);

  const parseFinancialInput = useCallback(async (userInput, additionalContext = "") => {
    setIsLoading(true);
    setError(null);

    try {
      let prompt = `${SYSTEM_PROMPT}\n\nUser's financial information:\n${userInput}`;

      if (additionalContext.trim()) {
        prompt += `\n\nAdditional context about the user's situation, preferences, or constraints:\n${additionalContext}`;
      }

      const result = await simplemodel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const parsed = JSON.parse(text);
      const fallback = extractLooseData(userInput);
      const finalized = finalizeFinancialData(parsed, fallback);

      setFinancialData(finalized);
      return finalized;
    } catch (err) {
      console.error("Error parsing financial data:", err);
      setError(err.message || "Failed to analyze financial data");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [finalizeFinancialData]);

  const clearData = useCallback(() => {
    setFinancialData(null);
    setError(null);
  }, []);

  const updateFinancialData = useCallback(
    async (currentData, updateRequest, additionalContext = "") => {
      if (!currentData || !updateRequest?.trim()) return null;

      setIsUpdating(true);
      setUpdateError(null);

      try {
        let prompt = `${SYSTEM_PROMPT}

You are updating an existing financial plan. Keep anything not mentioned the same.

Current financial data (JSON):
${JSON.stringify(currentData, null, 2)}

Requested updates:
${updateRequest}`;

        if (additionalContext.trim()) {
          prompt += `\n\nAdditional context about the user's situation, preferences, or constraints:\n${additionalContext}`;
        }

        const result = await simplemodel.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const parsed = JSON.parse(text);
        const fallback = {
          income: currentData.income ?? 0,
          expenses: currentData.expenses || [],
          savingsGoal: currentData.savingsGoal ?? null,
          currentSavings: currentData.currentSavings ?? 0,
          plan: currentData.plan || {},
        };
        const finalized = finalizeFinancialData(parsed, fallback);

        setFinancialData(finalized);
        return finalized;
      } catch (err) {
        console.error("Error updating financial data:", err);
        setUpdateError(err.message || "Failed to update your plan");
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [finalizeFinancialData]
  );

  return {
    parseFinancialInput,
    updateFinancialData,
    clearData,
    financialData,
    setFinancialData,
    isLoading,
    error,
    isUpdating,
    updateError,
  };
}
