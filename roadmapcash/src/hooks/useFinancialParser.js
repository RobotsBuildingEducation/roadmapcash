import { useState, useCallback } from "react";
import { getGenerativeModel, Schema } from "@firebase/vertexai";
import { ai } from "@/database/firebaseConfig";
import { useI18n } from "@/i18n/I18nProvider";

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
          recommendation: Schema.string({
            description:
              "Specific recommendation for this expense - be opinionated about whether to cut, maintain, or optimize",
          }),
          priority: Schema.string({
            description:
              "Priority level: essential, important, or discretionary",
            enum: ["essential", "important", "discretionary"],
          }),
        },
        required: ["name", "amount", "recommendation", "priority"],
      }),
      description: "List of monthly expenses with recommendations",
    }),
    savingsGoal: Schema.number({
      description: "Total savings goal amount",
      nullable: true,
    }),
    currentSavings: Schema.number({
      description: "Current savings amount",
      nullable: true,
    }),
    plan: Schema.object({
      properties: {
        title: Schema.string({
          description:
            "A motivating title for their financial plan, personalized to their goal",
        }),
        overview: Schema.string({
          description:
            "2-3 sentence overview of their financial situation and the path forward",
        }),
        monthlyBudget: Schema.object({
          properties: {
            needs: Schema.number({
              description: "Recommended amount for needs (50% rule target)",
            }),
            wants: Schema.number({
              description: "Recommended amount for wants (30% rule target)",
            }),
            savings: Schema.number({
              description: "Recommended amount for savings (20% rule target)",
            }),
          },
          required: ["needs", "wants", "savings"],
        }),
        strategies: Schema.array({
          items: Schema.object({
            properties: {
              title: Schema.string({
                description: "Short title for the strategy",
              }),
              description: Schema.string({
                description: "Detailed explanation of the strategy",
              }),
              impact: Schema.string({
                description: "Expected monthly savings or benefit",
              }),
              difficulty: Schema.string({
                description: "How hard this is to implement",
                enum: ["easy", "medium", "hard"],
              }),
            },
            required: ["title", "description", "impact", "difficulty"],
          }),
          description:
            "3-5 specific savings strategies tailored to their situation",
        }),
        actionItems: Schema.array({
          items: Schema.object({
            properties: {
              action: Schema.string({ description: "Specific action to take" }),
              timeframe: Schema.string({
                description: "When to do this: this week, this month, ongoing",
              }),
              category: Schema.string({
                description: "Category of action",
                enum: ["cut", "optimize", "earn", "automate", "track"],
              }),
            },
            required: ["action", "timeframe", "category"],
          }),
          description: "5-8 specific action items to implement immediately",
        }),
        weeklyCheckIn: Schema.string({
          description:
            "What they should review/check each week to stay on track",
        }),
        potentialSavings: Schema.number({
          description:
            "Estimated additional monthly savings if they follow all recommendations",
        }),
        motivationalNote: Schema.string({
          description:
            "A personalized, encouraging note about their journey - be specific to their goals",
        }),
      },
      required: [
        "title",
        "overview",
        "monthlyBudget",
        "strategies",
        "actionItems",
        "weeklyCheckIn",
        "potentialSavings",
        "motivationalNote",
      ],
    }),
  },
  required: ["expenses", "plan"],
});

const financialModel = getGenerativeModel(ai, {
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: financialDataSchema,
  },
});

const fastUpdateModel = getGenerativeModel(ai, {
  model: "gemini-3-flash-preview",
  generationConfig: {
    // Firebase AI Logic doesn't support Gemini 3 thinking_level yet.
    // For now, keep using thinking budgets (0 ≈ "minimal" behavior you're after).
    thinkingConfig: { thinkingBudget: 0 },
    responseMimeType: "application/json",
    responseSchema: financialDataSchema,
  },
});

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
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const finalizeFinancialData = useCallback((parsed, fallback) => {
    const reviewFallback = t("ai.reviewExpenseFallback");
    const result = { ...parsed };

    if (!result.expenses) {
      result.expenses = fallback.expenses || [];
    }

    if (result.expenses.length === 0 && fallback.expenses?.length > 0) {
      result.expenses = fallback.expenses.map((expense) => ({
        ...expense,
        recommendation: expense.recommendation || reviewFallback,
        priority: expense.priority || "important",
      }));
    }

    result.expenses = result.expenses
      .filter(
        (expense) =>
          expense &&
          expense.name &&
          typeof expense.amount === "number" &&
          expense.amount > 0,
      )
      .map((expense) => ({
        ...expense,
        recommendation: expense.recommendation || reviewFallback,
        priority: expense.priority || "important",
      }));

    if (
      result.income === null ||
      result.income === undefined ||
      result.income === 0
    ) {
      result.income = fallback.income ?? 0;
    }

    if (result.currentSavings === null || result.currentSavings === undefined) {
      result.currentSavings = fallback.currentSavings ?? 0;
    }

    if (result.savingsGoal === null || result.savingsGoal === undefined) {
      result.savingsGoal = fallback.savingsGoal ?? null;
    }

    const totalExpenses = result.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const monthlySavings = (result.income || 0) - totalExpenses;
    const basePlan = fallback.plan || {};
    const plan = result.plan || {};

    const monthlyBudget = plan.monthlyBudget ||
      basePlan.monthlyBudget || {
        needs: Math.round((result.income || 0) * 0.5),
        wants: Math.round((result.income || 0) * 0.3),
        savings: Math.round((result.income || 0) * 0.2),
      };

    result.plan = {
      title:
        plan.title || basePlan.title || t("ai.planTitleFallback"),
      overview:
        plan.overview ||
        basePlan.overview ||
        t("ai.overviewFallback"),
      monthlyBudget,
      strategies: plan.strategies || basePlan.strategies || [],
      actionItems: plan.actionItems || basePlan.actionItems || [],
      weeklyCheckIn:
        plan.weeklyCheckIn ||
        basePlan.weeklyCheckIn ||
        t("ai.weeklyCheckInFallback"),
      potentialSavings:
        plan.potentialSavings ||
        basePlan.potentialSavings ||
        Math.max(0, monthlySavings),
      motivationalNote:
        plan.motivationalNote ||
        basePlan.motivationalNote ||
        t("ai.motivationalNoteFallback"),
    };

    return result;
  }, [t]);

  const parseFinancialInput = useCallback(
    async (userInput, additionalContext = "") => {
      setIsLoading(true);
      setError(null);

      try {
        let prompt = `${t("ai.systemPrompt")}\n\n${t("ai.userInfoLabel")}\n${userInput}`;

        if (additionalContext.trim()) {
          prompt += `\n\n${t("ai.additionalContextLabel")}\n${additionalContext}`;
        }

        const result = await financialModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const parsed = JSON.parse(text);
        const fallback = extractLooseData(userInput);
        const finalized = finalizeFinancialData(parsed, fallback);

        setFinancialData(finalized);
        return finalized;
      } catch (err) {
        console.error("Error parsing financial data:", err);
        setError(err.message || t("ai.analyzeError"));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [finalizeFinancialData, t],
  );

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
        let prompt = `${t("ai.systemPrompt")}

${t("ai.updateIntro")}

${t("ai.currentDataLabel")}
${JSON.stringify(currentData, null, 2)}

${t("ai.requestedUpdatesLabel")}
${updateRequest}`;

        if (additionalContext.trim()) {
          prompt += `\n\n${t("ai.additionalContextLabel")}\n${additionalContext}`;
        }

        const result = await financialModel.generateContent(prompt);
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
        setUpdateError(err.message || t("ai.updateError"));
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [finalizeFinancialData, t],
  );

  const updateFinancialItem = useCallback(
    async (currentData, updateRequest, additionalContext = "") => {
      if (!currentData || !updateRequest?.trim()) return null;

      setIsUpdating(true);
      setUpdateError(null);

      try {
        let prompt = `${t("ai.systemPrompt")}

${t("ai.updateIntro")}

${t("ai.currentDataLabel")}
${JSON.stringify(currentData, null, 2)}

${t("ai.requestedUpdatesLabel")}
${updateRequest}`;

        if (additionalContext.trim()) {
          prompt += `\n\n${t("ai.additionalContextLabel")}\n${additionalContext}`;
        }

        const result = await fastUpdateModel.generateContent(prompt);
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
        setUpdateError(err.message || t("ai.updateError"));
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [finalizeFinancialData, t],
  );

  return {
    parseFinancialInput,
    updateFinancialData,
    updateFinancialItem,
    clearData,
    financialData,
    setFinancialData,
    isLoading,
    error,
    isUpdating,
    updateError,
  };
}
