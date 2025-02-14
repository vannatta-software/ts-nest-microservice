import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoreController } from './core.controller';

@Module({
    imports: [
        ServeStaticModule.forRoot({ 
            rootPath: join(__dirname, "..", "..", "frontend", "dist") 
        })
    ],
    controllers: [CoreController],
    providers: []
})
export class CoreModule {}
