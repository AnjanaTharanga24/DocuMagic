import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedFile: File | null = null;
  convertedImage: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  imageBlob: Blob | null = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.convertedImage = null;
  }

  async convertPdf(){
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    try {
      const response = await axios.post('http://localhost:8080/convert', formData, {
        responseType: 'arraybuffer', 
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      this.convertedImage = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to convert PDF to image:', error);
    }
  }

  downloadImage(): void {
    if (this.convertedImage) {
      const link = document.createElement('a');
      link.href = this.convertedImage;
      link.download = 'converted-image.png';
      link.click();
    }
  }
}
