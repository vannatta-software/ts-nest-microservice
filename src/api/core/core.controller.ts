import { Controller, Get } from '@nestjs/common';

@Controller()
export class CoreController {

    @Get('hc')
    getHealth(): string {
        return 'Healthy';
    }
} 