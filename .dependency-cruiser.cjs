/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: {
        circular: true,
      },
    },

    {
      name: "not-to-test",
      severity: "error",
      from: {
        pathNot: "^tests(?:/|$)",
      },
      to: {
        path: "^tests(?:/|$)",
      },
    },

    {
      name: "not-to-unresolvable",
      severity: "error",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },

    // -------------------------------------------------------------------------
    // Application boundaries
    // -------------------------------------------------------------------------

    {
      name: "ui-not-to-fakes",
      severity: "error",
      from: {
        path: "^src/ui(?:/|$)",
      },
      to: {
        path: "^src/fakes(?:/|$)",
      },
    },

    {
      name: "usecases-not-to-fakes",
      severity: "error",
      from: {
        path: "^src/usecases(?:/|$)",
      },
      to: {
        path: "^src/fakes(?:/|$)",
      },
    },

    {
      name: "ports-not-to-ui-app-inputs",
      severity: "error",
      from: {
        path: "^src/ports(?:/|$)",
      },
      to: {
        path: "^src/(?:ui|app|inputs)(?:/|$)",
      },
    },

    {
      name: "ports-not-to-next",
      severity: "error",
      from: {
        path: "^src/ports(?:/|$)",
      },
      to: {
        path: "node_modules/next(?:/|$)",
      },
    },

    // -------------------------------------------------------------------------
    // UI internal boundaries
    //
    // screens
    //   ↓
    // features
    //   ↓
    // components
    //
    // A screen may compose features and generic components.
    // A feature may use generic components.
    // Lower-level UI must not depend upward.
    // -------------------------------------------------------------------------

    {
      name: "ui-components-not-to-features",
      comment:
        "Generic UI components must not depend on feature-specific UI.",
      severity: "error",
      from: {
        path: "^src/ui/components(?:/|$)",
      },
      to: {
        path: "^src/ui/features(?:/|$)",
      },
    },

    {
      name: "ui-components-not-to-screens",
      comment: "Generic UI components must not depend on screens.",
      severity: "error",
      from: {
        path: "^src/ui/components(?:/|$)",
      },
      to: {
        path: "^src/ui/screens(?:/|$)",
      },
    },

    {
      name: "ui-features-not-to-screens",
      comment: "Feature UI must not depend on screen composition.",
      severity: "error",
      from: {
        path: "^src/ui/features(?:/|$)",
      },
      to: {
        path: "^src/ui/screens(?:/|$)",
      },
    },

    {
      name: "ui-features-not-to-other-features",
      comment:
        "A UI feature must not directly depend on another UI feature. Compose multiple features at screen level.",
      severity: "error",
      from: {
        path: "^src/ui/features/([^/]+)(?:/|$)",
      },
      to: {
        path: "^src/ui/features(?:/|$)",
        pathNot: "^src/ui/features/$1(?:/|$)",
      },
    },
  ],

  options: {
    doNotFollow: {
      path: ["node_modules"],
    },

    tsConfig: {
      fileName: "tsconfig.json",
    },

    tsPreCompilationDeps: true,
    skipAnalysisNotInRules: true,
  },
};