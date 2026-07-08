# Graph Report - messageDe  (2026-07-08)

## Corpus Check
- 65 files · ~281,190 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 350 nodes · 541 edges · 22 communities (20 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4112648`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_message.controller.ts|message.controller.ts]]
- [[_COMMUNITY_WallpaperPicker.tsx|WallpaperPicker.tsx]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_ConversationRow.tsx|ConversationRow.tsx]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_App.tsx|App.tsx]]
- [[_COMMUNITY_tsconfig.json|tsconfig.json]]
- [[_COMMUNITY_AuthPage.tsx|AuthPage.tsx]]
- [[_COMMUNITY_React + TypeScript + Vite|React + TypeScript + Vite]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]
- [[_COMMUNITY_ThemeContext.tsx|ThemeContext.tsx]]
- [[_COMMUNITY_useChatStore.ts|useChatStore.ts]]
- [[_COMMUNITY_useScrollToBottom.ts|useScrollToBottom.ts]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `useSelectedConversation()` - 15 edges
3. `compilerOptions` - 15 edges
4. `compilerOptions` - 13 edges
5. `useChatStore` - 11 edges
6. `User` - 9 edges
7. `ThemeProvider()` - 8 edges
8. `useAuthStore` - 8 edges
9. `Components` - 8 edges
10. `sendMessage()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `seedDatabase()` --references--> `User`  [EXTRACTED]
  backend/src/seeds/user.seed.ts → frontend/src/store/useAuthStore.ts
- `getUsersForSidebar()` --references--> `User`  [EXTRACTED]
  backend/src/controllers/message.controller.ts → frontend/src/store/useAuthStore.ts
- `getConversationsForSidebar()` --references--> `Message`  [EXTRACTED]
  backend/src/controllers/message.controller.ts → frontend/src/store/useChatStore.ts
- `getMessages()` --references--> `Message`  [EXTRACTED]
  backend/src/controllers/message.controller.ts → frontend/src/store/useChatStore.ts
- `sendMessage()` --references--> `User`  [EXTRACTED]
  backend/src/controllers/message.controller.ts → frontend/src/store/useAuthStore.ts

## Import Cycles
- None detected.

## Communities (22 total, 2 thin omitted)

### Community 0 - "index.ts"
Cohesion: 0.12
Nodes (19): cron, checkAuth(), publicDir, startServer(), Auth, job, client, connectDB() (+11 more)

### Community 1 - "message.controller.ts"
Cohesion: 0.12
Nodes (20): getConversationsForSidebar(), getMessages(), getUsersForSidebar(), sendMessage(), createFileName(), hasImageKitConfig(), imagekit, uploadChatMedia() (+12 more)

### Community 2 - "WallpaperPicker.tsx"
Cohesion: 0.20
Nodes (14): WallpaperPicker(), WallpaperThumbProps, useWallpaper(), WallpaperContext, WallpaperContextType, readStoredWallpaperId(), WallpaperProvider(), WallpaperProviderProps (+6 more)

### Community 3 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, better-auth, @better-auth/mongo-adapter, cors, dotenv, express, @imagekit/nodejs, mongodb (+7 more)

### Community 4 - "dependencies"
Cohesion: 0.08
Nodes (23): dependencies, better-auth, @heroui/react, @heroui/styles, install, lucide-react, react, react-dom (+15 more)

### Community 5 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 6 - "package.json"
Cohesion: 0.11
Nodes (18): author, description, devDependencies, tsx, @types/cors, @types/multer, typescript, keywords (+10 more)

### Community 7 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @babel/core, babel-plugin-react-compiler, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+9 more)

### Community 8 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 9 - "ConversationRow.tsx"
Cohesion: 0.33
Nodes (5): AvatarWithOnlineIndicator(), AvatarWithOnlineIndicatorProps, ConversationRow(), ConversationRowProps, ConversationUser

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowImportingTsExtensions, allowJs, checkJs, esModuleInterop, module, moduleResolution, outDir (+6 more)

### Community 11 - "App.tsx"
Cohesion: 0.20
Nodes (9): App(), LoginForm(), RegisterForm(), AuthRoute(), AuthRouteProps, ProtectedRoute(), ProtectedRouteProps, authClient (+1 more)

### Community 15 - "AuthPage.tsx"
Cohesion: 0.05
Nodes (38): Border Radius Scale, Brand & Accent, Breakpoints, Buttons, Cards & Containers, Collapsing Strategy, Colors, Components (+30 more)

### Community 16 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 19 - "ThemeContext.tsx"
Cohesion: 0.20
Nodes (16): AppLogo(), ThemePresetPicker(), ThemeToggle(), applyThemePresetToDocument(), isValidThemePreset(), PRESET_IDS, ThemeContext, ThemeContextType (+8 more)

### Community 20 - "useChatStore.ts"
Cohesion: 0.10
Nodes (26): axios, ChatComposer(), ChatHeader(), ChatSidebar(), MappedUser, mapUserForList(), MessageList(), NoConversationPlaceholder() (+18 more)

### Community 21 - "useScrollToBottom.ts"
Cohesion: 0.38
Nodes (8): MappedMessage, MessageBubble(), MessageBubbleProps, buildPosterUrl(), MessageVideo(), MessageVideoProps, isImageKitUrl(), withTransform()

## Knowledge Gaps
- **178 isolated node(s):** `name`, `version`, `description`, `main`, `dev` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `message.controller.ts` to `index.ts`, `useChatStore.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `useChatStore.ts`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `axios` connect `useChatStore.ts` to `dependencies`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `message.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12307692307692308 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._