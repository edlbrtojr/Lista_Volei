-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  num_pessoas INTEGER NOT NULL,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_inscricao TIMESTAMP WITH TIME ZONE NOT NULL,
  mensagem TEXT NOT NULL,
  local TEXT NOT NULL,
  duracao TEXT NOT NULL,
  quadra TEXT NOT NULL,
  preco_hora DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  nome TEXT NOT NULL,
  ip TEXT NOT NULL,
  pagou BOOLEAN DEFAULT FALSE,
  data TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);