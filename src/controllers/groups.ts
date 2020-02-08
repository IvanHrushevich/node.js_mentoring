import express from 'express';

import { GroupDAO } from '../data-access/index';
import { groupModel } from '../models/index';
import { Group, SeqUpdateResponse } from '../interfaces/index';
import { GroupService } from '../services/index';

const groupDAO: GroupDAO = new GroupDAO(groupModel);
const groupService = new GroupService(groupDAO);

const getById: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const id: string = req.params.id;
    const group: Group | null = await groupService.getGroupById(id);

    if (group) {
        res.json(group);
    } else {
        res.sendStatus(404);
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
    res: express.Response
) => Promise<void> = async (req, res) => {
    const group = req.body;

    try {
        const savedGroup: Group = await groupService.saveGroup(group);
        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(400).json(error);
    }
};

const putGroupById: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const id: string = req.params.id;
    const reqGroup: Group = req.body;

    try {
        const result: SeqUpdateResponse<Group> = await groupService.updateGroup(
            id,
            reqGroup
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
};

const deleteGroupById: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const id: string = req.params.id;

    try {
        const result: number = await groupService.deleteGroup(id);
        res.status(200).json(result);
    } catch (error) {
        res.sendStatus(404);
    }
};

export const groupsRouter: express.Router = express.Router();

groupsRouter.get('/:id', getById);
groupsRouter.get('/', getAllGroups);
groupsRouter.post('/', postGroup);
groupsRouter.put('/:id', putGroupById);
groupsRouter.delete('/:id', deleteGroupById);
