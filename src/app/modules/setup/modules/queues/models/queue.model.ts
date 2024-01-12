export interface Queue {
    queueId: number;         // Unique role identifier
    queueName: string;       // Name of the Queue
    description: string;     // Description of the Queue
    active: boolean;         // Indicates if role is active
    effFrom: Date;           // Effective from Date(Start Date)
    effThru: Date;           // Effective through Date (End Date)
    code: string;            // Code of the queue
    isMaster: boolean;       // is Master queue or not.
}