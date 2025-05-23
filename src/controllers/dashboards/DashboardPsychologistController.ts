import { Request, Response } from "express";
import { DashboardPsychologistService } from "../../services/dashboards/DashboardPsychologistService";

class DashboardPsychologistController {
    async handle(req: Request, res: Response) {
        const { cpf_psychologist } = req.body;

        const dashboardPsychologistService = new DashboardPsychologistService();

        try {
            const dashboardData = await dashboardPsychologistService.execute(cpf_psychologist);
            return res.json(dashboardData);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export { DashboardPsychologistController };