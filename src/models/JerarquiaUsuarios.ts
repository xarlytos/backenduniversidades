import { Schema, model, Document, Types } from 'mongoose';

export interface IJerarquiaUsuarios extends Document {
  _id: string;
  usuarioSuperior: Types.ObjectId;
  usuariosSubordinados: Types.ObjectId[];
  descripcion?: string;
  creadoPor?: Types.ObjectId;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jerarquiaUsuariosSchema = new Schema<IJerarquiaUsuarios>({
  usuarioSuperior: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  usuariosSubordinados: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  descripcion: {
    type: String,
    trim: true
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices
jerarquiaUsuariosSchema.index({ usuarioSuperior: 1 }, { unique: true });
jerarquiaUsuariosSchema.index({ usuariosSubordinados: 1 });

export const JerarquiaUsuarios = model<IJerarquiaUsuarios>('JerarquiaUsuarios', jerarquiaUsuariosSchema);