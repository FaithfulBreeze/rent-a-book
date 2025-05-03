import { Module, Scope } from '@nestjs/common';
import jspdf from 'jspdf';
import { PdfService } from './pdf.service';

@Module({
  providers: [{ provide: 'JsPdf', useClass: jspdf, scope: Scope.REQUEST }, PdfService],
  exports: ['JsPdf', PdfService],
})
export class PdfModule {}
