#### Dependências

```
npm install @supabase/supabase-js
```

#### Supabase Client
// src/lib/supabaseClient.ts
```
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Env

NEXT_PUBLIC_SUPABASE_URL=seu-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-supabase-anon-key

#### Supabase