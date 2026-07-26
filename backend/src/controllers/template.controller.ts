import { Request, Response } from "express";

import { TemplateService } from "../prompt/template.service";

export class TemplateController {

    static getAll(

        req: Request,

        res: Response

    ) {

        return res.json({

            success: true,

            data: TemplateService.all()

        });

    }

}