import '@testing-library/jest-dom'

// Mock ResizeObserver cho recharts
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Suppress act() warnings trong test environment
const originalError = console.error
beforeEach(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterEach(() => {
  console.error = originalError
})
