import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    DemographicDetailsComponent,
    FormsModule,
    DocumentsUploadedComponent,
    HeaderComponent
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
  showRejectModal: boolean = false;
  rowData: any = {};
  serviceType = ''; // Default value

  ngOnInit() {
     // Access the state object
     const state = history.state;

     // Retrieve role and row data
     this.role = state.role || '';
     this.rowData = state.data || {};
     // Retrieve serviceType from rowData
    this.serviceType = this.rowData['Service Type'] || '';
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
  }
  escalateApplication() {
    // Escalate logic 
    this.showEscalateModal = false;
  }

  rejectApplication() {
    // Reject logic 
    this.showRejectModal = false;
  }
  // Method to change tabs
  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }
}
