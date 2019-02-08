interface Message {
    channel?: string;
    sender: string;
    content: string;
    timestamp?: number;
}