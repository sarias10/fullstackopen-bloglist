import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Después de cada prueba se restablece jsdom
afterEach(() => {
  cleanup()
})