import { Op } from 'sequelize';
import { User } from '../models/user';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { sendSuccessResponse, sendCreatedResponse, sendErrorResponse, sendNotFoundResponse } from '../utils/responseHandler';
import dotenv from 'dotenv';

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('avatar');

export default class UserController {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.BUCKET_REGION,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY!,
                secretAccessKey: process.env.SECRET_ACCESS_KEY!,
            },
        });
    }

    createUser = async (req: any, res: any) => {
        try {
            const user = await User.create(req.body);
            sendCreatedResponse(res, user);
        } catch (error) {
            sendErrorResponse(res, error);
        }
    };

    getAllUser = async (req: any, res: any) => {
        try {
            const users = await User.findAll();
            sendSuccessResponse(res, users, 'Users retrieved successfully');
        } catch (error) {
            sendErrorResponse(res, error, 404);
        }
    };

    getUserById = async (req: any, res: any) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                sendSuccessResponse(res, user, 'User retrieved successfully');
            } else {
                sendNotFoundResponse(res);
            }
        } catch (error) {
            sendErrorResponse(res, error);
        }
    };

    updateUser = async (req: any, res: any) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                await user.update(req.body);
                sendSuccessResponse(res, user, 'User updated successfully');
            } else {
                sendNotFoundResponse(res);
            }
        } catch (error) {
            sendErrorResponse(res, error);
        }
    };

    deleteUser = async (req: any, res: any) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                await user.destroy();
                res.status(204).send();
            } else {
                sendNotFoundResponse(res);
            }
        } catch (error) {
            sendErrorResponse(res, error);
        }
    };

    searchUserByName = async (req: any, res: any) => {
        try {
            const { search } = req.query;
            if (!search) {
                return sendErrorResponse(res, { message: 'Search query is required' }, 400);
            }
            const users = await User.findAll({
                where: {
                    fullName: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            });
            sendSuccessResponse(res, users, 'Users retrieved successfully');
        } catch (error) {
            sendErrorResponse(res, error);
        }
    };

    uploadAvatar = async (req: any, res: any) => {
        upload(req, res, async (err: any) => {
            if (err) {
                return sendErrorResponse(res, err);
            }

            if (!req.file) {
                return sendErrorResponse(res, { message: 'No file uploaded' }, 400);
            }

            try {
                const user = await User.findByPk(req.params.id);
                if (!user) {
                    return sendNotFoundResponse(res);
                }

                const params = {
                    Bucket: process.env.BUCKET_NAME!,
                    Key: `avatars/${req.file.originalname}-${Date.now()}`,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                };

                const command = new PutObjectCommand(params);
                await this.s3Client.send(command);

                const avatarUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${params.Key}`;

                await user.update({ imgUrl:avatarUrl });
                sendSuccessResponse(res, { avatarUrl }, 'Avatar uploaded successfully');
            } catch (error) {
                sendErrorResponse(res, error);
            }
        });
    };
}
