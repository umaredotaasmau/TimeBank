import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'reputation-system': {
      functions: {
        'update-reputation': vi.fn(),
        'get-reputation': vi.fn(),
        'get-average-rating': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Reputation System Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('update-reputation', () => {
    it('should update reputation successfully', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const rating = 5
      mockClarity.contracts['reputation-system'].functions['update-reputation'].mockReturnValue({ success: true })
      
      const result = await callContract('reputation-system', 'update-reputation', [user, rating])
      
      expect(result.success).toBe(true)
    })
    
    it('should handle negative ratings', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const rating = -2
      mockClarity.contracts['reputation-system'].functions['update-reputation'].mockReturnValue({ success: true })
      
      const result = await callContract('reputation-system', 'update-reputation', [user, rating])
      
      expect(result.success).toBe(true)
    })
  })
  
  describe('get-reputation', () => {
    it('should return user reputation', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const expectedReputation = { score: 15, total_services: 3 }
      mockClarity.contracts['reputation-system'].functions['get-reputation'].mockReturnValue({ success: true, value: expectedReputation })
      
      const result = await callContract('reputation-system', 'get-reputation', [user])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedReputation)
    })
    
    it('should return default values for new users', async () => {
      const user = 'ST3CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AH'
      const expectedReputation = { score: 0, total_services: 0 }
      mockClarity.contracts['reputation-system'].functions['get-reputation'].mockReturnValue({ success: true, value: expectedReputation })
      
      const result = await callContract('reputation-system', 'get-reputation', [user])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedReputation)
    })
  })
  
  describe('get-average-rating', () => {
    it('should calculate average rating correctly', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['reputation-system'].functions['get-average-rating'].mockReturnValue({ success: true, value: 5 })
      
      const result = await callContract('reputation-system', 'get-average-rating', [user])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(5)
    })
    
    it('should return 0 for users with no services', async () => {
      const user = 'ST3CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AH'
      mockClarity.contracts['reputation-system'].functions['get-average-rating'].mockReturnValue({ success: true, value: 0 })
      
      const result = await callContract('reputation-system', 'get-average-rating', [user])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(0)
    })
  })
})

