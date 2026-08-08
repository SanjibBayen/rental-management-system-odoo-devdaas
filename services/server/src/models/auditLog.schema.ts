const auditLogSchema = `
  CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL, 
    entity_type VARCHAR(100) NOT NULL, 
    entity_id UUID,
    action VARCHAR(100) NOT NULL, 
    old_values JSONB, 
    new_values JSONB, 
    ip_address INET, 
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export default auditLogSchema;
