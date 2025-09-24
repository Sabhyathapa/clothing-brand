// Removed Vite types reference (not needed for CRA)

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly REACT_APP_SUPABASE_URL: string
      readonly REACT_APP_SUPABASE_ANON_KEY: string
    }
  }
}

export {} 