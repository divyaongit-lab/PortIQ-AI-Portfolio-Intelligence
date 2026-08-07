// GinMar · Phase I seed data — mirrors Account_Portfolio_App_Data_v2.xlsx

export const CLIENTS = [
  { id:'C001', name:'Alpha Manufacturing GmbH', industry:'Manufacturing', country:'Germany', manager:'Divya Pinto',  status:'Active'   },
  { id:'C002', name:'Nova Utilities Ltd.',       industry:'Utilities',     country:'Germany', manager:'Divya Pinto',  status:'Active'   },
  { id:'C003', name:'Orion Retail Group',        industry:'Retail',        country:'UK',      manager:'A. Sharma',    status:'Active'   },
  { id:'C004', name:'Green Energy Solutions',    industry:'Energy',        country:'Germany', manager:'M. Rao',       status:'Active'   },
  { id:'C005', name:'Metro Logistics',           industry:'Logistics',     country:'USA',     manager:'S. Iyer',      status:'Inactive' },
]

export const PROJECTS = [
  { id:'P001', name:'SAP Analytics Rollout',       clientId:'C001', type:'Transformation', billing:'T&M',         start:'2025-01-01', end:'2025-12-31', status:'Active',    manager:'John Smith'  },
  { id:'P002', name:'Application Support',          clientId:'C001', type:'CRS',            billing:'Fixed Price', start:'2025-02-01', end:'2025-12-31', status:'Active',    manager:'John Smith'  },
  { id:'P003', name:'Data Platform Modernization',  clientId:'C002', type:'Long Project',   billing:'T&M',         start:'2025-03-01', end:'2026-02-28', status:'Active',    manager:'Maria Lee'   },
  { id:'P004', name:'Power BI Enhancements',        clientId:'C003', type:'Others',         billing:'T&M',         start:'2025-04-01', end:'2025-09-30', status:'Completed', manager:'David Kim'   },
]

export const STAFF = [
  { id:'E001', name:'Amit Kumar',  role:'Data Engineer',       dept:'Data',      costRate:25, status:'Active' },
  { id:'E002', name:'Priya Nair',  role:'Power BI Consultant', dept:'Analytics', costRate:30, status:'Active' },
  { id:'E003', name:'Rahul Singh', role:'Project Manager',     dept:'PMO',       costRate:45, status:'Active' },
  { id:'E004', name:'Sneha Rao',   role:'QA Engineer',         dept:'QA',        costRate:20, status:'Active' },
]

export const TIME_ENTRIES = [
  { id:'T001', date:'2025-05-01', empId:'E001', projId:'P001', hoursWorked:8, billableHours:8, nonBillable:0 },
  { id:'T002', date:'2025-05-01', empId:'E002', projId:'P001', hoursWorked:8, billableHours:7, nonBillable:1 },
  { id:'T003', date:'2025-05-02', empId:'E003', projId:'P002', hoursWorked:8, billableHours:8, nonBillable:0 },
  { id:'T004', date:'2025-05-03', empId:'E004', projId:'P003', hoursWorked:8, billableHours:6, nonBillable:2 },
]

export const EXPENSES = [
  { id:'X001', date:'2025-05-05', projId:'P001', category:'Travel',   amount:850, currency:'EUR', billable:true  },
  { id:'X002', date:'2025-05-08', projId:'P002', category:'Software', amount:500, currency:'EUR', billable:true  },
  { id:'X003', date:'2025-05-09', projId:'P003', category:'Training', amount:300, currency:'EUR', billable:false },
]

export const INVOICES = [
  { id:'I001', no:'INV-1001', date:'2025-05-31', clientId:'C001', projId:'P001', amount:15000, currency:'EUR', status:'Paid'  },
  { id:'I002', no:'INV-1002', date:'2025-05-31', clientId:'C001', projId:'P002', amount:8000,  currency:'EUR', status:'Sent'  },
  { id:'I003', no:'INV-1003', date:'2025-05-31', clientId:'C002', projId:'P003', amount:22000, currency:'EUR', status:'Paid'  },
  { id:'I004', no:'INV-1004', date:'2025-05-31', clientId:'C003', projId:'P004', amount:6000,  currency:'EUR', status:'Draft' },
]

export const PROJECT_STAFF_RATES = [
  { id:'R001', projId:'P001', empId:'E001', billingRate:75  },
  { id:'R002', projId:'P001', empId:'E002', billingRate:90  },
  { id:'R003', projId:'P002', empId:'E003', billingRate:120 },
  { id:'R004', projId:'P003', empId:'E004', billingRate:60  },
]
