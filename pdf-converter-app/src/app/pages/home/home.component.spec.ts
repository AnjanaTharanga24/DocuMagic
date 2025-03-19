import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pdf-converter',
  templateUrl: './pdf-converter.component.html',
  styleUrls: ['./pdf-converter.component.css']
})
export class HomeComponent {
  selectedFile: File | null = null;
  convertedImage: string | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.errorMessage = null;
    } else {
      this.selectedFile = null;
      this.errorMessage = 'Please select a valid PDF file.';
    }
  }

  convertPdf(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'No file selected.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('/convert', formData, { responseType: 'arraybuffer' })
      .subscribe(
        (response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'image/png' });
          const imageUrl = URL.createObjectURL(blob);
          this.convertedImage = imageUrl; 
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Failed to convert PDF to image.';
          this.isLoading = false;
        }
      );
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