import { Op } from 'sequelize';
import UserController from '../../controllers/userController';
import { User } from '../../models/user';
import { 
    sendSuccessResponse, 
    sendCreatedResponse, 
    sendErrorResponse, 
    sendNotFoundResponse 
} from '../../utils/responseHandler';

jest.mock('../../models/user');
jest.mock('../../utils/responseHandler');

describe('UserController', () => {
    let req: any;
    let res: any;
    let userController: UserController;

    beforeEach(() => {
        userController = new UserController();
        req = {
            body: {
                name: 'Hoang Truong',
                email: 'ht@example.com'
            },
            params: {
                id: 'e385968b-349c-4af6-8472-2398d9324f78'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a user and send a created response', async () => {
            const mockUser = { ...req.body };
            (User.create as jest.Mock).mockResolvedValue(mockUser);

            await userController.createUser(req, res);

            expect(User.create).toHaveBeenCalledWith(req.body);
            expect(sendCreatedResponse).toHaveBeenCalledWith(res, mockUser);
        });

        it('should send an error response if user creation fails', async () => {
            const error = new Error('User creation failed');
            (User.create as jest.Mock).mockRejectedValue(error);

            await userController.createUser(req, res);

            expect(User.create).toHaveBeenCalledWith(req.body);
            expect(sendErrorResponse).toHaveBeenCalledWith(res, error);
        });
    });

    describe('getAllUser', () => {
        it('should retrieve all users and send a success response', async () => {
            const mockUsers = [{ ...req.params, ...req.body }];
            (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

            await userController.getAllUser(req, res);

            expect(User.findAll).toHaveBeenCalled();
            expect(sendSuccessResponse).toHaveBeenCalledWith(res, mockUsers, 'Users retrieved successfully');
        });

        it('should send an error response if retrieval fails', async () => {
            const error = new Error('Retrieval failed');
            (User.findAll as jest.Mock).mockRejectedValue(error);

            await userController.getAllUser(req, res);

            expect(User.findAll).toHaveBeenCalled();
            expect(sendErrorResponse).toHaveBeenCalledWith(res, error, 404);
        });
    });

    describe('getUserById', () => {
        it('should retrieve a user by id and send a success response', async () => {
            const mockUser = { ...req.params, ...req.body };
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            await userController.getUserById(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(sendSuccessResponse).toHaveBeenCalledWith(res, mockUser, 'User retrieved successfully');
        });

        it('should send a not found response if user is not found', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await userController.getUserById(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(sendNotFoundResponse).toHaveBeenCalledWith(res);
        });

        it('should send an error response if retrieval fails', async () => {
            const error = new Error('Retrieval failed');
            (User.findByPk as jest.Mock).mockRejectedValue(error);

            await userController.getUserById(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(sendErrorResponse).toHaveBeenCalledWith(res, error);
        });
    });

    describe('updateUser', () => {
        it('should update a user and send a success response', async () => {
            const mockUser = { update: jest.fn().mockResolvedValue({ ...req.body }) };
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            await userController.updateUser(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(mockUser.update).toHaveBeenCalledWith(req.body);
            expect(sendSuccessResponse).toHaveBeenCalledWith(res, mockUser, 'User updated successfully');
        });

        it('should send a not found response if user is not found', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await userController.updateUser(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(sendNotFoundResponse).toHaveBeenCalledWith(res);
        });

        it('should send an error response if update fails', async () => {
            const error = new Error('Update failed');
            (User.findByPk as jest.Mock).mockRejectedValue(error);

            await userController.updateUser(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(sendErrorResponse).toHaveBeenCalledWith(res, error);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and send a no content response', async () => {
            const mockUser = { destroy: jest.fn().mockResolvedValue({}) };
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            await userController.deleteUser(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(mockUser.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should send a not found response if user is not found', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await userController.deleteUser(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(sendNotFoundResponse).toHaveBeenCalledWith(res);
        });

        it('should send an error response if deletion fails', async () => {
            const error = new Error('Deletion failed');
            (User.findByPk as jest.Mock).mockRejectedValue(error);

            await userController.deleteUser(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(req.params.id);
            expect(sendErrorResponse).toHaveBeenCalledWith(res, error);
        });
    });

    describe('searchUserByName', () => {
        it('should return users matching the search query case-insensitively', async () => {
            const mockUsers = [
                { fullName: 'Hoang Truong', email: 'example@example.com' },
                { fullName: 'Hoang Nhat', email: 'Nhat@example.com' }
            ];
            req.query = { search: 'hoang' };

            (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

            await userController.searchUserByName(req, res);

            expect(User.findAll).toHaveBeenCalledWith({
                where: {
                    fullName: {
                        [Op.iLike]: `%${req.query.search}%`
                    }
                }
            });
            expect(sendSuccessResponse).toHaveBeenCalledWith(res, mockUsers, 'Users retrieved successfully');
        });


        it('should return a 400 error if search query is missing', async () => {
            req.query = {};

            await userController.searchUserByName(req, res);

            expect(sendErrorResponse).toHaveBeenCalledWith(res, { message: 'Search query is required' }, 400);
        });

        it('should send an error response if search fails', async () => {
            const error = new Error('Search failed');
            req.query = { search: 'hoang' };

            (User.findAll as jest.Mock).mockRejectedValue(error);

            await userController.searchUserByName(req, res);

            expect(User.findAll).toHaveBeenCalledWith({
                where: {
                    fullName: {
                        [Op.iLike]: `%${req.query.search}%`
                    }
                }
            });
            expect(sendErrorResponse).toHaveBeenCalledWith(res, error);
        });
    });
});
