export interface Document {
    documentId: number;          // Unique document identifier
    bucketName: string;         // Name of the S3 bucket where the file is stored
    key: string;                // S3 object key (unique within the bucket)
    fileName: string;           // Original file name (if available)
    contentType: string;        // MIME type of the file
    contentLength: bigint;      // Size of the file in bytes
    lastModified: Date;         // Date and time when the file was last modified
    createdAt: Date;            // Date and time when the record was created
    updatedAt: Date;            // Date and time when the record was last updated
    status: string;
}