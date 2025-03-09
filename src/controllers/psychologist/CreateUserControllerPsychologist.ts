import { Request, Response } from "express";
import {CreateUserServicePsychologist} from '../../services/psychologist/CreateUserServicePsychologist';

class CreateUserControllerPsychologist{
    async handle(req: Request, res: Response){
        const { name, email, password, cellphone_number } = req.body;

        const createUserServicePsychologist =  new CreateUserServicePsychologist();
        const user = await createUserServicePsychologist.execute({
            name,email,password,status: "disponivel",cellphone_number
        });

        return res.json(user)
    }
}

export {CreateUserControllerPsychologist}


