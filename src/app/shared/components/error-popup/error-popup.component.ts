import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
})
export class ErrorPopupComponent {
  message: string = '';
  okButtonText = 'OK';

  constructor(
    private dialogRef: MatDialogRef<ErrorPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.okButtonText = data.buttonText.ok || this.okButtonText;
      }
    }
    // this.dialogRef.updateSize('70vw', '50vh');
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
