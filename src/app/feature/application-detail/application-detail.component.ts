import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import { APPLICANT_NAME, APPLICATION_ID, APPLICATION_STATUS, APPROVE, AUTO_RETRIEVE_NIN_DETAILS, BACK, CREATED_DATE, DEMOGRAPHIC_DETAILS, DOCUMENTS_UPLOADED, ESCALATE, ESCALATION_REASON_FROM_MVS_OFFICER, ESCALATION_REASON_FROM_MVS_SUPERVISOR, MVS_DISTRICT_OFFICER, REJECT, SCHEDULE_INTERVIEW, SERVICE, SERVICE_TYPE, UPLOAD_DCOUMENTS } from '../../shared/constants';
import { HttpClientModule } from '@angular/common/http';
import { DataStorageService } from '../../core/services/data-storage.service';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    DemographicDetailsComponent,
    FormsModule,
    DocumentsUploadedComponent,
    HeaderComponent,
    HttpClientModule
  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})

export class ApplicationDetailComponent implements OnInit {
  role: string = '';
  selectedTab: string = 'demographic'; // Default to 'demographic'
  escalateOption: boolean = false;
  showApprovalModal: boolean = false;
  showEscalateModal: boolean = false;
  showScheduleInterviewModal: boolean = false;
  showDocumentUploadModal: boolean = false;
  showRejectModal: boolean = false;
  rowData: any = {};
  applicationStatus: string = '';
  interviewDetails = {
    subject: '',
    content: '',
    districtOffice: ''
  };

  service: string = '';
  serviceType: string = ''; // Default value
  approvalComment: string = '';
  applicationId: string = '';
  commentMVSOfficer: string = '';
  commentMVSSupervisor: string = ''
  escalationComment: string = '';
  rejectionCategory: string = '';
  rejectionComment: string = '';

  isEditable: boolean = false;
  documents = [
    { category: '', title: '', fileName: '', uploaded: false, file: null } // Added `file` to store file reference
  ];

  constants = {
    MVS_DISTRICT_OFFICER,
    APPLICATION_ID,
    SERVICE,
    SERVICE_TYPE,
    ESCALATION_REASON_FROM_MVS_OFFICER,
    ESCALATION_REASON_FROM_MVS_SUPERVISOR,
    APPLICATION_STATUS,
    DEMOGRAPHIC_DETAILS,
    DOCUMENTS_UPLOADED,
    AUTO_RETRIEVE_NIN_DETAILS,
    BACK,
    APPROVE,
    REJECT,
    ESCALATE,
    SCHEDULE_INTERVIEW,
    UPLOAD_DCOUMENTS: 'Upload Documents',
    APPLICANT_NAME
  }

  // Sample Data
  districtOffices: string[] = ['District Office 1', 'District Office 2', 'District Office 3'];
  // documents = [
  //   { category: '', title: '', fileName: '', uploaded: false }, // Initial document row
  // ];

  docCategories = ['Category 1', 'Category 2', 'Category 3']; // Example categories
  docTitles = ['Title 1', 'Title 2', 'Title 3']; // Example titles
  applicantName = 'Steve Smith' //field value will come from the /applications/{appId} api response

  constructor(private router: Router, private dataService: DataStorageService) { }

  ngOnInit() {
    const state = history.state;

    this.role = state.role || '';
    this.rowData = state.data || {};
    if (this.role === 'MVS_DISTRICT_OFFICER' || this.role === 'MVS_LEGAL_OFFICER') {
      this.applicationStatus = this.rowData['Application Status'];
    }

    this.serviceType = this.rowData['Service Type'] || '';
    this.applicationId = this.rowData['Application ID'] || '';
    this.service = this.rowData['Service'] || '';
    this.commentMVSOfficer = this.rowData["Escalation Comment From MVS Officer"] || '';
    this.commentMVSSupervisor = this.rowData["Escalation Comment From MVS Supervisor"] || '';


  }

  changeApplicationStatus(status: string, comment: string = '', rejectionCategory: string = '') {
    const applicationId = this.rowData.applicationId;
    this.dataService
      .changeStatus(applicationId, status, comment, rejectionCategory)
      .subscribe(
        (response) => {
          console.log('Status updated successfully:', response);
          alert(`Application ${status.toLowerCase()}d successfully.`);
          this.router.navigate(['/application-detail']);
        },
        (error) => {
          console.error('Error updating status:', error);
          alert('Failed to update status. Please try again.');
        });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  goBack() {
    this.router.navigate(['/application-list'], {
      state: { role: this.role, data: history.state.data }
    });
  }
  openApprovalModal() {
    this.showApprovalModal = true;
  }
  openEscalateModal() {
    this.showEscalateModal = true;
  }

  closeEscalateModal() {
    this.showEscalateModal = false;
  }

  openScheduleInterviewModal() {
    this.showScheduleInterviewModal = true;
  }
  closeScheduleInterviewModal() {
    this.showScheduleInterviewModal = false;
  }

  openDocumentUploadwModal() {
    this.showDocumentUploadModal = true;
  }
  closeDocumentUploadModal() {
    this.showDocumentUploadModal = false;
  }

  openRejectModal() {
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
  }
  closeApprovalModal() {
    this.showApprovalModal = false;
  }
  approveApplication() {
    // Approval logic
    this.showApprovalModal = false;
    const comment = this.approvalComment.trim();
    this.changeApplicationStatus('APPROVE', comment);
    this.closeEscalateModal();
  }
  escalateApplication() {
    // Escalate logic 
    this.showEscalateModal = false;
    const comment = this.escalationComment.trim();
    this.changeApplicationStatus('ESCALATE', comment);
    this.closeEscalateModal();
  }

  rejectApplication() {
    // Reject logic 
    this.showRejectModal = false;
    const rejectionCategory = this.rejectionCategory;
    const comment = this.rejectionComment.trim();
    this.changeApplicationStatus('REJECT', comment, rejectionCategory);
    this.closeRejectModal();
  }
  // Method to change tabs
  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  // Check if the form is valid
  isFormValid(): boolean {
    const { subject, content, districtOffice } = this.interviewDetails;
    return subject.trim() !== '' && content.trim() !== '' && districtOffice.trim() !== '';
  }

  // Send invite logic
  sendInvite() {
    if (this.isFormValid()) {
      console.log('Sending Invite:', this.interviewDetails);
      const applicationId = this.rowData.applicationId;
      this.dataService.scheduleInterview(applicationId, this.interviewDetails)
        .subscribe(
          (response: any) => {
            if (response?.response?.status === "Success") {
              alert('Interview scheduled successfully.');
              this.closeScheduleInterviewModal();
              this.router.navigate(['/application-list'], {
                state: { role: this.role, data: history.state.data }
              });
            } else {
              alert('Failed to schedule the interview. Please try again.');
            }
          },
          (error) => {
            console.error('Error scheduling interview:', error);
            alert('An error occurred while scheduling the interview. Please try again later.');

          });
    } else {
      alert('Please fill all the required fields.');
    }
  }

  uploadFile(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      this.documents[index].fileName = fileName;
      this.documents[index].file = file;
      this.documents[index].uploaded = true;
      this.uploadDocument(file, index);
    }
  }
  // Method to upload a single document
  uploadDocument(file: File, index: number) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileBytes = new Uint8Array(reader.result as ArrayBuffer); // Convert file to byte array

      const payload = {
        id: 'id',
        version: 'v1',
        requesttime: new Date().toISOString(),
        metadata: null,
        request: {
          documents: {
            proofOfAddress: {
              document: Array.from(fileBytes), 
              value: 'proofOfAddress', 
              type: 'DOC004', 
              format: file.name.split('.').pop() // Extract file extension
            }
          }
        }
      };

      // Make API call via DataStorageService
      this.dataService.uploadDocuments(this.applicationId, payload).subscribe(
        (response) => {
          if (response?.response?.status === 'Success') {
            alert('Document uploaded successfully.');
            this.documents[index].uploaded = true; // Update upload status
          } else {
            alert('Failed to upload document. Please try again.');
          }
        },
        (error) => {
          console.error('Error uploading document:', error);
          alert('An error occurred while uploading the document.');
        }
      );
    };

    reader.readAsArrayBuffer(file); // Read file as an ArrayBuffer
  }

  // Handle upload action
  // handleUpload(index: number) {
  //   if (this.documents[index].fileName) {
  //     this.documents[index].uploaded = true; 
  //   }
  // }

  // Add a new document row
  addDocumentRow() {
    this.documents.push({ category: '', title: '', fileName: '', uploaded: false, file: null });
  }

  // Confirm and approve action
  confirmAndApprove() {
    console.log('Uploaded Documents:', this.documents);
    // Implement further actions, e.g., API call to save documents
  }
}
