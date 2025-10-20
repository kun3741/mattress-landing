-- Insert default survey questions
insert into public.survey_questions (question_id, question_text, question_type, options, next_question_logic, order_index) values
  ('sleep_position', 'Як ви зазвичай спите?', 'single', 
   '["На спині", "На боці", "На животі", "Комбіновано"]'::jsonb,
   '{}'::jsonb, 1),
  
  ('weight', 'Ваша вага?', 'single',
   '["До 60 кг", "60-80 кг", "80-100 кг", "Понад 100 кг"]'::jsonb,
   '{}'::jsonb, 2),
  
  ('back_problems', 'Чи є у вас проблеми зі спиною?', 'single',
   '["Так, часто", "Іноді", "Рідко", "Ні"]'::jsonb,
   '{}'::jsonb, 3),
  
  ('mattress_firmness', 'Яку жорсткість матрацу ви віддаєте перевагу?', 'single',
   '["М''який", "Середньої жорсткості", "Жорсткий", "Не знаю"]'::jsonb,
   '{}'::jsonb, 4),
  
  ('budget', 'Ваш бюджет на матрац?', 'single',
   '["До 10 000 грн", "10 000 - 20 000 грн", "20 000 - 30 000 грн", "Понад 30 000 грн"]'::jsonb,
   '{}'::jsonb, 5),
  
  ('size', 'Який розмір матрацу вам потрібен?', 'single',
   '["80x190 см (односпальний)", "90x200 см (односпальний)", "140x200 см (напівторний)", "160x200 см (двоспальний)", "180x200 см (двоспальний)", "200x200 см (двоспальний)"]'::jsonb,
   '{}'::jsonb, 6)
on conflict (question_id) do nothing;

-- Insert default site content
insert into public.site_content (key, value) values
  ('hero', '{
    "title": "Професійний підбір матрацу",
    "subtitle": "Знайдіть ідеальний матрац за 3 хвилини",
    "description": "Наш алгоритм проаналізує ваші потреби та запропонує найкращі варіанти з 12 фабрик-партнерів"
  }'::jsonb),
  
  ('benefits', '{
    "items": [
      {"icon": "Clock", "title": "Економія часу", "description": "Не потрібно об''їжджати десятки магазинів"},
      {"icon": "Brain", "title": "Професійний алгоритм", "description": "Підбір на основі ваших індивідуальних потреб"},
      {"icon": "Factory", "title": "12 фабрик-партнерів", "description": "Доступ до найкращих виробників України"}
    ]
  }'::jsonb),
  
  ('contacts', '{
    "phone": "+380 XX XXX XX XX",
    "email": "info@mattress.ua",
    "address": "м. Київ, вул. Прикладна, 1"
  }'::jsonb),
  
  ('factories', '{
    "list": [
      "Sleep Master", "Dream Comfort", "Ortho Plus", "Eco Sleep",
      "Premium Rest", "Healthy Sleep", "Comfort Zone", "Night Dreams",
      "Perfect Sleep", "Royal Mattress", "Elite Rest", "Smart Sleep"
    ]
  }'::jsonb)
on conflict (key) do nothing;
