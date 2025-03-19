import { Component } from '@angular/core';
import { PdfService } from '../../service/pdf.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedFile: File | null = null;
  convertedImage: string | null = null;
  showModal: boolean = false;
  loading: boolean = false;

  constructor(private pdfService: PdfService) {} 

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.convertedImage = null;
  }

  async convertPdf() {
    if (!this.selectedFile) {
      return;
    }
    
    this.loading = true;
    
    try {
      const imageBlob = await this.pdfService.convertPdfToImage(this.selectedFile);
      if (imageBlob) {
        this.convertedImage = URL.createObjectURL(imageBlob);
        this.showModal = true;
      }
    } catch (error) {
      console.error('Error converting PDF:', error);
    } finally {
      this.loading = false;
    }
  }

  downloadImage() {
    if (this.convertedImage) {
      const link = document.createElement('a');
      link.href = this.convertedImage;
      link.download = 'converted-image.png';
      link.click();
    }
  }
  
  closeModal(){
    this.showModal = false;
  }
}