import { Router, Request, Response } from "express";
import {CreateUserController} from './controllers/user/CreateUserController'
import {AuthUserController} from './controllers/user/AuthUserController'

const router = Router();

router.get('/teste', (req: Request, res: Response) => {
    return res.json({ ok : true})
})

//rotas users
router.post('/cadastro', new CreateUserController().handle)
router.post('/login', new AuthUserController().handle)

export {router};