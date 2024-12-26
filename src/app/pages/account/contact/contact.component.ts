import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  formData = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  };

  constructor(public apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  async onSubmit(contactForm: any) {
    try {
      if (contactForm.valid) {
        console.log('Form Data:', this.formData);
        const data = {
          fullname: this.formData.firstName + ' ' + this.formData.lastName,
          email: this.formData.email,
          phone: this.formData.phone,
          message: this.formData.message
        }
        const response = await this.apiService.sendMessage(data)
        console.log(response);

        if(response.msg){
          this.toastr.success('Your message has been sent successfully!', 'Success');
          
          this.formData = {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            message: ''
          };
        }

      } else {
        console.log('Form is invalid');
      }
    } catch (error) {
      console.log(error);
      this.toastr.error('An error occurred while sending your message.', 'Error');
    }
  }
}
