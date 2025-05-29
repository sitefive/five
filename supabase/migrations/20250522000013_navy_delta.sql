/*
  # Add settings management

  1. New Tables
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value_pt` (jsonb)
      - `value_en` (jsonb)
      - `value_es` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on settings table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value_pt jsonb,
  value_en jsonb,
  value_es jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Settings are viewable by everyone"
  ON settings
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can manage settings
CREATE POLICY "Settings can be managed by authenticated users"
  ON settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (key, value_pt, value_en, value_es) VALUES
('site', 
  jsonb_build_object(
    'title', 'FIVE Consulting',
    'description', 'Consultoria especializada em sistemas de RH',
    'keywords', 'consultoria, RH, sistemas, tecnologia',
    'social', jsonb_build_object(
      'facebook', '',
      'instagram', '',
      'linkedin', '',
      'whatsapp', ''
    ),
    'contact', jsonb_build_object(
      'email', 'contato@fiveconsulting.com.br',
      'phone', '(11) 91066-6444'
    ),
    'footer', jsonb_build_object(
      'text', 'Somos especialistas em transformar desafios em oportunidades através de soluções inovadoras.',
      'copyright', '© 2025 FIVE Consulting. Todos os direitos reservados.'
    )
  ),
  jsonb_build_object(
    'title', 'FIVE Consulting',
    'description', 'Specialized consulting in HR systems',
    'keywords', 'consulting, HR, systems, technology',
    'social', jsonb_build_object(
      'facebook', '',
      'instagram', '',
      'linkedin', '',
      'whatsapp', ''
    ),
    'contact', jsonb_build_object(
      'email', 'contact@fiveconsulting.com.br',
      'phone', '(11) 91066-6444'
    ),
    'footer', jsonb_build_object(
      'text', 'We are experts in transforming challenges into opportunities through innovative solutions.',
      'copyright', '© 2025 FIVE Consulting. All rights reserved.'
    )
  ),
  jsonb_build_object(
    'title', 'FIVE Consulting',
    'description', 'Consultoría especializada en sistemas de RRHH',
    'keywords', 'consultoría, RRHH, sistemas, tecnología',
    'social', jsonb_build_object(
      'facebook', '',
      'instagram', '',
      'linkedin', '',
      'whatsapp', ''
    ),
    'contact', jsonb_build_object(
      'email', 'contacto@fiveconsulting.com.br',
      'phone', '(11) 91066-6444'
    ),
    'footer', jsonb_build_object(
      'text', 'Somos expertos en transformar desafíos en oportunidades a través de soluciones innovadoras.',
      'copyright', '© 2025 FIVE Consulting. Todos los derechos reservados.'
    )
  )
);