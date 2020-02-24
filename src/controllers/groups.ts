import express from 'express';

import { GroupDAO } from '../data-access/index';
import { GroupsModel } from '../models/index';
import { Group, SeqUpdateResponse } from '../interfaces/index';
import { GroupService } from '../services/index';
import { HttpError } from '../utils/index';

export const groupDAO: GroupDAO = new GroupDAO(GroupsModel);
const groupService = new GroupService(groupDAO);

const errorNotFoundById: HttpError = new HttpError(
    404,
    'Not found',
    'No group was found by specified id'
);

const createErrorBadRequest: (detail: any) => HttpError = (detail = '') => {
    return new HttpError(400, 'Bad request', detail);
};

const getById: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
    const id: string = req.params.id;
    const group: Group | null = await groupService.getGroupById(id);

    if (group) {
        res.json(group);
    } else {
        next(errorNotFoundById);
    }
};

const getAllGroups: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const groups: Group[] = await groupService.getAllGroups();
    res.json(groups);
};

const postGroup: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
    const group = req.body;

    try {
        const savedGroup: Group = await groupService.saveGroup(group);
        res.status(201).json(savedGroup);
    } catch (err) {
        const error: HttpError = createErrorBadRequest(err);
        next(error);
    }
};

const postAddUsersToGroup: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
    const groupId: string = req.params.id;
    const userIds: string[] = req.body;

    try {
        const result = await groupService.addUsersToGroup(groupId, userIds);
        res.status(200).json(result);
    } catch (err) {
        const error: HttpError = createErrorBadRequest(err);
        next(error);
    }
};

const putGroupById: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
    const id: string = req.params.id;
    const reqGroup: Group = req.body;

    try {
        const result: SeqUpdateResponse<Group> = await groupService.updateGroup(
            id,
            reqGroup
        );
        res.status(200).json(result);
    } catch (err) {
        const error: HttpError = createErrorBadRequest(err);
        next(error);
    }
};

const deleteGroupById: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => Promise<void> = async (req, res, next) => {
    const id: string = req.params.id;

    try {
        const result: number = await groupService.deleteGroup(id);
        res.status(200).json(result);
    } catch (error) {
        next(errorNotFoundById);
    }
};

export const groupsRouter: express.Router = express.Router();

groupsRouter.get('/:id', getById);
groupsRouter.get('/', getAllGroups);
groupsRouter.post('/addUsersToGroup/:id', postAddUsersToGroup);
groupsRouter.post('/', postGroup);
groupsRouter.put('/:id', putGroupById);
groupsRouter.delete('/:id', deleteGroupById);
