import { childService } from '@/services/api/children';
import { api } from '@/services/api/client';
import { CreateChildRequest, UpdateChildRequest } from '@/types';

// Mock the API client
jest.mock('@/services/api/client', () => ({
  api: {
    postMultipart: jest.fn(),
    putMultipart: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('childService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWithAvatar', () => {
    const baseChildData: CreateChildRequest = {
      name: 'Test Child',
      birthday: '2024-01-15',
      gender: 'male',
    };

    it('should construct FormData with required child fields', async () => {
      mockedApi.postMultipart.mockResolvedValue({ child: { id: 1, ...baseChildData } });

      await childService.createWithAvatar(baseChildData, null);

      expect(mockedApi.postMultipart).toHaveBeenCalledTimes(1);
      const [endpoint, formData] = mockedApi.postMultipart.mock.calls[0];
      
      expect(endpoint).toBe('/children');
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('name')).toBe('Test Child');
      expect(formData.get('birthday')).toBe('2024-01-15');
      expect(formData.get('gender')).toBe('male');
    });

    it('should include optional fields when provided', async () => {
      const dataWithOptionals: CreateChildRequest = {
        ...baseChildData,
        birth_weight: 3.5,
        birth_height: 50,
      };
      mockedApi.postMultipart.mockResolvedValue({ child: { id: 1, ...dataWithOptionals } });

      await childService.createWithAvatar(dataWithOptionals, null);

      const [, formData] = mockedApi.postMultipart.mock.calls[0];
      expect(formData.get('birth_weight')).toBe('3.5');
      expect(formData.get('birth_height')).toBe('50');
    });

    it('should attach avatar file when file:// URI is provided', async () => {
      mockedApi.postMultipart.mockResolvedValue({ child: { id: 1, ...baseChildData } });
      const avatarUri = 'file:///path/to/avatar.jpg';

      await childService.createWithAvatar(baseChildData, avatarUri);

      const [, formData] = mockedApi.postMultipart.mock.calls[0];
      const avatarField = formData.get('avatar');
      expect(avatarField).toBeTruthy();
    });

    it('should not attach avatar when URI is null', async () => {
      mockedApi.postMultipart.mockResolvedValue({ child: { id: 1, ...baseChildData } });

      await childService.createWithAvatar(baseChildData, null);

      const [, formData] = mockedApi.postMultipart.mock.calls[0];
      expect(formData.get('avatar')).toBeNull();
    });

    it('should not attach avatar when URI is an http URL', async () => {
      mockedApi.postMultipart.mockResolvedValue({ child: { id: 1, ...baseChildData } });
      const httpUrl = 'https://example.com/avatar.jpg';

      await childService.createWithAvatar(baseChildData, httpUrl);

      const [, formData] = mockedApi.postMultipart.mock.calls[0];
      expect(formData.get('avatar')).toBeNull();
    });

    it('should call api.postMultipart with /children endpoint', async () => {
      mockedApi.postMultipart.mockResolvedValue({ child: { id: 1, ...baseChildData } });

      await childService.createWithAvatar(baseChildData, null);

      expect(mockedApi.postMultipart).toHaveBeenCalledWith('/children', expect.any(FormData));
    });

    it('should return the child object from response', async () => {
      const expectedChild = { id: 1, ...baseChildData, avatar_url: null };
      mockedApi.postMultipart.mockResolvedValue({ child: expectedChild });

      const result = await childService.createWithAvatar(baseChildData, null);

      expect(result).toEqual(expectedChild);
    });
  });

  describe('updateWithAvatar', () => {
    const childId = 123;
    const baseUpdateData: UpdateChildRequest = {
      name: 'Updated Child',
      birthday: '2024-02-20',
      gender: 'female',
    };

    it('should construct FormData with update fields', async () => {
      mockedApi.putMultipart.mockResolvedValue({ child: { id: childId, ...baseUpdateData } });

      await childService.updateWithAvatar(childId, baseUpdateData, null);

      expect(mockedApi.putMultipart).toHaveBeenCalledTimes(1);
      const [endpoint, formData] = mockedApi.putMultipart.mock.calls[0];
      
      expect(endpoint).toBe(`/children/${childId}`);
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('name')).toBe('Updated Child');
      expect(formData.get('birthday')).toBe('2024-02-20');
      expect(formData.get('gender')).toBe('female');
    });

    it('should attach avatar file when file:// URI is provided', async () => {
      mockedApi.putMultipart.mockResolvedValue({ child: { id: childId, ...baseUpdateData } });
      const avatarUri = 'file:///path/to/new-avatar.png';

      await childService.updateWithAvatar(childId, baseUpdateData, avatarUri);

      const [, formData] = mockedApi.putMultipart.mock.calls[0];
      const avatarField = formData.get('avatar');
      expect(avatarField).toBeTruthy();
    });

    it('should not attach avatar when URI is null', async () => {
      mockedApi.putMultipart.mockResolvedValue({ child: { id: childId, ...baseUpdateData } });

      await childService.updateWithAvatar(childId, baseUpdateData, null);

      const [, formData] = mockedApi.putMultipart.mock.calls[0];
      expect(formData.get('avatar')).toBeNull();
    });

    it('should not attach avatar when URI is an http URL (unchanged avatar)', async () => {
      mockedApi.putMultipart.mockResolvedValue({ child: { id: childId, ...baseUpdateData } });
      const existingAvatarUrl = 'https://api.example.com/storage/avatars/existing.jpg';

      await childService.updateWithAvatar(childId, baseUpdateData, existingAvatarUrl);

      const [, formData] = mockedApi.putMultipart.mock.calls[0];
      expect(formData.get('avatar')).toBeNull();
    });

    it('should call api.putMultipart with /children/{id} endpoint', async () => {
      mockedApi.putMultipart.mockResolvedValue({ child: { id: childId, ...baseUpdateData } });

      await childService.updateWithAvatar(childId, baseUpdateData, null);

      expect(mockedApi.putMultipart).toHaveBeenCalledWith(`/children/${childId}`, expect.any(FormData));
    });

    it('should return the updated child object from response', async () => {
      const expectedChild = { id: childId, ...baseUpdateData, avatar_url: 'new-avatar.jpg' };
      mockedApi.putMultipart.mockResolvedValue({ child: expectedChild });

      const result = await childService.updateWithAvatar(childId, baseUpdateData, null);

      expect(result).toEqual(expectedChild);
    });

    it('should only include provided fields in FormData', async () => {
      const partialUpdate: UpdateChildRequest = {
        name: 'Only Name Updated',
      };
      mockedApi.putMultipart.mockResolvedValue({ child: { id: childId, name: 'Only Name Updated' } });

      await childService.updateWithAvatar(childId, partialUpdate, null);

      const [, formData] = mockedApi.putMultipart.mock.calls[0];
      expect(formData.get('name')).toBe('Only Name Updated');
      expect(formData.get('birthday')).toBeNull();
      expect(formData.get('gender')).toBeNull();
    });
  });
});
