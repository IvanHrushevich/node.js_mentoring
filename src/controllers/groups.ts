import express from 'express';

import { GroupDAO } from '../data-access/index';
import { GroupsModel } from '../models/index';
import { Group, SeqUpdateResponse } from '../interfaces/index';
import { GroupService } from '../services/index';
import { HttpError } from '../utils/index';
import { errorHandled } from '../logging/index';

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

class GroupsController {
    @errorHandled
    async getById(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        const group: Group | null = await groupService.getGroupById(id);

        if (group) {
            res.json(group);
        } else {
            throw errorNotFoundById;
        }
    }

    @errorHandled
    async getAllGroups(req: express.Request, res: express.Response) {
        const groups: Group[] = await groupService.getAllGroups();
        res.json(groups);
    }

    @errorHandled
    async postGroup(req: express.Request, res: express.Response) {
        const group = req.body;

        try {
            const savedGroup: Group = await groupService.saveGroup(group);
            res.status(201).json(savedGroup);
        } catch (err) {
            const error: HttpError = createErrorBadRequest(err);
            throw error;
        }
    }

    @errorHandled
    async postAddUsersToGroup(req: express.Request, res: express.Response) {
        const groupId: string = req.params.id;
        const userIds: string[] = req.body;

        try {
            const result = await groupService.addUsersToGroup(groupId, userIds);
            res.status(200).json(result);
        } catch (err) {
            const error: HttpError = createErrorBadRequest(err);
            throw error;
        }
    }

    @errorHandled
    async putGroupById(req: express.Request, res: express.Response) {
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
            throw error;
        }
    }

    @errorHandled
    async deleteGroupById(req: express.Request, res: express.Response) {
        const id: string = req.params.id;

        try {
            const result: number = await groupService.deleteGroup(id);
            res.status(200).json(result);
        } catch (error) {
            throw errorNotFoundById;
        }
    }
}

const groupsController: GroupsController = new GroupsController();

export const groupsRouter: express.Router = express.Router();

groupsRouter.get('/:id', groupsController.getById);
groupsRouter.get('/', groupsController.getAllGroups);
groupsRouter.post('/addUsersToGroup/:id', groupsController.postAddUsersToGroup);
groupsRouter.post('/', groupsController.postGroup);
groupsRouter.put('/:id', groupsController.putGroupById);
groupsRouter.delete('/:id', groupsController.deleteGroupById);
