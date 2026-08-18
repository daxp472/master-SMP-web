import { Schema, model, Document } from "mongoose";

export interface IAuditLog extends Document {
  actor: string;
  action: string;
  target?: string;
  metadata?: Record<string, any>;
  ip?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actor: { type: String, required: true, index: true },
  action: { type: String, required: true, index: true },
  target: { type: String },
  metadata: { type: Schema.Types.Mixed },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
});

export const AuditLog = model<IAuditLog>("AuditLog", AuditLogSchema);
