export const translations = {
  en: {
    app: {
      initializingIdentity: "Initializing identity...",
      errorPrefix: "Error: {error}",
      buildingPlan: "Building your financial plan...",
      loaderMessages: [
        "Reviewing income, expenses, and savings details.",
        "Estimating savings goals and current progress.",
        "Calculating a sustainable monthly budget split.",
        "Drafting savings strategies tailored to your situation.",
        "Listing near-term action items to move faster.",
        "Writing your weekly check-in and motivation note.",
        "Projecting potential savings if you follow the plan.",
      ],
    },
    header: {
      languageSwitchLabel: "Language",
    },
    accountMenu: {
      menuLabel: "Menu",
      accountTitle: "Account",
      close: "Close",
      loading: "Loading...",
      noIdentity: "No identity loaded",
      copyUserId: "Copy User ID",
      copySecretKey: "Copy Secret Key",
      switchAccount: "Switch Account",
      installApp: "Install App",
      themeLabel: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      themeToggleLabel: "Toggle theme",
      logout: "Logout",
      switchModalTitle: "Switch Account",
      switchDescription:
        "Paste your nsec (secret key) to switch to a different account. If the account doesn't exist, it will be created.",
      nsecPlaceholder: "nsec1...",
      cancel: "Cancel",
      switchAction: "Switch",
      installTitle: "Install App",
      installSteps: [
        "Open the browser menu.",
        "Choose 'Share' or 'Install'.",
        "Add to Home Screen.",
        "Launch from your Home Screen.",
      ],
      installSecretTitle: "Copy your secret key to sign into your account",
      installSecretBody:
        "This key is the only way to access your accounts on Robots Building Education apps. Store it in a password manager or a safe place. We cannot recover it for you.",
      copySecretKeyAction: "Copy Secret Key",
      toasts: {
        nothingToCopy: "Nothing to copy",
        secretKeyCopied: "Secret key copied",
        userIdCopied: "User ID copied",
      },
      errors: {
        enterNsec: "Please enter an nsec",
        invalidNsec: "Invalid nsec format. Must start with 'nsec'",
        failedSwitch: "Failed to switch account",
      },
    },
    financialInput: {
      title: "Financial Planner",
      description:
        "Describe your expenses, income, and savings goals. Our AI will analyze your finances and create a personalized, opinionated plan with specific recommendations to help you reach your targets.",
      placeholder: "Enter your expenses and financial goals.",
      creatingPlan: "Creating Your Plan...",
      updatePlan: "Update My Plan",
      generatePlan: "Generate My Plan",
    },
    financialChart: {
      planFallbackTitle: "Your Financial Plan",
      potentialSuffix: "+{amount}/mo potential",
      needsLabel: "NEEDS (50%)",
      wantsLabel: "WANTS (30%)",
      savingsLabel: "SAVINGS (20%)",
      perMonthSuffix: "{amount}/mo",
      expenseAnalysisTitle: "Expense Analysis & Recommendations",
      itemsCount: "{count} items - {amount}/mo",
      savingsStrategiesTitle: "Your Savings Strategies",
      difficulty: {
        easy: "Easy win",
        medium: "Some effort",
        hard: "Challenging",
      },
      impactLabel: "Impact: {impact}",
      actionItemsTitle: "Action Items - Start This Week",
      category: {
        cut: "Cut",
        optimize: "Optimize",
        earn: "Earn More",
        automate: "Automate",
        track: "Track",
      },
      weeklyCheckInLabel: "WEEKLY CHECK-IN",
      coachSays: "Your Coach Says...",
      incomeAllocation: "Income Allocation",
      savedLabel: "saved",
      moreSegments: "+{count} more",
      expenseBreakdown: "Expense Breakdown",
      priorityLabels: {
        essential: "Essential",
        important: "Important",
        discretionary: "Discretionary",
      },
      savingsLabelShort: "Savings",
      totalExpenses: "Total Expenses",
      percentOfIncome: "% of Income",
      growthProjection: "Growth Projection",
      goalLabel: "GOAL",
      currentPath: "Current path",
      withPlan: "With plan",
      yearsLabel: "{amount} in 2Y",
      timeline: {
        now: "Now",
        yearOne: "1Y",
        yearTwo: "2Y",
      },
      roadmapTitle: "Your Roadmap",
      monthsToGo: "{count} months to go",
      yearsToGo: "{count} years to go",
      currentProgress: "Current Progress",
      doneLabel: "Done",
      monthsShort: "{count} mo",
      noGoalMessage: "Set a savings goal to see your roadmap",
      increaseSavingsMessage:
        "Increase your savings rate to start building your roadmap",
      milestone: {
        emergencyFund: "Emergency Fund",
        emergencyFundSub: "3 months expenses",
        progress25: "25% Progress",
        halfway: "Halfway",
        goalReached: "Goal Reached",
      },
      metrics: {
        monthlyIncome: "Monthly Income",
        expenses: "Expenses",
        youSave: "You Save",
        rateLabel: "{rate}% rate",
        goalProgress: "Goal Progress",
        ofGoal: "of {amount}",
      },
      updateSection: {
        title: "Update Your Data",
        subtitle: "Adjust numbers directly and let AI refresh your plan.",
        statusLabel: "Update status",
        statusApplying: "Applying updates to your plan...",
        statusEmpty: "Make a change below to enable updates.",
        statusReady: "Ready to refresh your plan.",
        applyUpdates: "Apply updates",
        monthlyIncome: "Monthly income",
        currentSavings: "Current savings",
        savingsGoal: "Savings goal",
        expenses: "Expenses",
        addExpense: "Add expense",
        expenseName: "Expense name",
        amount: "Amount",
        remove: "Remove",
        notesLabel: "Notes for AI (optional)",
        notesPlaceholder: "Add context: new job, moving, debt payoff, etc.",
      },
      tabs: {
        overview: "Overview",
        plan: "Your Plan",
        portfolio: "Investments",
        expenses: "Expenses",
      },
      portfolio: {
        title: "Investments",
        subtitle:
          "Start with this standardized allocation and adjust it over time.",
        allocationChart: "Allocation chart",
        breakdownTitle: "Target allocation",
        totalLabel: "Target mix",
        note: "This is a starting point designed for diversification and flexibility.",
        customizeButton: "Customize allocation",
        qualityButton: "Check portfolio quality",
        qualityTitle: "Portfolio quality summary",
        qualityLoading: "Generating a quality check summary...",
        modalTitle: "Customize allocation",
        modalSubtitle: "Update each percentage to fit your preferences.",
        closeModal: "Close",
        cancelModal: "Cancel",
        saveModal: "Save allocation",
        assetPlaceholder: "Asset name",
      },
      interaction: {
        expenseQuest: "Expense Quest",
        weeklyCheckIn: "Weekly Check-in",
        planQuest: "Plan Quest",
        close: "Close",
        challenge: "Challenge",
        nextSteps: "Next steps",
        nextStepsDetail: "We'll ask AI to generate a fresh item for you.",
        generateDifferent: "Generate different content",
        completeExercise: "Complete exercise",
        generating: "Generating...",
        completing: "Completing...",
      },
      prompts: {
        updateIncome: "Update monthly income to ${amount}.",
        removeSavingsGoal: "Remove the savings goal for now.",
        updateSavingsGoal: "Update savings goal to ${amount}.",
        updateCurrentSavings: "Update current savings to ${amount}.",
        replaceExpensesList: "Replace my expense list with:",
        clearExpensesList: "Clear my expense list for now.",
        expenseLine: "- {name}: ${amount} ({priority})",
        notesPrefix: "Notes: {notes}",
        updateSuffix:
          "Recalculate recommendations, monthly budget, potential savings, and update the plan accordingly.",
        strategyRemix:
          "Replace the savings strategy titled \"{title}\" with a brand new, different strategy. Keep the plan.strategies format with title, description, impact, and difficulty.",
        strategyComplete:
          "Add a new savings strategy that builds on completing \"{title}\". Keep the plan.strategies format with title, description, impact, and difficulty.",
        actionRemix:
          "Replace the action item \"{action}\" with a new, different action item. Keep the plan.actionItems format with action, timeframe, and category.",
        actionComplete:
          "Add a new action item that follows from completing \"{action}\". Keep the plan.actionItems format with action, timeframe, and category.",
        weeklyRemix:
          "Replace the weekly check-in with a new prompt that encourages reflection and progress. Keep the plan.weeklyCheckIn as a single sentence.",
        weeklyComplete:
          "Add a new weekly check-in prompt that builds on completing \"{text}\". Keep the plan.weeklyCheckIn as a single sentence.",
        expenseRemix:
          "Generate a new recommendation for the expense \"{name}\" that is different from the current one. Keep the expense list the same, but update the recommendation field for \"{name}\".",
        expenseComplete:
          "Add a new, distinct optimization recommendation for the expense \"{name}\". Keep the expense list the same, but update the recommendation field for \"{name}\".",
        portfolioUpdate:
          "Update plan.portfolio.allocations to:\n{allocations}\nKeep everything else the same.",
        portfolioQuality:
          "Review the investment allocation below and update plan.portfolio.qualitySummary with a concise summary (2-3 sentences) highlighting strengths, risks, and one improvement.\n{allocations}",
      },
    },
    ai: {
      systemPrompt: `You are an opinionated financial coach who creates personalized, actionable financial plans. You're direct, specific, and encouraging.

CRITICAL RULE - NO ASSUMPTIONS:
- ONLY use data explicitly provided by the user
- DO NOT invent, assume, or add expense categories that were not mentioned
- DO NOT make up amounts or estimate expenses
- If the user only provides income and total expenses, work with just those numbers
- If specific expense categories are not listed, do NOT create them
- Only include expenses that the user explicitly states with specific amounts
- If information is missing, work with what you have - do NOT fill in gaps with assumptions

Guidelines for parsing:
- Extract monthly income ONLY if explicitly mentioned
- Include ONLY expense categories and amounts that the user explicitly provides
- Look for savings goals ONLY if explicitly mentioned
- If current savings are mentioned, include them; otherwise use 0
- If amounts are given weekly, multiply by 4.33 for monthly
- If amounts are given yearly, divide by 12 for monthly
- Round all amounts to whole numbers

Guidelines for recommendations (BE OPINIONATED but ONLY about provided data):
- For each expense THE USER PROVIDED, give a SPECIFIC recommendation
- Classify provided expenses as essential, important, or discretionary
- If a provided expense seems high for its category, say so and suggest a specific target
- If they're overspending on discretionary items they listed, be direct about cutting back
- Suggest specific alternatives for expenses they actually mentioned

For the plan:
- Create a motivating, personalized title based on their stated goal
- Use the 50/30/20 rule as a baseline but adjust based on their situation
- Strategies should be SPECIFIC to the expenses they provided, not generic advice
- Action items should be things they can do THIS WEEK based on their actual data
- Be encouraging but realistic about the timeline
- Calculate potential savings ONLY by looking at expenses the user actually provided
- If they didn't provide detailed expenses, focus strategies on tracking and understanding their spending

Additional context about the user (if provided) should heavily influence your recommendations.

Respond in English.`,
      userInfoLabel: "User's financial information:",
      additionalContextLabel:
        "Additional context about the user's situation, preferences, or constraints:",
      updateIntro:
        "You are updating an existing financial plan. Keep anything not mentioned the same.",
      currentDataLabel: "Current financial data (JSON):",
      requestedUpdatesLabel: "Requested updates:",
      analyzeError: "Failed to analyze financial data",
      updateError: "Failed to update your plan",
      reviewExpenseFallback: "Review this expense",
      planTitleFallback: "Your Financial Roadmap",
      overviewFallback:
        "Let's analyze your finances and create a plan to reach your goals.",
      weeklyCheckInFallback:
        "Review your spending and track progress toward your goal.",
      motivationalNoteFallback:
        "You've taken the first step by creating a plan. Stay consistent!",
    },
    identity: {
      errors: {
        invalidNsecPrefix: "Invalid nsec prefix",
        invalidNsecFormat: "Invalid nsec format",
        invalidNpubPrefix: "Invalid npub prefix",
        invalidNpubFormat: "Invalid npub format",
      },
    },
  },
  es: {
    app: {
      initializingIdentity: "Inicializando identidad...",
      errorPrefix: "Error: {error}",
      buildingPlan: "Creando tu plan financiero...",
      loaderMessages: [
        "Revisando ingresos, gastos y detalles de ahorro.",
        "Estimando metas de ahorro y progreso actual.",
        "Calculando un reparto mensual sostenible del presupuesto.",
        "Redactando estrategias de ahorro adaptadas a tu situación.",
        "Listando acciones cercanas para avanzar más rápido.",
        "Escribiendo tu check-in semanal y nota de motivación.",
        "Proyectando el ahorro potencial si sigues el plan.",
      ],
    },
    header: {
      languageSwitchLabel: "Idioma",
    },
    accountMenu: {
      menuLabel: "Menú",
      accountTitle: "Cuenta",
      close: "Cerrar",
      loading: "Cargando...",
      noIdentity: "No hay identidad cargada",
      copyUserId: "Copiar ID de usuario",
      copySecretKey: "Copiar clave secreta",
      switchAccount: "Cambiar cuenta",
      installApp: "Instalar app",
      themeLabel: "Tema",
      themeLight: "Claro",
      themeDark: "Oscuro",
      themeToggleLabel: "Cambiar tema",
      logout: "Cerrar sesión",
      switchModalTitle: "Cambiar cuenta",
      switchDescription:
        "Pega tu nsec (clave secreta) para cambiar a una cuenta distinta. Si la cuenta no existe, se creará.",
      nsecPlaceholder: "nsec1...",
      cancel: "Cancelar",
      switchAction: "Cambiar",
      installTitle: "Instalar app",
      installSteps: [
        "Abre el menú del navegador.",
        "Elige 'Compartir' o 'Instalar'.",
        "Agregar a la pantalla de inicio.",
        "Abrir desde la pantalla de inicio.",
      ],
      installSecretTitle: "Copia tu clave secreta para iniciar sesión",
      installSecretBody:
        "Esta clave es la única forma de acceder a tus cuentas en las apps de Robots Building Education. Guárdala en un gestor de contraseñas o en un lugar seguro. No podemos recuperarla por ti.",
      copySecretKeyAction: "Copiar clave secreta",
      toasts: {
        nothingToCopy: "Nada para copiar",
        secretKeyCopied: "Clave secreta copiada",
        userIdCopied: "ID de usuario copiado",
      },
      errors: {
        enterNsec: "Ingresa un nsec",
        invalidNsec: "Formato de nsec inválido. Debe empezar con 'nsec'",
        failedSwitch: "No se pudo cambiar de cuenta",
      },
    },
    financialInput: {
      title: "Planificador financiero",
      description:
        "Describe tus gastos, ingresos y metas de ahorro. Nuestra IA analizará tus finanzas y creará un plan personalizado y directo con recomendaciones específicas para ayudarte a alcanzar tus objetivos.",
      placeholder: "Ingresa tus gastos y metas financieras.",
      creatingPlan: "Creando tu plan...",
      updatePlan: "Actualizar mi plan",
      generatePlan: "Generar mi plan",
    },
    financialChart: {
      planFallbackTitle: "Tu plan financiero",
      potentialSuffix: "+{amount}/mes potencial",
      needsLabel: "NECESIDADES (50%)",
      wantsLabel: "DESEOS (30%)",
      savingsLabel: "AHORRO (20%)",
      perMonthSuffix: "{amount}/mes",
      expenseAnalysisTitle: "Análisis de gastos y recomendaciones",
      itemsCount: "{count} ítems - {amount}/mes",
      savingsStrategiesTitle: "Tus estrategias de ahorro",
      difficulty: {
        easy: "Fácil",
        medium: "Esfuerzo medio",
        hard: "Desafiante",
      },
      impactLabel: "Impacto: {impact}",
      actionItemsTitle: "Acciones: empieza esta semana",
      category: {
        cut: "Recortar",
        optimize: "Optimizar",
        earn: "Ganar más",
        automate: "Automatizar",
        track: "Seguimiento",
      },
      weeklyCheckInLabel: "CHECK-IN SEMANAL",
      coachSays: "Tu coach dice...",
      incomeAllocation: "Distribución de ingresos",
      savedLabel: "ahorrado",
      moreSegments: "+{count} más",
      expenseBreakdown: "Desglose de gastos",
      priorityLabels: {
        essential: "Esencial",
        important: "Importante",
        discretionary: "Discrecional",
      },
      savingsLabelShort: "Ahorro",
      totalExpenses: "Gastos totales",
      percentOfIncome: "% de ingresos",
      growthProjection: "Proyección de crecimiento",
      goalLabel: "META",
      currentPath: "Ruta actual",
      withPlan: "Con el plan",
      yearsLabel: "{amount} en 2 años",
      timeline: {
        now: "Ahora",
        yearOne: "1A",
        yearTwo: "2A",
      },
      roadmapTitle: "Tu hoja de ruta",
      monthsToGo: "{count} meses restantes",
      yearsToGo: "{count} años restantes",
      currentProgress: "Progreso actual",
      doneLabel: "Listo",
      monthsShort: "{count} mes",
      noGoalMessage: "Define una meta de ahorro para ver tu hoja de ruta",
      increaseSavingsMessage:
        "Aumenta tu tasa de ahorro para empezar a construir tu hoja de ruta",
      milestone: {
        emergencyFund: "Fondo de emergencia",
        emergencyFundSub: "3 meses de gastos",
        progress25: "25% de progreso",
        halfway: "Mitad del camino",
        goalReached: "Meta alcanzada",
      },
      metrics: {
        monthlyIncome: "Ingreso mensual",
        expenses: "Gastos",
        youSave: "Ahorras",
        rateLabel: "{rate}% de tasa",
        goalProgress: "Progreso de meta",
        ofGoal: "de {amount}",
      },
      updateSection: {
        title: "Actualiza tus datos",
        subtitle: "Ajusta los números y deja que la IA refresque tu plan.",
        statusLabel: "Estado de actualización",
        statusApplying: "Aplicando actualizaciones a tu plan...",
        statusEmpty: "Haz un cambio abajo para habilitar actualizaciones.",
        statusReady: "Listo para refrescar tu plan.",
        applyUpdates: "Aplicar actualizaciones",
        monthlyIncome: "Ingreso mensual",
        currentSavings: "Ahorros actuales",
        savingsGoal: "Meta de ahorro",
        expenses: "Gastos",
        addExpense: "Agregar gasto",
        expenseName: "Nombre del gasto",
        amount: "Monto",
        remove: "Quitar",
        notesLabel: "Notas para IA (opcional)",
        notesPlaceholder:
          "Agrega contexto: nuevo trabajo, mudanza, pago de deudas, etc.",
      },
      tabs: {
        overview: "Resumen",
        plan: "Tu plan",
        portfolio: "Inversiones",
        expenses: "Gastos",
      },
      portfolio: {
        title: "Inversiones",
        subtitle:
          "Comienza con esta asignación estándar y ajústala con el tiempo.",
        allocationChart: "Gráfico de asignación",
        breakdownTitle: "Asignación objetivo",
        totalLabel: "Mezcla objetivo",
        note:
          "Este es un punto de partida pensado para diversificación y flexibilidad.",
        customizeButton: "Personalizar asignación",
        qualityButton: "Evaluar calidad del portafolio",
        qualityTitle: "Resumen de calidad del portafolio",
        qualityLoading: "Generando el resumen de calidad...",
        modalTitle: "Personalizar asignación",
        modalSubtitle: "Actualiza cada porcentaje según tus preferencias.",
        closeModal: "Cerrar",
        cancelModal: "Cancelar",
        saveModal: "Guardar asignación",
        assetPlaceholder: "Nombre del activo",
      },
      interaction: {
        expenseQuest: "Misión de gastos",
        weeklyCheckIn: "Check-in semanal",
        planQuest: "Misión del plan",
        close: "Cerrar",
        challenge: "Desafío",
        nextSteps: "Próximos pasos",
        nextStepsDetail: "Pediremos a la IA un nuevo elemento para ti.",
        generateDifferent: "Generar contenido diferente",
        completeExercise: "Completar ejercicio",
        generating: "Generando...",
        completing: "Completando...",
      },
      prompts: {
        updateIncome: "Actualizar ingreso mensual a ${amount}.",
        removeSavingsGoal: "Quitar la meta de ahorro por ahora.",
        updateSavingsGoal: "Actualizar la meta de ahorro a ${amount}.",
        updateCurrentSavings: "Actualizar ahorros actuales a ${amount}.",
        replaceExpensesList: "Reemplazar mi lista de gastos con:",
        clearExpensesList: "Borrar mi lista de gastos por ahora.",
        expenseLine: "- {name}: ${amount} ({priority})",
        notesPrefix: "Notas: {notes}",
        updateSuffix:
          "Recalcula recomendaciones, presupuesto mensual, ahorro potencial y actualiza el plan en consecuencia.",
        strategyRemix:
          "Reemplaza la estrategia de ahorro titulada \"{title}\" con una estrategia nueva y diferente. Mantén el formato de plan.strategies con título, descripción, impacto y dificultad.",
        strategyComplete:
          "Agrega una nueva estrategia de ahorro que continúe al completar \"{title}\". Mantén el formato de plan.strategies con título, descripción, impacto y dificultad.",
        actionRemix:
          "Reemplaza la acción \"{action}\" con una acción nueva y diferente. Mantén el formato de plan.actionItems con acción, plazo y categoría.",
        actionComplete:
          "Agrega una nueva acción que siga a completar \"{action}\". Mantén el formato de plan.actionItems con acción, plazo y categoría.",
        weeklyRemix:
          "Reemplaza el check-in semanal con un nuevo mensaje que fomente reflexión y progreso. Mantén plan.weeklyCheckIn como una sola oración.",
        weeklyComplete:
          "Agrega un nuevo check-in semanal que se base en completar \"{text}\". Mantén plan.weeklyCheckIn como una sola oración.",
        expenseRemix:
          "Genera una nueva recomendación para el gasto \"{name}\" que sea distinta de la actual. Mantén la lista de gastos igual, pero actualiza el campo recommendation para \"{name}\".",
        expenseComplete:
          "Agrega una nueva recomendación de optimización para el gasto \"{name}\". Mantén la lista de gastos igual, pero actualiza el campo recommendation para \"{name}\".",
        portfolioUpdate:
          "Actualiza plan.portfolio.allocations a:\n{allocations}\nMantén todo lo demás igual.",
        portfolioQuality:
          "Revisa la asignación de inversión a continuación y actualiza plan.portfolio.qualitySummary con un resumen conciso (2-3 oraciones) que destaque fortalezas, riesgos y una mejora.\n{allocations}",
      },
    },
    ai: {
      systemPrompt: `Eres un coach financiero directo que crea planes financieros personalizados y accionables. Eres claro, específico y motivador.

REGLA CRÍTICA - SIN SUPOSICIONES:
- Usa SOLO los datos que el usuario proporcionó explícitamente
- NO inventes ni agregues categorías de gasto que no se mencionaron
- NO inventes montos ni estimes gastos
- Si el usuario solo proporciona ingresos y gastos totales, trabaja solo con esos números
- Si no se listan categorías específicas, NO las crees
- Solo incluye gastos que el usuario indique explícitamente con montos específicos
- Si falta información, trabaja con lo que hay - NO rellenes con suposiciones

Guías de análisis:
- Extrae el ingreso mensual SOLO si se menciona explícitamente
- Incluye SOLO las categorías de gasto y montos que el usuario da explícitamente
- Busca metas de ahorro SOLO si se mencionan explícitamente
- Si se mencionan ahorros actuales, inclúyelos; de lo contrario usa 0
- Si los montos son semanales, multiplícalos por 4.33 para el mes
- Si los montos son anuales, divide entre 12 para el mes
- Redondea todos los montos a enteros

Guías para recomendaciones (SE OPINIONADO pero SOLO con los datos proporcionados):
- Para cada gasto que el usuario proporcionó, da una recomendación ESPECÍFICA
- Clasifica los gastos como essential, important o discretionary
- Si un gasto parece alto para su categoría, dilo y sugiere un objetivo específico
- Si están gastando de más en elementos discrecionales, sé directo sobre recortar
- Sugiere alternativas específicas para gastos que realmente mencionaron

Para el plan:
- Crea un título motivador y personalizado basado en su meta declarada
- Usa la regla 50/30/20 como base, pero ajusta según su situación
- Las estrategias deben ser ESPECÍFICAS a los gastos proporcionados, no genéricas
- Los ítems de acción deben ser cosas que puedan hacer ESTA SEMANA según sus datos
- Sé motivador pero realista sobre el plazo
- Calcula el ahorro potencial SOLO usando los gastos que el usuario realmente proporcionó
- Si no dieron gastos detallados, enfócate en estrategias de seguimiento y entendimiento de su gasto

El contexto adicional del usuario (si se proporciona) debe influir fuertemente tus recomendaciones.

Responde en español.`,
      userInfoLabel: "Información financiera del usuario:",
      additionalContextLabel:
        "Contexto adicional sobre la situación, preferencias o restricciones del usuario:",
      updateIntro:
        "Estás actualizando un plan financiero existente. Mantén igual todo lo que no se mencione.",
      currentDataLabel: "Datos financieros actuales (JSON):",
      requestedUpdatesLabel: "Actualizaciones solicitadas:",
      analyzeError: "No se pudo analizar la información financiera",
      updateError: "No se pudo actualizar tu plan",
      reviewExpenseFallback: "Revisa este gasto",
      planTitleFallback: "Tu hoja de ruta financiera",
      overviewFallback:
        "Analicemos tus finanzas y creemos un plan para alcanzar tus metas.",
      weeklyCheckInFallback:
        "Revisa tus gastos y el progreso hacia tu meta.",
      motivationalNoteFallback:
        "Has dado el primer paso creando un plan. ¡Sé constante!",
    },
    identity: {
      errors: {
        invalidNsecPrefix: "Prefijo nsec inválido",
        invalidNsecFormat: "Formato de nsec inválido",
        invalidNpubPrefix: "Prefijo npub inválido",
        invalidNpubFormat: "Formato de npub inválido",
      },
    },
  },
};
