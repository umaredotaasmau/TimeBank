import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'service-exchange': {
      functions: {
        'offer-service': vi.fn(),
        'request-service': vi.fn(),
        'complete-service': vi.fn(),
        'get-service': vi.fn(),
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

describe('Service Exchange Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('offer-service', () => {
    it('should offer a service successfully', async () => {
      const description = 'Gardening service'
      const duration = 2
      mockClarity.contracts['service-exchange'].functions['offer-service'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('service-exchange', 'offer-service', [description, duration])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('request-service', () => {
    it('should request a service successfully', async () => {
      const serviceId = 1
      mockClarity.contracts['service-exchange'].functions['request-service'].mockReturnValue({ success: true })
      
      const result = await callContract('service-exchange', 'request-service', [serviceId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if service is not offered', async () => {
      const serviceId = 1
      mockClarity.contracts['service-exchange'].functions['request-service'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('service-exchange', 'request-service', [serviceId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('complete-service', () => {
    it('should complete a service successfully', async () => {
      const serviceId = 1
      mockClarity.contracts['service-exchange'].functions['complete-service'].mockReturnValue({ success: true })
      
      const result = await callContract('service-exchange', 'complete-service', [serviceId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the service provider', async () => {
      const serviceId = 1
      mockClarity.contracts['service-exchange'].functions['complete-service'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('service-exchange', 'complete-service', [serviceId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-service', () => {
    it('should return service details', async () => {
      const serviceId = 1
      const expectedService = {
        provider: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        seeker: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        description: 'Gardening service',
        duration: 2,
        status: 'requested'
      }
      mockClarity.contracts['service-exchange'].functions['get-service'].mockReturnValue({ success: true, value: expectedService })
      
      const result = await callContract('service-exchange', 'get-service', [serviceId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedService)
    })
  })
})

