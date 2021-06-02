import axios from 'axios';
import UserDetail from '../UserDetail/UserDetail';
import SynologyApi from './Synology';
import storage from '../../utils/LocalStorage/LocalStorage';

jest.mock('axios');
jest.mock('../UserDetail/UserDetail');
jest.mock('../../utils/LocalStorage/LocalStorage');

describe('SynologyApi', () => {
  const flushPromises = () => new Promise(setImmediate);
  it('signin should call api and set storage', async () => {
    // Given
    (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        data: {
          sid: 'mock_sid',
        },
        success: true,
      },
    });
    // When
    await SynologyApi.signIn();
    await flushPromises();
    // Then
    expect(axios.get).toHaveBeenCalled();
    expect(storage.set).toHaveBeenCalledWith('synology_sid', 'mock_sid');
  });
  it('list should call api 1 time if already sign-in', async () => {
    // Given
    (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
    (storage.get as jest.Mock).mockResolvedValue('mock_sid');
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        data: {},
        success: true,
      },
    });
    // When
    await SynologyApi.list('path');
    await flushPromises();
    // Then
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
  it('list should call api 2 time if not sign-in', async () => {
    // Given
    (UserDetail.getAccessToken as jest.Mock).mockReturnValue('access_token');
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        data: {},
        success: true,
      },
    });
    // When
    await SynologyApi.list('path');
    await flushPromises();
    // Then
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});
