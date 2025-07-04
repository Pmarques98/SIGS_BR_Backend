import prismaClient from '../../prisma';

interface ConsultationRequest {
    description: string;
    cpf_user: string;
    cpf_paciente: string;
    data_consultation: string;
}

class CreateConsultationService {
    async execute({ description, cpf_user, cpf_paciente, data_consultation }: ConsultationRequest) {
        // Verificar se todos os campos obrigatórios foram enviados
        if (!description || !cpf_user || !data_consultation || !cpf_paciente) {
            throw new Error("Todos os campos são obrigatórios");
        }

        // Verificar se a criança está cadastrada
        const childExists = await prismaClient.children.findFirst({
            where: {
                cpf_child: cpf_paciente
            }
        });

        if (!childExists) {
            throw new Error("Criança não cadastrada, favor cadastrar");
        }

        // Verificar se a data da consulta está com menos de 2 horas de antecedência
        const consultationDate = new Date(data_consultation);
        let currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 3); // Diminuir 3 horas do currentDate
        const timeDifference = (consultationDate.getTime() - currentDate.getTime()) / (1000 * 60); // Diferença em minutos

        if (timeDifference < 20) { // 20 minutos
            throw new Error("A data da consulta deve ser marcada com pelo menos 20 minutos de antecedência.");
        }

        // Verificar se o cpf_paciente já tem uma consulta no mesmo dia
        const startOfDay = new Date(consultationDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(consultationDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingConsultation = await prismaClient.consultation.findFirst({
            where: {
                cpf_paciente: cpf_paciente,
                data_consultation: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        if (existingConsultation) {
            throw new Error("O paciente já tem uma consulta marcada para este dia.");
        }

        // Criar a consulta no banco de dados com o link do Google Meet
        const consultation = await prismaClient.consultation.create({
            data: {
                description,
                cpf_user,
                cpf_paciente,
                data_consultation: consultationDate,
                link_meets: "https://meet.google.com/new" // Link genérico do Google Meet (que será substituído quando o organizador entrar)
            }
        });

        return consultation;
    }
}

export { CreateConsultationService };