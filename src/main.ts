import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS
  app.enableCors({
    origin: [
      'http://localhost:4200', // Local Angular development server
      'https://your-frontend-app.onrender.com', // Replace with your actual Render frontend URL
      process.env.FRONTEND_URL, // Environment variable for flexibility
    ].filter(Boolean), // Remove undefined values
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
    ],
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Deskbird API')
    .setDescription('API documentation for Deskbird backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
