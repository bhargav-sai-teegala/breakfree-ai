import '@testing-library/jest-dom'

// Provide a dummy API key so gemini.ts module-level guard does not throw during tests
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? 'test-api-key'
