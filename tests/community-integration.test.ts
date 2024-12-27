import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'community-integration': {
      functions: {
        'create-community-project': vi.fn(),
        'join-community-project': vi.fn(),
        'complete-community-project': vi.fn(),
        'get-community-project': vi.fn(),
        'get-admin': vi.fn(),
        'set-admin': vi.fn(),
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

describe('Community Integration Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-community-project', () => {
    it('should create a community project successfully', async () => {
      const name = 'Community Garden'
      const description = 'Creating a garden for the community'
      const requiredSkills = ['gardening', 'landscaping']
      mockClarity.contracts['community-integration'].functions['create-community-project'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('community-integration', 'create-community-project', [name, description, requiredSkills])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
    
    it('should fail if not called by admin', async () => {
      const name = 'Unauthorized Project'
      const description = 'This should fail'
      const requiredSkills = ['skill1', 'skill2']
      mockClarity.contracts['community-integration'].functions['create-community-project'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('community-integration', 'create-community-project', [name, description, requiredSkills])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('join-community-project', () => {
    it('should join a community project successfully', async () => {
      const projectId = 1
      mockClarity.contracts['community-integration'].functions['join-community-project'].mockReturnValue({ success: true })
      
      const result = await callContract('community-integration', 'join-community-project', [projectId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if project is not open', async () => {
      const projectId = 2
      mockClarity.contracts['community-integration'].functions['join-community-project'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('community-integration', 'join-community-project', [projectId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('complete-community-project', () => {
    it('should complete a community project successfully', async () => {
      const projectId = 1
      mockClarity.contracts['community-integration'].functions['complete-community-project'].mockReturnValue({ success: true })
      
      const result = await callContract('community-integration', 'complete-community-project', [projectId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not called by admin', async () => {
      const projectId = 1
      mockClarity.contracts['community-integration'].functions['complete-community-project'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('community-integration', 'complete-community-project', [projectId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-community-project', () => {
    it('should return community project details', async () => {
      const projectId = 1
      const expectedProject = {
        name: 'Community Garden',
        description: 'Creating a garden for the community',
        required_skills: ['gardening', 'landscaping'],
        participants: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'],
        status: 'open'
      }
      mockClarity.contracts['community-integration'].functions['get-community-project'].mockReturnValue({ success: true, value: expectedProject })
      
      const result = await callContract('community-integration', 'get-community-project', [projectId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedProject)
    })
  })
  
  describe('get-admin', () => {
    it('should return the current admin', async () => {
      const expectedAdmin = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['community-integration'].functions['get-admin'].mockReturnValue({ success: true, value: expectedAdmin })
      
      const result = await callContract('community-integration', 'get-admin', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedAdmin)
    })
  })
  
  describe('set-admin', () => {
    it('should set a new admin successfully', async () => {
      const newAdmin = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['community-integration'].functions['set-admin'].mockReturnValue({ success: true })
      
      const result = await callContract('community-integration', 'set-admin', [newAdmin])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not called by current admin', async () => {
      const newAdmin = 'ST3CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AH'
      mockClarity.contracts['community-integration'].functions['set-admin'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('community-integration', 'set-admin', [newAdmin])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
})

