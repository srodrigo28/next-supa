#### > 1. Criando projeto
```
npx create-next-app@14 nomeProjeto
```

#### > 2. Dependências
```
npm install @supabase/supabase-js
```

```
npm install react-input-mask
npm install --save-dev  @types/react-input-mask
```

#### > 3. variaveis de ambiente
```
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

#### > 4. conexao supabase
```
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### > 5. Página inicial  pages/auth.tsx

#### > 6. Next Image config
```
/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https', // ou 'http' se desejar liberar ambos
          hostname: '**', // aceita qualquer domínio
        },
      ],
    },
  };  

export default nextConfig;
```