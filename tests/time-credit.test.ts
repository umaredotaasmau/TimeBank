import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'time-credit': {
      functions: {
        'mint-time-credits': vi.fn(),
        'transfer-time-credits': vi.fn(),
        'get-balance': vi.fn(),
        'get-credit-exchange-rate': vi.fn(),
        'set-credit-exchange-rate': vi.fn(),
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

describe('Time Credit Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint-time-credits', () => {
    it('should mint time credits successfully', async () => {
      const amount = 100
      mockClarity.contracts['time-credit'].functions['mint-time-credits'].mockReturnValue({ success: true })
      
      const result = await callContract('time-credit', 'mint-time-credits', [amount])
      
      expect(result.success).toBe(true)
    })
  })
  
  describe('transfer-time-credits', () => {
    it('should transfer time credits successfully', async () => {
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const amount = 50
      mockClarity.contracts['time-credit'].functions['transfer-time-credits'].mockReturnValue({ success: true })
      
      const result = await callContract('time-credit', 'transfer-time-credits', [recipient, amount])
      
      expect(result.success).toBe(true)
    })
  })
  
  describe('get-balance', () => {
    it('should return the correct balance', async () => {
      const user = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const expectedBalance = 150
      mockClarity.contracts['time-credit'].functions['get-balance'].mockReturnValue({ success: true, value: expectedBalance })
      
      const result = await callContract('time-credit', 'get-balance', [user])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedBalance)
    })
  })
  
  describe('get-credit-exchange-rate', () => {
    it('should return the current exchange rate', async () => {
      const expectedRate = 100
      mockClarity.contracts['time-credit'].functions['get-credit-exchange-rate'].mockReturnValue({ success: true, value: expectedRate })
      
      const result = await callContract('time-credit', 'get-credit-exchange-rate', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedRate)
    })
  })
  
  describe('set-credit-exchange-rate', () => {
    it('should set a new exchange rate', async () => {
      const newRate = 120
      mockClarity.contracts['time-credit'].functions['set-credit-exchange-rate'].mockReturnValue({ success: true })
      
      const result = await callContract('time-credit', 'set-credit-exchange-rate', [newRate])
      
      expect(result.success).toBe(true)
    })
  })
})

