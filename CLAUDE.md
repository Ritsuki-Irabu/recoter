# プロジェクト概要

- **プロジェクト名**: Recpter（リセプター）— 思考アジリティ可視化アプリ
- **目的**: ユーザーの思考ログをAIが分析し、思考の偏りを構造的に可視化することで、客観的な自己理解と柔軟な思考を育てる支援を行うMVPの開発。
- **技術スタック**:
  - フレームワーク: Next.js (App Router), TypeScript
  - UI: Framer Motion, @use-gesture/react, カスタムSVG（インラインスタイル）
  - バックエンド/DB: API Routes, Auth.js (v5), Prisma, PostgreSQL (Neon)
  - AI: Google AI SDK (@google/generative-ai), Gemini 1.5 Flash
  - デプロイ: Vercel + Neon（Vercel公式連携）

---

# ペアプロ・開発ルール（最重要）

私はテックリードとして全体の仕組み設計やアーキテクチャの意思決定を行います。以下のルールを厳守してください。

- **主導権の明示**: 実装の意思決定は私が持ちます。コードを生成する前に、必ず「実装方針の提案」を箇条書きで提示し、私の承認を得てから実装に進むこと。
- **効率化と最短距離**: 無駄な機能追加や過剰なエンジニアリングは避け、MVP達成のための最短距離を提示すること。APIのコール回数やコスト削減（AI再計算の回避など）を常に意識すること。
- **解説と提案の徹底**: 新しい関数やライブラリを導入する際、または複雑なロジック（思考アジリティの算出など）を構築する際は、その「選定理由」と「仕組み」を簡潔に解説すること。
- **部分的なコード提示**: 既存コードを丸ごと書き換えるのではなく、修正が必要な箇所や差分を明確にして提示すること。
- **自走と改善**: 設計書やスキーマの意図を汲み取り、単調な作業は素早く片付けつつ、より良いNext.jsのベストプラクティスがあれば積極的に提案すること。

---

# コーディング規約

- **命名規則**: 変数・関数は `camelCase`、Reactコンポーネントは `PascalCase` を厳守。
- **アーキテクチャ**:
  - AI連携ロジック（Logic A）とスコア算出ロジック（Logic B）は `app/lib/` 配下に分離し、API Routeから呼び出す構成とする。
  - UIコンポーネントは `app/components/` 配下に機能ごとに整理する。
- **スタイル**:
  - 関数コンポーネントはArrow Functionを使用。
  - スタイリングはインラインスタイルで統一。外部CSSフレームワーク（Tailwind・Shadcn）は不使用。
- **型安全性**: `any`の使用は避け、APIレスポンスやDBモデルの型を厳格に定義・適用すること。

---

# 現在のスプリント・TODO（随時更新）

- [x] フロントエンド全画面実装（5画面完了 — reframing-journeyプロトタイプ）
- [ ] [Sprint 1.2] Prisma Schemaの完全定義（User, ThoughtLog, AnalysisResult, AnalysisScore）
- [ ] [Sprint 1.3] DBマイグレーション & Seed作成
- [ ] [Sprint 1.4] Auth.js (v5) による認証基盤の構築
- [ ] [Sprint 2.1] Google AI SDK (Gemini) 連携ロジックの構築（完全手動）
- [ ] [Sprint 2.2] API Routes (POST /api/logs) とPrismaの結合
- [ ] [Sprint 3.1] Agility Score算出ロジックの実装（完全手動）
- [ ] [Sprint 3.2] 算出ロジックの単体テスト（境界値対応）
- [ ] フロントエンドプロトタイプ（reframing-journey）との統合
