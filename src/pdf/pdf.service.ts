import { Inject, Injectable } from '@nestjs/common';
import { Author } from 'authors/entities/author.entity';
import { CreateBookDto } from 'books/dto/create-book.dto';
import { ServicePdf } from 'common/interfaces/service-pdf/service-pdf.interface';
import { mkdir, unlink } from 'fs/promises';
import jsPDF from 'jspdf';
import { join } from 'path';

@Injectable()
export class PdfService implements ServicePdf {
  constructor(@Inject('JsPdf') private readonly jsPdf: jsPDF) {}

  getPath(filename: string) {
    return join(__dirname, '..', '..', '..', 'pdfs', `${filename}.pdf`);
  }

  async remove(filename: string) {
    await unlink(join(__dirname, '..', '..', '..', 'pdfs', `${filename}.pdf`));
  }

  async generate(book: CreateBookDto, author: Author, filename: string) {
    await this.ensureFolderExists();
    this.writeBookCover(book, author);
    const contentByPage = this.splitContentByPages(book.content);
    this.writeContentPages(contentByPage, book);
    this.jsPdf.save(join(__dirname, '..', '..', '..', 'pdfs', `${filename}.pdf`));
    this.jsPdf.close();
    return filename;
  }

  private async ensureFolderExists() {
    try {
      await mkdir(join(__dirname, '..', '..', '..', 'pdfs'));
    } catch (error) {}
  }

  private writeBookCover(book: CreateBookDto, author: Author) {
    this.jsPdf.setFont('Times', 'BoldItalic');
    this.jsPdf.setFontSize(48);
    this.jsPdf.text(book.name, 95, 30, { maxWidth: 190, align: 'center' });
    this.jsPdf.setFontSize(26);
    this.jsPdf.text(book.description, 95, 65, { maxWidth: 190, align: 'center' });
    this.jsPdf.text(`Written by: ${author.name}`, 95, 230, { maxWidth: 190, align: 'center' });
  }

  private splitContentByPages(content: string) {
    const lines = content.split('. ');
    const result: string[] = [];

    for (let i = 0; i < lines.length; i += 10) {
      const pageContent = lines.slice(i, i + 10).join('. ');
      result.push(pageContent);
    }
    return result;
  }

  private writeContentPages(contentByPage: string[], book: CreateBookDto) {
    this.jsPdf.setFont('times', 'normal');
    contentByPage.forEach((content) => {
      this.jsPdf.setFontSize(20);
      this.jsPdf.addPage();
      this.jsPdf.text(content, 10, 30, { maxWidth: 190, align: 'justify' });
      this.jsPdf.setFontSize(14);
      this.jsPdf.text(`Page ${this.jsPdf.getNumberOfPages() - 1}`, 10, 290, { maxWidth: 190, align: 'justify' });
    });
  }
}
