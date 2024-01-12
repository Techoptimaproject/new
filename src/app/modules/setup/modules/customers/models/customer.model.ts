// export interface Customer {
//     custId: number;
//     custName: string;
//     custCode: string;
//     addressId: string;   
//     emailId: string;
//     phoneNumber: number; 
//     taxId  :string;
//     startDate:Date;
//     endDate:Date;
//     status:string
//     logoUrlPath:string;
// }

// export interface Customer{

//     custId:number;
//     custName:string;
//     custCode:string,
//     taxId:number,
//     startDate:Date,
//     endDate:Date,
//     status:boolean
// }

export interface Customer {
    custId:number;
    custName: string;
    custCode: string;
    addressId: string;
    emailId: string;
    phoneNumber: number;
    taxId: string;
    startDate: string;
    endDate: string;
    status:string;
    logoUrlPath :string;
    address: string;
    state: string;
    city: string;
    zipCode: number;
    fontColor: string;
    primaryColor: string;
    secondaryColor: string;
    created_by:string;
    option: string;
}